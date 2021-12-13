import React, { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { RSS3Account, RSS3ID } from '../../../common/rss3Types';
import AccountItem from '../../../components/accounts/AccountItem';
import AssetCard, { AssetCardButtonMode } from '../../../components/assets/AssetCard';
import FootprintCard from '../../../components/assets/FootprintCard';
import ContentCard from '../../../components/content/ContentCard';
import Header from '../../../components/Header';
import ImageHolder from '../../../components/ImageHolder';
import Profile from '../../../components/profile/Profile';
import RSS3 from '../../../common/rss3';
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
import { BiLoaderCircle } from 'react-icons/bi';
import SingleAccount from '../../../components/details/SingleAccount';
import { COLORS } from '../../../components/buttons/variables';
import rss3 from '../../../common/rss3';
import FollowList from '../../../components/users/FollowList';
import { joinSignature } from '@ethersproject/bytes';
interface ModalDetail {
    hidden: boolean;
    type: ModalColorStyle;
    details?: AnyObject;
}

const ProfilePage: NextPage = () => {
    const router = useRouter();
    const addrOrName = useRef<string>('');
    const [isOwner, setIsOwner] = useState(false);

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

    const [content, setContent] = useState<any[]>([]);
    const [isContentLoading, setContentLoading] = useState(true);
    const [haveMoreContent, setHaveMoreContent] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

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
                    toRSS3BioEditAssetNotice('NFT', '/setup/nfts', 'nft');
                },
            },
            ...defaultAssetCardButtons.NFT,
        ],
        Donation: [
            {
                ...editButtonCommon,
                onClick: () => {
                    toRSS3BioEditAssetNotice('Donation', '/setup/gitcoins', 'donation');
                },
            },
            ...defaultAssetCardButtons.Donation,
        ],
        Footprint: [
            {
                ...editButtonCommon,
                onClick: () => {
                    toRSS3BioEditAssetNotice('Footprint', '/setup/footprints', 'footprint');
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
        const assetDetails = await utils.loadAssets(assetList);
        const previewAssets = limit <= assetDetails.length ? assetDetails.slice(0, limit) : assetDetails;
        return previewAssets;
    };

    const init = async () => {
        const aon = (router.query.user as string) || '';
        addrOrName.current = aon;
        const pageOwner = await RSS3.setPageOwner(aon);
        setTimeout(async () => {
            const { listed, haveMore } = await utils.initContent();
            setContent(listed);
            setHaveMoreContent(haveMore);
            setContentLoading(false);
        }, 0);

        const profile = pageOwner.profile;
        if (!checkOwner()) {
            checkIsFollowing();
        }
        // console.log(pageOwner.assets);
        if (profile) {
            // Profile
            const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);
            setAvatarUrl(profile?.avatar?.[0] || config.undefinedImageAlt);
            setUsername(profile?.name || '');
            setAddress(pageOwner?.address || '');
            console.log('username, address', username, address);
            setBio(extracted);
            setWebsite(fieldsMatch?.['SITE'] || '');
            setLink(pageOwner.name);
            setFollowers(pageOwner.followers || []);
            setFollowings(pageOwner.followings || []);

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
            }, 0);
            setTimeout(async () => {
                setDonationItems(await loadAssetDetails(allAssets.donations, 4));
            }, 0);
            setTimeout(async () => {
                setFootprintItems(await loadAssetDetails(allAssets.footprints, 6));
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
        const loginUser = await RSS3.getLoginUser();
        const pageOwner = await RSS3.getPageOwner();
        const file = await pageOwner.files.get();
        if (file.signature) {
            if (checkIsFollowing()) {
                await unfollow();
            } else {
                await follow();
            }
            await loginUser.files.sync();
        } else {
            // Not registered user
        }
    };

    const checkIsFollowing = () => {
        const loginUser = RSS3.getLoginUser();
        const pageOwner = RSS3.getPageOwner();
        const followList = loginUser.followings;
        if (followList?.includes(pageOwner.address)) {
            setIsFollowing(true);
            return true;
        } else {
            setIsFollowing(false);
            return false;
        }
    };

    const follow = async () => {
        const loginUser = await RSS3.getLoginUser();
        const pageOwner = await RSS3.getPageOwner();

        if (!checkIsFollowing()) {
            pageOwner.followers.push(loginUser.address);
            loginUser.followings.push(pageOwner.address);
            await loginUser.persona?.links.post('following', pageOwner.address);
        }

        setIsFollowing(true);
    };

    const unfollow = async () => {
        const loginUser = await RSS3.getLoginUser();
        const pageOwner = await RSS3.getPageOwner();

        if (checkIsFollowing()) {
            pageOwner.followers.splice(pageOwner.followers.indexOf(loginUser.address), 1);
            loginUser.followings.splice(loginUser.followings.indexOf(pageOwner.address), 1);
            await loginUser.persona?.links.delete('following', pageOwner.address);
        }

        setIsFollowing(false);
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
        setContentLoading(true);
    }, [address]);

    useEffect(() => {
        addEventListener(Events.connect, checkOwner);
        addEventListener(Events.disconnect, checkOwner);
    }, []);

    const loadMoreContent = async () => {
        setIsLoadingMore(true);
        const timestamp = [...content].pop()?.date_created || '';
        const { listed, haveMore } = await utils.initContent(timestamp);
        setContent([...content, ...listed]);
        setHaveMoreContent(haveMore);
        setIsLoadingMore(false);
    };

    const getModalDetail = async (asset: AnyObject, type: 'nft' | 'donation' | 'footprint' | 'account') => {
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
                    <Profile
                        avatarUrl={avatarUrl}
                        username={username}
                        bio={bio}
                        followers={followers}
                        followings={followings}
                        rns={link}
                        link={website}
                        isOwner={isOwner}
                        isFollowing={isFollowing}
                        onFollow={onFollow}
                        toEditProfile={toEditProfile}
                        toExternalUserSite={toExternalUserSite}
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
                                        getModalDetail({ detail: { ...accountInfo } }, 'account');
                                    }}
                                />
                            ) : (
                                <AccountItem
                                    key={index}
                                    size="sm"
                                    chain={accountInfo.platform}
                                    onClick={() => {
                                        getModalDetail({ detail: { ...accountInfo } }, 'account');
                                    }}
                                />
                            );
                        })}
                    </Profile>
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
                    <div className="grid grid-cols-2 gap-4">
                        <AssetCard title="NFTs" color="primary" headerButtons={assetCardButtons.NFT}>
                            <div className="grid grid-cols-2 gap-3">
                                {nftItems.length > 0
                                    ? nftItems.map((asset, i) => (
                                          <div
                                              className="cursor-pointer"
                                              key={i}
                                              onClick={() => {
                                                  getModalDetail(asset, 'nft');
                                              }}
                                          >
                                              <NFTItem
                                                  key={asset.id}
                                                  previewUrl={
                                                      asset.detail.image_preview_url || config.undefinedImageAlt
                                                  }
                                                  isShowingDetails={false}
                                                  size={70}
                                              />
                                          </div>
                                      ))
                                    : null}
                            </div>
                        </AssetCard>

                        <AssetCard title="Donations" color="primary" headerButtons={assetCardButtons.Donation}>
                            <div className="grid grid-cols-2 gap-3">
                                {donationItems.length > 0
                                    ? donationItems.map((asset, i) => (
                                          <div key={i} className="flex cursor-pointer">
                                              <ImageHolder
                                                  imageUrl={asset.detail.grant.logo || config.undefinedImageAlt}
                                                  isFullRound={false}
                                                  size={70}
                                                  onClick={() => {
                                                      getModalDetail(asset, 'donation');
                                                  }}
                                              />
                                          </div>
                                      ))
                                    : null}
                            </div>
                        </AssetCard>
                    </div>
                    <div>
                        <AssetCard title="Footprints" color="primary" headerButtons={assetCardButtons.Footprint}>
                            <div className="flex flex-col w-full">
                                {footprintItems.length > 0
                                    ? footprintItems.map((asset, i) => (
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
                                    : null}
                            </div>
                        </AssetCard>
                    </div>
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

            <Modal
                theme={'primary'}
                size={'sm'}
                isCenter={true}
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
