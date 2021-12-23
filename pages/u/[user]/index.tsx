import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import AccountItem from '../../../components/accounts/AccountItem';
import AssetCard, { AssetCardButtonMode } from '../../../components/assets/AssetCard';
import FootprintCard from '../../../components/assets/FootprintCard';
import ContentCard from '../../../components/content/ContentCard';
import Header from '../../../components/Header';
import ImageHolder from '../../../components/ImageHolder';
import Profile from '../../../components/profile/Profile';
import RSS3 from '../../../common/rss3';
import RNS from '../../../common/rns';
import config from '../../../common/config';
import EVMpAccountItem from '../../../components/accounts/EVMpAccountItem';
import utils from '../../../common/utils';
import { GitcoinResponse, NFT, POAPResponse } from '../../../common/types';
import Events from '../../../common/events';
import NFTItem from '../../../components/assets/NFTItem';

import Modal, { ModalColorStyle } from '../../../components/modal/Modal';
import ModalLoading from '../../../components/modal/ModalLoading';
import SingleNFT from '../../../components/details/SingleNFT';
import SingleDonation from '../../../components/details/SingleDonation';
import SingleFootprint from '../../../components/details/SingleFootprint';
import Button from '../../../components/buttons/Button';
import { utils as RSS3Utils } from 'rss3';
import { AnyObject } from 'rss3/types/extend';
import ItemCard from '../../../components/content/ItemCard';

import SingleAccount from '../../../components/details/SingleAccount';
import { COLORS } from '../../../components/buttons/variables';
import CardItemLoader from '../../../components/loaders/CardItemLoader';
import FootprintItemLoader from '../../../components/loaders/FootprintItemLoader';
import ContentItemLoader from '../../../components/loaders/ContentItemLoader';
import ProfileLoader from '../../../components/loaders/ProfileLoader';
import LoadMoreButton from '../../../components/buttons/LoadMoreButton';
import ModalConnect from '../../../components/modal/ModalConnect';
interface ModalDetail {
    hidden: boolean;
    type: ModalColorStyle;
    details?: AnyObject;
}

const ProfilePage: NextPage = () => {
    const router = useRouter();
    const addrOrName = useRef<string>('');
    const [isRegistered, setRegistered] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const [isProfileLoading, setProfileLoading] = useState(true);

    const [link, setLink] = useState<string>('');
    const [avatarUrl, setAvatarUrl] = useState(config.undefinedImageAlt);
    const [username, setUsername] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [website, setWebsite] = useState<string>('');
    const [followers, setFollowers] = useState<RSS3ID[]>([]);
    const [followings, setFollowings] = useState<RSS3ID[]>([]);
    const [isFollowing, setIsFollowing] = useState(false);

    const [accountItems, setAccountItems] = useState<RSS3Account[]>([]);

    const [nftItems, setNftItems] = useState<AnyObject[]>([]);
    const [donationItems, setDonationItems] = useState<AnyObject[]>([]);
    const [footprintItems, setFootprintItems] = useState<AnyObject[]>([]);
    const [isNftLoading, setNftLoading] = useState(true);
    const [isDonationLoading, setDonationLoading] = useState(true);
    const [isFootprintLoading, setFootprintLoading] = useState(true);

    const [content, setContent] = useState<any[]>([]);
    const [isContentLoading, setContentLoading] = useState(true);
    const [haveMoreContent, setHaveMoreContent] = useState(true);
    const [isLoadingMore, setLoadingMore] = useState(false);

    const [isShowingRedirectNotice, setIsShowingRedirectNotice] = useState(false);
    const [otherProductRedirectSettings, setOtherProductRedirectSettings] = useState<{
        product: string;
        type: string;
        route: string;
        baseUrl: string;
        colorStyle: ModalColorStyle;
    }>({
        product: '',
        type: '',
        route: '',
        baseUrl: '',
        colorStyle: 'primary',
    });

    const expandButtonCommon = {
        icon: 'expand',
        isOutlined: true,
        isDisabled: false,
    };
    const editButtonCommon = {
        text: 'Edit',
        isOutlined: true,
        isDisabled: false,
    };
    const defaultAssetCardButtons = {
        NFT: [
            {
                ...expandButtonCommon,
                onClick: () => {
                    toListPage('nft');
                },
            },
        ],
        Donation: [
            {
                ...expandButtonCommon,
                onClick: () => {
                    toListPage('donation');
                },
            },
        ],
        Footprint: [
            {
                ...expandButtonCommon,
                onClick: () => {
                    toListPage('footprint');
                },
            },
        ],
    };
    const ownerAssetCardButtons = {
        NFT: [
            {
                ...editButtonCommon,
                onClick: () => {
                    toRSS3BioEditAssetNotice('NFT', '/setup/nfts', 'primary');
                },
            },
            ...defaultAssetCardButtons.NFT,
        ],
        Donation: [
            {
                ...editButtonCommon,
                onClick: () => {
                    toRSS3BioEditAssetNotice('Donation', '/setup/gitcoins', 'primary');
                },
            },
            ...defaultAssetCardButtons.Donation,
        ],
        Footprint: [
            {
                ...editButtonCommon,
                onClick: () => {
                    toRSS3BioEditAssetNotice('Footprint', '/setup/footprints', 'primary');
                },
            },
            ...defaultAssetCardButtons.Footprint,
        ],
    };
    const [assetCardButtons, setAssetCardButtons] = useState<{
        [key: string]: AssetCardButtonMode[];
    }>(defaultAssetCardButtons);

    const [modal, setModal] = useState<ModalDetail>({
        hidden: true,
        type: 'primary',
    });

    const loadAssetDetails = async (assetList: AnyObject[], limit: number) => {
        const previewList = limit <= assetList.length ? assetList.slice(0, limit) : assetList;
        const assetDetails = await utils.loadAssets(previewList);
        return assetDetails;
    };

    const init = async () => {
        const aon = (router.query.user as string) || '';
        addrOrName.current = aon;
        const pageOwner = await RSS3.setPageOwner(aon);
        setRegistered(!!pageOwner.file?.signature);
        const profile = pageOwner.profile;
        if (profile) {
            // Profile
            const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);
            setAvatarUrl(profile?.avatar?.[0] || config.undefinedImageAlt);
            setUsername(profile?.name || '');
            setAddress(pageOwner?.address || '');
            setBio(extracted);
            setWebsite(fieldsMatch?.['SITE'] || '');
            setLink(pageOwner.name);
            setFollowers(pageOwner.followers || []);
            setFollowings(pageOwner.followings || []);
            setProfileLoading(false);

            // Login user related
            if (RSS3.isValidRSS3()) {
                await RSS3.ensureLoginUser();
                checkOwner();
                setIsFollowing(RSS3.checkIsFollowing());
            }

            setTimeout(async () => {
                const { listed, haveMore } = await utils.initContent();
                setContent(listed);
                console.log(listed);
                setHaveMoreContent(haveMore);
                setContentLoading(false);
            }, 0);

            // Accounts
            const { listed } = await utils.initAccounts();
            setAccountItems(
                [
                    {
                        id: RSS3Utils.id.getAccount('EVM+', pageOwner?.address),
                    },
                ].concat(listed),
            );

            // Assets
            const allAssets = await utils.initAssets();

            setTimeout(async () => {
                setNftItems(await loadAssetDetails(allAssets.nfts, 4));
                setNftLoading(false);
            }, 0);
            setTimeout(async () => {
                setDonationItems(await loadAssetDetails(allAssets.donations, 4));
                setDonationLoading(false);
            }, 0);
            setTimeout(async () => {
                setFootprintItems(await loadAssetDetails(allAssets.footprints, 6));
                setFootprintLoading(false);
            }, 0);
        }
    };

    const checkOwner = () => {
        const latestIsOwner = RSS3.isNowOwner();
        if (latestIsOwner) {
            setAssetCardButtons(ownerAssetCardButtons);
        } else {
            setAssetCardButtons(defaultAssetCardButtons);
        }
        setIsOwner(latestIsOwner);
        return latestIsOwner;
    };

    const onFollow = async () => {
        if (RSS3.checkIsFollowing()) {
            await RSS3.unfollow();
            setIsFollowing(false);
        } else {
            await RSS3.follow();
            setIsFollowing(true);
        }
    };

    const toEditProfile = async () => {
        await router.push('/edit/profile');
    };

    const toListPage = async (type: string) => {
        await router.push(`/u/${addrOrName.current}/list/${type}`);
    };

    const toExternalUserSite = () => {
        if (website) {
            const url = website.replace(/^https?:\/\//, '');
            window.open(`https://${url}`, '_blank');
        }
    };

    const toRss3BioUserSite = () => {
        if (link) {
            const url = RSS3.buildProductBaseURL('RSS3Bio', address, link);
            window.open(url, '_blank');
        }
    };

    const toUserPage = async (addr: string) => {
        await router.push(`/u/${addr}`);
    };

    const toRSS3BioEditAssetNotice = (type: string, route: string, colorStyle: ModalColorStyle) => {
        // to RSS3.Bio edit this
        const product = 'RSS3Bio';
        const loginUser = RSS3.getLoginUser();
        const baseUrl = RSS3.buildProductBaseURL(product, loginUser.address, loginUser.name);
        setOtherProductRedirectSettings({ product, type, route, baseUrl, colorStyle });
        setIsShowingRedirectNotice(true);
    };

    const toEditAssetRedirect = () => {
        // open new window
        setIsShowingRedirectNotice(false);
        window.open(`${otherProductRedirectSettings.baseUrl}${otherProductRedirectSettings.route}`, '_blank');
    };

    // Initialize

    useEffect(() => {
        if (router.isReady) {
            init();
        }
    }, [router.query.user]);

    useEffect(() => {
        // init();
        setProfileLoading(true);
        setContentLoading(true);
        setNftLoading(true);
        setDonationLoading(true);
        setFootprintLoading(true);
    }, [address]);

    useEffect(() => {
        addEventListener(Events.connect, checkOwner);
        addEventListener(Events.disconnect, checkOwner);
    }, []);

    const loadMoreContent = async () => {
        setLoadingMore(true);
        const timestamp = [...content].pop()?.item.date_created || '';
        const { listed, haveMore } = await utils.initContent(timestamp);
        setContent([...content, ...listed]);
        setHaveMoreContent(haveMore);
        setLoadingMore(false);
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

        const apiUser = await RSS3.getAPIUser();

        const asset = await apiUser.persona.assets.getDetails({
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
            return <SingleNFT NFT={modal.details || {}} />;
        } else if (modal.type === 'donation') {
            return <SingleDonation Gitcoin={modal.details || {}} />;
        } else if (modal.type === 'footprint') {
            return <SingleFootprint POAPInfo={modal.details || {}} />;
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
                <section className="divide-y-2 w-7/11 divide-solid divide-primary-asset">
                    {isProfileLoading ? (
                        <ProfileLoader />
                    ) : (
                        <Profile
                            avatarUrl={avatarUrl}
                            username={isRegistered ? username : link ? link : address}
                            bio={
                                isRegistered
                                    ? bio
                                    : 'This account is not registered with RSS3. If you are the owner, you are welcome to register now : )'
                            }
                            followers={followers}
                            followings={followings}
                            rns={link}
                            link={website}
                            isLogin={RSS3.isValidRSS3()}
                            isOwner={isOwner}
                            isFollowing={isFollowing}
                            onFollow={onFollow}
                            toEditProfile={toEditProfile}
                            toExternalUserSite={toExternalUserSite}
                            toRss3BioUserSite={toRss3BioUserSite}
                            toUserPage={toUserPage}
                        >
                            {accountItems.map((account, index) => {
                                let accountInfo = RSS3Utils.id.parseAccount(account.id);
                                return accountInfo.platform === 'EVM+' ? (
                                    <EVMpAccountItem
                                        key={index}
                                        size="sm"
                                        address={accountInfo.identity}
                                        onClick={() => {
                                            getModalDetail({ detail: accountInfo }, 'account');
                                        }}
                                    />
                                ) : (
                                    <AccountItem
                                        key={index}
                                        size="sm"
                                        chain={accountInfo.platform}
                                        onClick={() => {
                                            getModalDetail({ detail: accountInfo }, 'account');
                                        }}
                                    />
                                );
                            })}
                        </Profile>
                    )}
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
                                                username={isRegistered ? element.name : link ? link : address}
                                                content={element.item.summary}
                                                asset={element.details}
                                                timeStamp={new Date(element.item.date_updated).valueOf()}
                                                target={element.item.target}
                                                toUserProfile={() => {}}
                                                showAssetDetail={() => fetchAssetDetail(element.item.target.field)}
                                            />
                                        );
                                    } else {
                                        return (
                                            <ContentCard
                                                key={index}
                                                avatarUrl={element.avatar}
                                                username={isRegistered ? element.name : link ? link : address}
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
                                        margin={1500}
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
                            <div className="flex flex-col w-full gap-2 py-8 text-sm text-center">
                                <p>{'Oops, nothing found from your activities :P'}</p>
                                <p>{'Post something new or do something fun today!'}</p>
                            </div>
                        )}
                    </>
                </section>
                <section className="flex flex-col gap-4 pb-16 w-4/11 min-w-44">
                    <div className="grid grid-cols-2 gap-4">
                        <AssetCard title="NFTs" color="primary" headerButtons={assetCardButtons.NFT}>
                            {isNftLoading ? (
                                // <div className="flex flex-row items-center justify-center w-full h-32">
                                //     <BiLoaderAlt className="w-12 h-12 animate-spin text-primary opacity-20" />
                                // </div>
                                <CardItemLoader />
                            ) : (
                                <div className="grid grid-cols-2 gap-3 w-20.5">
                                    {nftItems.length > 0 ? (
                                        nftItems.map((asset, i) => (
                                            <div
                                                className="cursor-pointer w-17.5"
                                                key={i}
                                                onClick={() => {
                                                    getModalDetail(asset, 'nft');
                                                }}
                                            >
                                                <NFTItem
                                                    key={asset.id}
                                                    previewUrl={
                                                        asset.detail.image_preview_url ||
                                                        asset.detail.image_url ||
                                                        asset.detail.animation_url ||
                                                        asset.animation_original_url
                                                    }
                                                    isShowingDetails={false}
                                                    size={70}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-base font-semibold opacity-20 col-span-2">
                                            {isRegistered
                                                ? 'Oops, nothing found :P'
                                                : 'Oops, this account is not registered with RSS3.'}
                                        </span>
                                    )}
                                </div>
                            )}
                        </AssetCard>

                        <AssetCard title="Donations" color="primary" headerButtons={assetCardButtons.Donation}>
                            {isDonationLoading ? (
                                // <div className="flex flex-row items-center justify-center w-full h-32">
                                //     <BiLoaderAlt className="w-12 h-12 animate-spin text-primary opacity-20" />
                                // </div>
                                <CardItemLoader />
                            ) : (
                                <div className="grid grid-cols-2 gap-3 w-20.5">
                                    {donationItems.length > 0 ? (
                                        donationItems.map((asset, i) => (
                                            <div key={i} className="flex cursor-pointer w-17.5">
                                                <ImageHolder
                                                    imageUrl={asset.detail.grant.logo || config.undefinedImageAlt}
                                                    roundedClassName={'rounded'}
                                                    size={70}
                                                    onClick={() => {
                                                        getModalDetail(asset, 'donation');
                                                    }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-base font-medium opacity-20 col-span-2">
                                            {isRegistered
                                                ? 'Oops, nothing found :P'
                                                : 'Oops, this account is not registered with RSS3.'}
                                        </span>
                                    )}
                                </div>
                            )}
                        </AssetCard>
                    </div>
                    <div>
                        <AssetCard title="Footprints" color="primary" headerButtons={assetCardButtons.Footprint}>
                            <div className="flex flex-col w-full gap-4">
                                {isFootprintLoading ? (
                                    [...Array(3)].map((_, id) => <FootprintItemLoader key={id} />)
                                ) : footprintItems.length > 0 ? (
                                    footprintItems.map((asset, i) => (
                                        <FootprintCard
                                            key={i}
                                            imageUrl={asset.detail.image_url || config.undefinedImageAlt}
                                            startDate={asset.detail.start_date}
                                            endDate={asset.detail.end_date}
                                            city={asset.detail.city}
                                            country={asset.detail.country}
                                            username={username}
                                            activity={asset.detail.name || ''}
                                            clickEvent={() => {
                                                getModalDetail(asset, 'footprint');
                                            }}
                                        />
                                    ))
                                ) : (
                                    <span className="text-base font-semibold opacity-20">
                                        {isRegistered
                                            ? 'Oops, nothing found :P'
                                            : 'Oops, this account is not registered with RSS3.'}
                                    </span>
                                )}
                            </div>
                        </AssetCard>
                    </div>
                </section>
            </div>
            <Modal
                hidden={modal.hidden}
                closeEvent={closeModal}
                theme={'primary'}
                size={modal.type === 'account' ? 'md' : 'lg'}
            >
                {modal.details ? getModalDisplay() : <ModalLoading color={'primary'} />}
            </Modal>

            <Modal
                theme={'primary'}
                size={'sm'}
                hidden={!isShowingRedirectNotice}
                closeEvent={() => setIsShowingRedirectNotice(false)}
            >
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className={`mx-2 text-xl text-${otherProductRedirectSettings.colorStyle}`}>Info</span>
                    </div>

                    <div className="flex justify-center">
                        <div className="inline px-12 pt-8 pb-12">
                            {`You will be redirect to`}
                            <span className="mx-2 text-primary">{otherProductRedirectSettings.product}</span>
                            {`to set up your`}
                            <span className={`mx-2 text-${otherProductRedirectSettings.colorStyle}`}>
                                {otherProductRedirectSettings.type}
                            </span>
                            {`.`}
                        </div>
                    </div>

                    <div className="flex justify-center gap-x-3">
                        <Button
                            isOutlined={true}
                            color={otherProductRedirectSettings.colorStyle}
                            text={'Cancel'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={() => setIsShowingRedirectNotice(false)}
                        />
                        <Button
                            isOutlined={false}
                            color={otherProductRedirectSettings.colorStyle}
                            text={'Go'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={toEditAssetRedirect}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProfilePage;
