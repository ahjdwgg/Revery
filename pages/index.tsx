import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { RSS3Account, RSS3ID } from '../common/rss3Types';
import AccountItem from '../components/accounts/AccountItem';
import AssetCard, { AssetCardButtonMode } from '../components/assets/AssetCard';
import FootprintCard from '../components/assets/FootprintCard';
import ContentCard from '../components/content/ContentCard';
import Header from '../components/Header';
import ImageHolder from '../components/ImageHolder';
import Profile from '../components/profile/Profile';
import RSS3 from '../common/rss3';
import config from '../common/config';
import EVMpAccountItem from '../components/accounts/EVMpAccountItem';
import utils from '../common/utils';
import Events from '../common/events';
import NFTItem from '../components/assets/NFTItem';

import Modal, { ModalColorStyle } from '../components/modal/Modal';
import ModalLoading from '../components/modal/ModalLoading';
import SingleNFT from '../components/details/SingleNFT';
import SingleDonation from '../components/details/SingleDonation';
import SingleFootprint from '../components/details/SingleFootprint';
import Button from '../components/buttons/Button';
import { utils as RSS3Utils } from 'rss3';
import { AnyObject } from 'rss3/types/extend';
import ItemCard from '../components/content/ItemCard';
import { BiLoaderCircle } from 'react-icons/bi';
import SingleAccount from '../components/details/SingleAccount';
import { COLORS } from '../components/buttons/variables';
import RecommendSection from '../components/users/RecommendSection';
interface ModalDetail {
    hidden: boolean;
    type: ModalColorStyle;
    details?: AnyObject;
}

const Home: NextPage = () => {
    const router = useRouter();
    const [address, setAddress] = useState<string>('');
    const [website, setWebsite] = useState<string>('');

    const [content, setContent] = useState<any[]>([]);
    const [isContentLoading, setContentLoading] = useState(true);
    const [haveMoreContent, setHaveMoreContent] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [modal, setModal] = useState<ModalDetail>({
        hidden: true,
        type: 'primary',
    });

    const recommendGroups = [...Array(3)].map((_, gid) => ({
        name: 'RSS3',
        intro: 'Want to keep updated on RSS3 news? Follow any of the crew members!',
        avatarUrl: `https://http.cat/10${gid}`,
        users: [...Array(5)].map((_, uid) => ({
            username: `anniiii@${gid}-${uid}`,
            avatarUrl: `https://http.cat/${gid + 2}0${uid}`,
            bio: "CXO @ RSS3, Cat's name's Fendi" + content,
            ethAddress: `0x${gid}${uid}`,
            rns: 'anniiii',
        })),
    }));

    const init = async () => {
        const LoginUser = await RSS3.getLoginUser();
        const pageOwner = await RSS3.setPageOwner(LoginUser.address);
        setTimeout(async () => {
            const { listed, haveMore } = await utils.initContent('', true);
            setContent(listed);
            setHaveMoreContent(haveMore);
            setContentLoading(false);
        }, 0);

        const profile = pageOwner.profile;
        // console.log(pageOwner.assets);
        if (profile) {
            // Profile
            const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);
            setAddress(pageOwner?.address || '');
            setWebsite(fieldsMatch?.['SITE'] || '');
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
            persona: pageOwner.address,
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

    return (
        <>
            <Header />
            <div className="flex flex-row justify-between max-w-6xl px-2 pt-16 mx-auto gap-x-8">
                <section className="divide-y-2 w-7/11 divide-solid divide-opacity-5 divide-primary">
                    <>
                        {isContentLoading ? (
                            <div className="flex flex-row items-center justify-center w-full h-32">
                                <BiLoaderCircle className="w-12 h-12 animate-spin text-primary" />
                            </div>
                        ) : (
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
                                                    await router.push(`/u/${item.target.field.split('-')[2]}`)
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
                                                icon="circle"
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
                        )}
                    </>
                </section>
                <section className="flex flex-col gap-4 pb-16 w-4/11">
                    <RecommendSection groups={recommendGroups} toUserPage={toUserPage} />
                </section>
            </div>
            <Modal
                hidden={modal.hidden}
                closeEvent={closeModal}
                theme={'primary'}
                isCenter={modal.type === 'account'}
                size={modal.type === 'account' ? 'md' : 'lg'}
            >
                {modal.details ? getModalDisplay() : <ModalLoading color={modal.type} />}
            </Modal>
        </>
    );
};

export default Home;
