import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { RSS3Account, RSS3ID, RSS3Links } from 'rss3-next/types/rss3';
import AccountItem from '../../../components/accounts/AccountItem';
import AssetCard from '../../../components/assets/AssetCard';
import FootprintCard from '../../../components/assets/FootprintCard';
import ContentCard from '../../../components/content/ContentCard';
import Header from '../../../components/Header';
import ImageHolder from '../../../components/ImageHolder';
import Profile from '../../../components/profile/Profile';
import RSS3 from '../../../common/rss3';
import config from '../../../common/config';
import EVMpAccountItem from '../../../components/accounts/EVMpAccountItem';
import utils from '../../../common/utils';
import { GeneralAssetWithTags } from '../../../common/types';
import Events from '../../../common/events';

const ProfilePage: NextPage = () => {
    const router = useRouter();
    const [addrOrName, setAddrOrName] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    const [link, setLink] = useState<string>('');
    const [avatarUrl, setAvatarUrl] = useState(config.undefinedImageAlt);
    const [username, setUsername] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [website, setWebsite] = useState<string>('');
    const [followers, setFollowers] = useState<RSS3ID[]>([]);
    const [followings, setFollowings] = useState<RSS3ID[]>([]);

    const [accountItems, setAccountItems] = useState<RSS3Account[]>([]);
    const [nftItems, setNftItems] = useState<GeneralAssetWithTags[]>([]);
    const [donationItems, setDonationItems] = useState<GeneralAssetWithTags[]>([]);
    const [footprintItems, setFootprintItems] = useState<GeneralAssetWithTags[]>([]);

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
        if (profile) {
            // Profile
            const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || bio, ['SITE']);
            setAvatarUrl(profile?.avatar?.[0] || avatarUrl);
            setUsername(profile?.name || username);
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
            setNftItems(await loadAssets('NFT', 4));
            setDonationItems(await loadAssets('Gitcoin-Donation', 4));
            setFootprintItems(await loadAssets('POAP', 5));
        }
        setIsOwner(RSS3.isNowOwner());
    };

    const toEditProfile = async () => {
        await router.push('/edit/profile');
    };

    const toListPage = async (type: string) => {
        await router.push(`/u/${addrOrName}/list/${type}`);
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
        addEventListener(Events.connect, () => setIsOwner(RSS3.isNowOwner()));
        addEventListener(Events.disconnect, () => setIsOwner(RSS3.isNowOwner()));
    }, []);

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
                        <AssetCard
                            title="NFTs"
                            color="nft"
                            headerButtons={[
                                {
                                    icon: 'expand',
                                    isOutlined: true,
                                    isDisabled: false,
                                    onClick: () => {
                                        toListPage('nft');
                                    },
                                },
                            ]}
                        >
                            <div className="grid grid-cols-2 gap-3">
                                {nftItems.map((asset, i) => (
                                    <ImageHolder
                                        key={asset.platform + asset.id}
                                        imageUrl={asset.info.image_preview_url || config.undefinedImageAlt}
                                        isFullRound={false}
                                        size={70}
                                    />
                                ))}
                            </div>
                        </AssetCard>

                        <AssetCard
                            title="Donations"
                            color="donation"
                            headerButtons={[
                                {
                                    icon: 'expand',
                                    isOutlined: true,
                                    isDisabled: false,
                                    onClick: () => {
                                        toListPage('donation');
                                    },
                                },
                            ]}
                        >
                            <div className="grid grid-cols-2 gap-3">
                                {donationItems.map((asset, i) => (
                                    <ImageHolder
                                        key={asset.platform + asset.id}
                                        imageUrl={asset.info.image_preview_url || config.undefinedImageAlt}
                                        isFullRound={false}
                                        size={70}
                                    />
                                ))}
                            </div>
                        </AssetCard>
                    </div>
                    <div>
                        <AssetCard
                            title="Footprints"
                            color="footprint"
                            headerButtons={[
                                {
                                    icon: 'expand',
                                    isOutlined: true,
                                    isDisabled: false,
                                    onClick: () => {
                                        toListPage('footprint');
                                    },
                                },
                            ]}
                        >
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
                                    />
                                ))}
                            </div>
                        </AssetCard>
                    </div>
                </section>
            </div>
        </>
    );
};

export default ProfilePage;
