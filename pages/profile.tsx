import type { NextPage } from 'next';
import React from 'react';
import AccountItem from '../components/accounts/AccountItem';
import AssetCard from '../components/assets/AssetCard';
import FootprintCard from '../components/assets/FootprintCard';
import Button from '../components/buttons/Button';
import { COLORS } from '../components/buttons/variables';
import ContentCard from '../components/content/ContentCard';
import Header from '../components/Header';
import ImageHolder from '../components/ImageHolder';
import Profile from '../components/profile/Profile';
import RecommendSection from '../components/users/RecommendSection';

const ProfilePage: NextPage = () => {
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

    return (
        <>
            <Header>
                <div className="flex flex-row justify-end w-full gap-x-8">
                    <Button isOutlined={false} color={COLORS.primary} text={'Create Now'} />
                    <ImageHolder imageUrl="https://i.imgur.com/GdWEt4z.jpg" isFullRound={true} size={28} />
                </div>
            </Header>
            <div className="flex flex-row justify-between max-w-6xl px-2 pt-16 mx-auto gap-x-8">
                <section className="divide-y-2 w-7/11 divide-solid divide-opacity-5 divide-primary">
                    <Profile
                        avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                        username="Fendi"
                        bio={content}
                        followers={12}
                        followings={8}
                        rns="Fendi.rss3.bio"
                        link="Fendi.github.io"
                    >
                        <AccountItem size="sm" chain="BSC" />
                        <AccountItem size="sm" chain="Ethereum" />
                        <AccountItem size="sm" chain="Ronin" />
                        <AccountItem size="sm" chain="Misskey" />
                        <AccountItem size="sm" chain="Twitter" />
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
                    <div className="w-full py-8 text-sm text-center">That's all :p</div>
                </section>
                <section className="flex flex-col gap-4 pb-16 w-4/11">
                    <div className="grid grid-cols-2 gap-4">
                        <AssetCard title="NFTs" color="nft" isShowingExpandButton={true} headerButtonMode={'edit'}>
                            <div className="grid grid-cols-2 gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <ImageHolder
                                        key={i}
                                        imageUrl={
                                            'https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5'
                                        }
                                        isFullRound={false}
                                        size={70}
                                    />
                                ))}
                            </div>
                        </AssetCard>

                        <AssetCard
                            title="Donations"
                            color="donation"
                            isShowingExpandButton={true}
                            headerButtonMode={'edit'}
                        >
                            <div className="grid grid-cols-2 gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <ImageHolder
                                        key={i}
                                        imageUrl={
                                            'https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5'
                                        }
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
                            isShowingExpandButton={true}
                            headerButtonMode={'edit'}
                        >
                            <div className="flex flex-col w-full">
                                {[...Array(5)].map((_, i) => (
                                    <FootprintCard
                                        key={i}
                                        imageUrl={
                                            'https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5'
                                        }
                                        startDate={'0x61800f00'}
                                        endDate={'0x61800f00'}
                                        city={''}
                                        country={''}
                                        username={'RSS3Lover'}
                                        activity={'Say hi.'}
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
