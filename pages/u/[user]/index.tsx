import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { RSS3Account, RSS3ID } from 'rss3-next/types/rss3';
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
import { GeneralAssetWithTags, GitcoinResponse, NFT, POAPResponse } from '../../../common/types';
import Events from '../../../common/events';
import NFTItem from '../../../components/assets/NFTItem';

import Modal, { ModalColorStyle } from '../../../components/modal/Modal';
import ModalLoading from '../../../components/modal/ModalLoading';
import SingleNFT from '../../../components/details/SingleNFT';
import SingleDonation from '../../../components/details/SingleDonation';
import SingleFootprint from '../../../components/details/SingleFootprint';
import Button from '../../../components/buttons/Button';

interface ModalDetail {
    hidden: boolean;
    type: ModalColorStyle;
    details?: NFT | GitcoinResponse | POAPResponse | null;
}

const ProfilePage: NextPage = () => {
    const router = useRouter();
    const [addrOrName, setAddrOrName] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    const [link, setLink] = useState<string>('');
    const [avatarUrl, setAvatarUrl] = useState(config.undefinedImageAlt);
    const [username, setUsername] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [website, setWebsite] = useState<string>('');
    const [followers, setFollowers] = useState<RSS3ID[]>([]);
    const [followings, setFollowings] = useState<RSS3ID[]>([]);

    const [accountItems, setAccountItems] = useState<RSS3Account[]>([]);
    const [nftItems, setNftItems] = useState<GeneralAssetWithTags[]>([]);
    const [donationItems, setDonationItems] = useState<GeneralAssetWithTags[]>([]);
    const [footprintItems, setFootprintItems] = useState<GeneralAssetWithTags[]>([]);

    const [isShowingRedirectNotice, setIsShowingRedirectNotice] = useState(false);
    const [otherProductRedirectSettings, setOtherProductRedirectSettings] = useState<{
        type: string;
        route: string;
        baseUrl: string;
        colorStyle: ModalColorStyle;
    }>({
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

    let slides = [
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
    ];

    let content =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    const loadAssets = async (type: string, limit?: number) => {
        const { listed } = await utils.initAssets(type, limit);
        return listed;
    };

    const init = async () => {
        const aon = (router.query.user as string) || '';
        setAddrOrName(aon);
        const pageOwner = await RSS3.setPageOwner(aon);
        const profile = pageOwner.profile;
        checkOwner();
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

            // Accounts
            await RSS3.setPageOwner(pageOwner.address);
            const { listed } = await utils.initAccounts();
            setAccountItems(
                [
                    {
                        platform: 'EVM+',
                        identity: pageOwner.address,
                    },
                ].concat(listed),
            );

            // Assets
            setTimeout(async () => {
                setNftItems(await loadAssets('NFT', 4));
            }, 0);
            setTimeout(async () => {
                setDonationItems(await loadAssets('Gitcoin-Donation', 4));
            }, 0);
            setTimeout(async () => {
                setFootprintItems(await loadAssets('POAP', 5));
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
    };

    const toEditProfile = async () => {
        await router.push('/edit/profile');
    };

    const toListPage = async (type: string) => {
        await router.push(`/u/${addrOrName}/list/${type}`);
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

        const loginUser = RSS3.getLoginUser();
        const baseUrl = RSS3.buildProductBaseURL('RSS3Bio', loginUser.address, loginUser.name);
        setOtherProductRedirectSettings({ type, route, baseUrl, colorStyle });
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
        addEventListener(Events.connect, checkOwner);
        addEventListener(Events.disconnect, checkOwner);
    }, []);

    const getModalDetail = async (asset: GeneralAssetWithTags, type: 'nft' | 'donation' | 'footprint') => {
        document.body.style.overflow = 'hidden';
        let data;
        if (type === 'nft') {
            data = (await RSS3.getNFTDetails(address, 'EVM+', asset.identity, asset.id, asset.type))?.data;
        } else if (type === 'donation') {
            data = await RSS3.getGitcoinDonation(address, 'EVM+', asset.identity, asset.id);
        } else if (type === 'footprint') {
            data = await RSS3.getFootprintDetail(address, 'EVM+', asset.identity, asset.id);
        }
        setModal({
            hidden: false,
            type: type,
            details: data,
        });
    };

    const getModalDisplay = () => {
        if (modal.type === 'nft') {
            return <SingleNFT NFT={modal.details as NFT} />;
        } else if (modal.type === 'donation') {
            return <SingleDonation Gitcoin={modal.details as GitcoinResponse} />;
        } else if (modal.type === 'footprint') {
            return <SingleFootprint POAPInfo={modal.details as POAPResponse} />;
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
                        toEditProfile={toEditProfile}
                        toExternalUserSite={toExternalUserSite}
                        toUserPage={toUserPage}
                    >
                        {accountItems.map((account) =>
                            account.platform === 'EVM+' ? (
                                <EVMpAccountItem
                                    key={account.platform + account.identity}
                                    size="sm"
                                    address={account.identity}
                                />
                            ) : (
                                <AccountItem
                                    key={account.platform + account.identity}
                                    size="sm"
                                    chain={account.platform}
                                />
                            ),
                        )}
                    </Profile>
                    {[...Array(1)].map((_, i) => (
                        <ContentCard
                            key={i}
                            avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                            username="Fendi"
                            content={content}
                            images={slides}
                            timeStamp={0x60de434e}
                            type="Twitter"
                        />
                    ))}
                    <div className="w-full py-8 text-sm text-center">{"That's all :p"}</div>
                </section>
                <section className="flex flex-col gap-4 pb-16 w-4/11">
                    <div className="grid grid-cols-2 gap-4">
                        <AssetCard title="NFTs" color="nft" headerButtons={assetCardButtons.NFT}>
                            <div className="grid grid-cols-2 gap-3">
                                {nftItems.map((asset, i) => (
                                    <div
                                        className="cursor-pointer"
                                        key={i}
                                        onClick={() => {
                                            getModalDetail(asset, 'nft');
                                        }}
                                    >
                                        <NFTItem
                                            key={asset.platform + asset.id}
                                            previewUrl={asset.info.image_preview_url || config.undefinedImageAlt}
                                            isShowingDetails={false}
                                            size={70}
                                        />
                                    </div>
                                ))}
                            </div>
                        </AssetCard>

                        <AssetCard title="Donations" color="donation" headerButtons={assetCardButtons.Donation}>
                            <div className="grid grid-cols-2 gap-3">
                                {donationItems.map((asset, i) => (
                                    <div key={asset.platform + asset.id} className="flex cursor-pointer">
                                        <ImageHolder
                                            imageUrl={asset.info.image_preview_url || config.undefinedImageAlt}
                                            isFullRound={false}
                                            size={70}
                                            onClick={() => {
                                                getModalDetail(asset, 'donation');
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </AssetCard>
                    </div>
                    <div>
                        <AssetCard title="Footprints" color="footprint" headerButtons={assetCardButtons.Footprint}>
                            <div className="flex flex-col w-full">
                                {footprintItems.map((asset, i) => (
                                    <FootprintCard
                                        key={asset.platform + asset.id}
                                        imageUrl={asset.info.image_preview_url || config.undefinedImageAlt}
                                        startDate={asset.info.start_date}
                                        endDate={asset.info.end_date}
                                        city={asset.info.city}
                                        country={asset.info.country}
                                        username={username}
                                        activity={asset.info.title || ''}
                                        clickEvent={() => {
                                            getModalDetail(asset, 'footprint');
                                        }}
                                    />
                                ))}
                            </div>
                        </AssetCard>
                    </div>
                </section>
            </div>
            <Modal hidden={modal.hidden} closeEvent={closeModal} theme={modal.type} isCenter={false} size="lg">
                {modal.details ? getModalDisplay() : <ModalLoading color={modal.type} />}
            </Modal>

            <Modal
                theme={otherProductRedirectSettings.colorStyle}
                size={'md'}
                isCenter={true}
                hidden={!isShowingRedirectNotice}
                closeEvent={() => setIsShowingRedirectNotice(false)}
            >
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className="mx-2 text-primary">Info</span>
                    </div>

                    <div className="flex justify-center">
                        {`You will be redirect to ${otherProductRedirectSettings.baseUrl}${otherProductRedirectSettings.route} to set up your ${otherProductRedirectSettings.type}.`}
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
