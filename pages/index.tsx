import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import ContentCard from '../components/content/ContentCard';
import Header from '../components/Header';
import RSS3 from '../common/rss3';
import RNS from '../common/rns';
import utils from '../common/utils';
import Modal, { ModalColorStyle } from '../components/modal/Modal';
import ModalLoading from '../components/modal/ModalLoading';
import SingleNFT from '../components/details/SingleNFT';
import SingleDonation from '../components/details/SingleDonation';
import SingleFootprint from '../components/details/SingleFootprint';
import Button from '../components/buttons/Button';
import { AnyObject } from 'rss3/types/extend';
import ItemCard from '../components/content/ItemCard';
import SingleAccount from '../components/details/SingleAccount';
import { COLORS } from '../components/buttons/variables';
import RecommendSection, { GroupInfo } from '../components/users/RecommendSection';
import ContentItemLoader from '../components/loaders/ContentItemLoader';
import { UserItems } from '../components/users/UserCard';
import config from '../common/config';
import ModalConnect from '../components/modal/ModalConnect';
import LoadMoreButton from '../components/buttons/LoadMoreButton';
interface ModalDetail {
    hidden: boolean;
    type: ModalColorStyle;
    details?: AnyObject;
}

const Home: NextPage = () => {
    const router = useRouter();
    const [address, setAddress] = useState<string>('');
    const [website, setWebsite] = useState<string>('');

    const [isLoggedIn, setLoggedIn] = useState(false);
    const [content, setContent] = useState<any[]>([]);
    const [isContentLoading, setContentLoading] = useState(true);
    const [haveMoreContent, setHaveMoreContent] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [modal, setModal] = useState<ModalDetail>({
        hidden: true,
        type: 'primary',
    });

    const [isConnectModalClosed, setConnectModalClosed] = useState(true);

    const [isLoadingRecommendGroups, setIsLoadingRecommendGroups] = useState(true);
    const [isLoadingRecommendGroupMembers, setIsLoadingRecommendGroupMembers] = useState(true);
    const [recommendGroups, setRecommendGroups] = useState<GroupInfo[]>([]);
    const [recommendGroupMembers, setRecommendGroupMembers] = useState<Record<string, UserItems[]>>({});
    const [currentRecommendGroupType, setCurrentRecommendGroupType] = useState<string>('');

    const init = async () => {
        const LoginUser = RSS3.getLoginUser();
        if (LoginUser.persona || (await RSS3.reconnect())) {
            setLoggedIn(true);

            const pageOwner = await RSS3.setPageOwner(LoginUser.address);

            const profile = pageOwner.profile;
            // console.log(pageOwner.assets);
            if (profile) {
                // Profile
                const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);
                setAddress(pageOwner?.address || '');
                setWebsite(fieldsMatch?.['SITE'] || '');
            }

            setTimeout(async () => {
                const { listed, haveMore } = await utils.initContent('', true);
                setContent(listed);
                setHaveMoreContent(haveMore);
                setContentLoading(false);
            }, 0);

            setTimeout(initRecommendationGrops, 0);
        }
    };

    const toUserPage = async (addr: string) => {
        await router.push(`/u/${addr}`);
    };

    // Initialize

    useEffect(() => {
        if (router.isReady) {
            init();
        }
    }, [router.query.user]);

    useEffect(() => {
        // init();
        setContentLoading(true);
    }, [address]);

    const loadMoreContent = async () => {
        setIsLoadingMore(true);
        const timestamp = [...content].pop()?.item.date_created || '';
        const { listed, haveMore } = await utils.initContent(timestamp, true);
        setContent([...content, ...listed]);
        setHaveMoreContent(haveMore);
        setIsLoadingMore(false);
    };

    const fetchAssetDetail = async (field: string) => {
        const dic: { [key: string]: 'nft' | 'donation' | 'footprint' | 'account' } = {
            'xDai.POAP': 'footprint',
            'Gitcoin.Donation': 'donation',
            'Gitcoin.Grant': 'donation',
            'Polygon.NFT': 'nft',
            'Ethereum.NFT': 'nft',
            'BSC.NFT': 'nft',
        };

        const pageOwner = await RSS3.getPageOwner();

        const asset = await pageOwner.assets?.getDetails({
            assets: [field.replace('assets-', '')],
            full: true,
        });

        if (asset?.length === 1) {
            getModalDetail(asset[0], dic[field.split('-')[3]]);
        }
    };

    const getModalDetail = (asset: AnyObject, type: 'nft' | 'donation' | 'footprint' | 'account') => {
        document.body.style.overflow = 'hidden';
        setModal({
            hidden: false,
            type: type,
            details: asset.detail,
        });
    };

    const getModalDisplay = () => {
        if (modal.type === 'nft') {
            return <SingleNFT NFT={modal.details ? modal.details : {}} />;
        } else if (modal.type === 'donation') {
            return <SingleDonation Gitcoin={modal.details ? modal.details : {}} />;
        } else if (modal.type === 'footprint') {
            return <SingleFootprint POAPInfo={modal.details ? modal.details : {}} />;
        } else if (modal.type == 'account') {
            return <SingleAccount chain={modal.details?.platform} address={modal.details?.identity} />;
        }
    };

    const openConnectModal = () => {
        setConnectModalClosed(false);
    };
    const closeConnectModal = () => {
        setConnectModalClosed(true);
    };

    const closeModal = () => {
        document.body.style.overflow = '';
        setModal({
            hidden: true,
            type: 'primary',
        });
    };

    const initRecommendationGrops = async () => {
        setIsLoadingRecommendGroups(true);
        const recommendGroups = await RSS3.getRecommendGroups();
        if (recommendGroups.length) {
            setRecommendGroups(recommendGroups);
            setIsLoadingRecommendGroups(false);
            setCurrentRecommendGroupType(recommendGroups[0].key);
        } // else false
    };

    useEffect(() => {
        if (currentRecommendGroupType) {
            getRecommendationGroups(currentRecommendGroupType);
        }
    }, [currentRecommendGroupType]);

    const getRecommendationGroups = async (type: string) => {
        setIsLoadingRecommendGroupMembers(true);
        const recommendGroupMemberIndexes = await RSS3.getRecommendGroupMembers(type);
        if (recommendGroupMemberIndexes.length) {
            let _recommendGroupMembers = recommendGroupMemberIndexes.map((memberIndex) => {
                const { extracted } = utils.extractEmbedFields(memberIndex.profile?.bio || '', []);
                return {
                    username: memberIndex.profile?.name || '',
                    avatarUrl: memberIndex.profile?.avatar?.[0] || config.undefinedImageAlt,
                    bio: extracted,
                    ethAddress: memberIndex.id,
                    rns: '',
                };
            }) as UserItems[];
            setIsLoadingRecommendGroupMembers(false);
            setRecommendGroupMembers((v) => ({ ...v, [type]: _recommendGroupMembers }));
            _recommendGroupMembers.forEach(async (m) => {
                m.rns = await RNS.addr2Name(m.ethAddress);
                setRecommendGroupMembers((v) => ({ ...v, [type]: _recommendGroupMembers }));
            });
        }
        setIsLoadingRecommendGroupMembers(false);
    };

    return (
        <>
            <Header />
            {isLoggedIn ? (
                <div className="flex flex-row justify-between max-w-6xl px-2 pt-16 mx-auto gap-x-8">
                    <section className="divide-y-2 w-7/11 divide-solid divide-opacity-5 divide-primary">
                        <>
                            {isContentLoading ? (
                                <section className="flex flex-col items-center justify-start gap-y-2.5 pb-8">
                                    {[...Array(8)].map((_, id) => (
                                        <ContentItemLoader key={id} />
                                    ))}
                                </section>
                            ) : content.length ? (
                                <section className="flex flex-col items-center justify-start gap-y-2.5">
                                    {content.map((element, index) => {
                                        if (element.item.id.includes('auto')) {
                                            return (
                                                <ItemCard
                                                    key={index}
                                                    avatarUrl={element.avatar}
                                                    username={element.name}
                                                    content={element.item.summary}
                                                    asset={element.details}
                                                    timeStamp={new Date(element.item.date_updated).valueOf()}
                                                    target={element.item.target}
                                                    toUserProfile={async () =>
                                                        await router.push(
                                                            `/u/${await RNS.tryName(element.item.id.split('-')[0])}`,
                                                        )
                                                    }
                                                    showAssetDetail={() => fetchAssetDetail(element.item.target.field)}
                                                />
                                            );
                                        } else {
                                            return (
                                                <ContentCard
                                                    key={index}
                                                    avatarUrl={element.avatar}
                                                    username={element.name}
                                                    title={element.item.title}
                                                    content={element.item.summary}
                                                    timeStamp={new Date(element.item.date_updated).valueOf()}
                                                />
                                            );
                                        }
                                    })}
                                    {haveMoreContent ? (
                                        <LoadMoreButton
                                            color={COLORS.primary}
                                            width={'w-32'}
                                            height={'h-8'}
                                            isLoading={isLoadingMore}
                                            onClick={loadMoreContent}
                                        >
                                            {[...Array(3)].map((_, id) => (
                                                <ContentItemLoader key={id} />
                                            ))}
                                        </LoadMoreButton>
                                    ) : (
                                        <div className="w-full pt-8 text-sm text-center">{"That's all :p"}</div>
                                    )}
                                </section>
                            ) : (
                                <div className="flex flex-col w-full gap-2 py-32 text-sm text-center">
                                    <p>{'Oops, nothing found from your followings:P'}</p>
                                    <p>{'Check out some new friends from recommendations for you!'}</p>
                                </div>
                            )}
                        </>
                    </section>
                    <section className="flex flex-col gap-4 pb-16 w-4/11">
                        <RecommendSection
                            groups={recommendGroups}
                            members={recommendGroupMembers[currentRecommendGroupType] ?? []}
                            toGroup={(type) => {
                                setCurrentRecommendGroupType(type);
                            }}
                            toUserPage={toUserPage}
                            isLoadingGroups={isLoadingRecommendGroups}
                            isLoadingMembers={isLoadingRecommendGroupMembers}
                        />
                    </section>
                </div>
            ) : (
                <div className="flex flex-col justify-start h-full max-w-6xl px-2 mx-auto pt-80 gap-y-8">
                    <p className="text-4xl font-semibold">This is a closed beta test for Revery and RSS3 v0.3.1.</p>
                    <p className="text-xl">Please noted that your profile and data will be deleted after the test.</p>
                    <Button
                        isOutlined={false}
                        color={COLORS.primary}
                        fontSize={'text-lg'}
                        text={'Start'}
                        width={'w-40'}
                        height={'h-10'}
                        onClick={openConnectModal}
                    />
                </div>
            )}
            <Modal
                hidden={modal.hidden}
                closeEvent={closeModal}
                theme={'primary'}
                size={modal.type === 'account' ? 'md' : 'lg'}
            >
                {modal.details ? getModalDisplay() : <ModalLoading color={'primary'} />}
            </Modal>
            <ModalConnect hidden={isConnectModalClosed} closeEvent={closeConnectModal} />
        </>
    );
};

export default Home;
