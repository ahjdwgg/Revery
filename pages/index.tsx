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

    const [isLoadingRecommendGroups, setIsLoadingRecommendGroups] = useState(true);
    const [isLoadingRecommendGroupMembers, setIsLoadingRecommendGroupMembers] = useState(true);
    const [recommendGroups, setRecommendGroups] = useState<GroupInfo[]>([]);
    const [recommendGroupMembers, setRecommendGroupMembers] = useState<UserItems[]>([]);

    const init = async () => {
        const LoginUser = RSS3.getLoginUser();
        if (LoginUser.persona || (await RSS3.reconnect())) {
            setLoggedIn(true);
        }
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
        const timestamp = [...content].pop()?.date_created || '';
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
            await getRecommendationGroups(recommendGroups[0].key);
        } // else false
        setIsLoadingRecommendGroups(false);
    };

    const getRecommendationGroups = async (type: string) => {
        setIsLoadingRecommendGroupMembers(true);
        const recommendGroupMemberIndexes = await RSS3.getRecommendGroupMembers(type);
        if (recommendGroupMemberIndexes.length) {
            const recommendGroupMembers = await Promise.all(
                recommendGroupMemberIndexes.map(async (memberIndex) => {
                    const { extracted } = utils.extractEmbedFields(memberIndex.profile?.bio || '', []);
                    return {
                        username: memberIndex.profile?.name || '',
                        avatarUrl: memberIndex.profile?.avatar?.[0] || config.undefinedImageAlt,
                        bio: extracted,
                        ethAddress: memberIndex.id,
                        rns: await RNS.addr2Name(memberIndex.id),
                    };
                }),
            );
            setRecommendGroupMembers(recommendGroupMembers);
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
                                <section className="flex flex-col items-center justify-start gap-y-2.5">
                                    {[...Array(8)].map((_, id) => (
                                        <ContentItemLoader key={id} />
                                    ))}
                                </section>
                            ) : content.length ? (
                                <section className="flex flex-col items-center justify-start gap-y-2.5">
                                    {content.map((item, index) => {
                                        if (item.id.includes('auto')) {
                                            return (
                                                <ItemCard
                                                    key={index}
                                                    avatarUrl={item.avatar}
                                                    username={item.username}
                                                    content={item.summary || null}
                                                    asset={item.details}
                                                    timeStamp={new Date(item.date_updated).valueOf()}
                                                    target={item.target}
                                                    toUserProfile={async () =>
                                                        await router.push(
                                                            `/u/${await RNS.tryName(item.target.field.split('-')[2])}`,
                                                        )
                                                    }
                                                    showAssetDetail={() => fetchAssetDetail(item.target.field)}
                                                />
                                            );
                                        } else {
                                            return (
                                                <ContentCard
                                                    key={index}
                                                    avatarUrl={item.avatar}
                                                    username={item.username}
                                                    title={item.title}
                                                    content={item.summary}
                                                    timeStamp={new Date(item.date_updated).valueOf()}
                                                />
                                            );
                                        }
                                    })}
                                    {haveMoreContent ? (
                                        <div className="flex flex-row justify-center w-full py-8">
                                            {isLoadingMore ? (
                                                <Button
                                                    isOutlined={false}
                                                    color={COLORS.primary}
                                                    icon={'loading'}
                                                    width={'w-32'}
                                                    height={'h-8'}
                                                />
                                            ) : (
                                                <Button
                                                    isOutlined={false}
                                                    color={COLORS.primary}
                                                    text={'Load more'}
                                                    width={'w-32'}
                                                    height={'h-8'}
                                                    onClick={loadMoreContent}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full py-8 text-sm text-center">{"That's all :p"}</div>
                                    )}
                                </section>
                            ) : (
                                <div className="flex flex-col gap-2 w-full py-32 text-sm text-center">
                                    <p>{'Oops, nothing found from your followings:P'}</p>
                                    <p>{'Check out some new friends from recommendations for you!'}</p>
                                </div>
                            )}
                        </>
                    </section>
                    <section className="flex flex-col gap-4 pb-16 w-4/11">
                        <RecommendSection
                            groups={recommendGroups}
                            members={recommendGroupMembers}
                            toGroup={getRecommendationGroups}
                            toUserPage={toUserPage}
                            isLoadingGroups={isLoadingRecommendGroups}
                            isLoadingMembers={isLoadingRecommendGroupMembers}
                        />
                    </section>
                </div>
            ) : (
                <div className="flex flex-col justify-start max-w-6xl px-2 pt-80 mx-auto gap-y-8 h-full">
                    <p className="font-semibold text-4xl">This is a closed beta test for Revery and RSS3 v0.3.1.</p>
                    <p className="text-xl">Please noted that your profile and data will be deleted after the test.</p>
                </div>
            )}
            <Modal
                hidden={modal.hidden}
                closeEvent={closeModal}
                theme={'primary'}
                isCenter={modal.type === 'account'}
                size={modal.type === 'account' ? 'md' : 'lg'}
            >
                {modal.details ? getModalDisplay() : <ModalLoading color={'primary'} />}
            </Modal>
        </>
    );
};

export default Home;
