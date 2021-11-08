import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import AccountItem from '../components/account/AccountItem';
import EVMpAccountItem from '../components/account/EVMpAccountItem';
import ContentCard from '../components/content/ContentCard';
import Profile from '../components/profile/Profile';
import AssetCard from '../components/assets/AssetCard';
import ImageHolder from '../components/ImageHolder';
import FootprintCard from '../components/assets/FootprintCard';
import RecommendSection from '../components/recommends/RecommendSection';
import Header from '../components/Header';
import Button from '../components/buttons/Button';
import LinkButton from '../components/buttons/LinkButton';
import { COLORS } from '../components/buttons/variables';
import Input from '../components/inputs/Input';
const Test: NextPage = () => {
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

    let bio =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ';

    let content =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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

    return (
        <div>
            <Head>
                <title>Test page</title>
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
            </Head>
            <Header>
                <Button isOutlined={false} color={COLORS.primary} text={'Create Now'} />
            </Header>
            <div className="pt-12 md:pt-16 flex flex-col max-w-lg m-auto">
                <h1 className="mt-4 font-bold text-center">Test Page</h1>
                <section className="divide-y-2 divide-solid divide-opacity-5 divide-primary">
                    <Profile
                        avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                        username="Fendi"
                        bio={bio}
                        followers={12}
                        followings={8}
                        rns="Fendi.rss3.bio"
                        link="Fendi.github.io"
                    >
                        <EVMpAccountItem size="sm" address="0xd0B85A7bB6B602f63B020256654cBE73A753DFC4" />
                        <AccountItem size="sm" chain="BSC" />
                        <AccountItem size="sm" chain="Ethereum" />
                        <AccountItem size="sm" chain="Ronin" />
                        <AccountItem size="sm" chain="Misskey" />
                        <AccountItem size="sm" chain="Twitter" />
                        <EVMpAccountItem size="sm" address="0x0000000000000000000000000000000000000000" />
                    </Profile>
                    <Profile
                        avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                        username="Fendi"
                        bio={bio}
                        followers={12}
                        followings={8}
                    />
                    <ContentCard
                        avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                        username="Fendi"
                        content="hello world:)"
                        images={slides}
                        like={7}
                        comment={4}
                        share={6}
                        timeStamp={0x60de434e}
                        type="Twitter"
                    />
                    <ContentCard
                        avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                        username="Fendi"
                        content="hello world:)"
                        like={3}
                        comment={2}
                        share={1}
                        timeStamp={0x60de1fce}
                        type="Misskey"
                    />
                    <ContentCard
                        avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                        username="Fendi"
                        content={content}
                        timeStamp={0x60de43ce}
                        type="Mirror-XYZ"
                    />
                    <ContentCard
                        avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                        username="Fendi"
                        content={content}
                        timeStamp={0x60de41ce}
                        type="Arweave"
                    />
                </section>

                <section>
                    <h1>
                        <b>Components Samples</b>
                    </h1>
                    <Button isOutlined={false} color={COLORS.account} icon={'minus'} />
                    <Button isOutlined={true} color={COLORS.account} icon={'plus'} />
                    <Button isOutlined={true} color={COLORS.donation} icon={'expand'} />
                    <Button isOutlined={true} color={COLORS.nft} text={'Edit'} />
                    <Button isOutlined={true} color={COLORS.donation} text={'Edit'} />
                    <Button isOutlined={true} color={COLORS.footprint} text={'Edit'} />
                    <Button
                        isOutlined={false}
                        color={COLORS.primary}
                        text={'Save'}
                        fontSize={'text-base'}
                        width={'w-48'}
                    />
                    <Button
                        isOutlined={true}
                        color={COLORS.primary}
                        text={'Discard'}
                        fontSize={'text-base'}
                        width={'w-48'}
                    />
                    <Button isOutlined={false} isDisabled={true} color={COLORS.primary} text={'Edit Profile'} />
                    <LinkButton text={'mypersonalsite.com'} color={COLORS.primary} />
                </section>

                <section>
                    <Input placeholder={'Personal Website'} isSingleLine={true} prefix={'https://'} />
                    <Input placeholder={'Bio'} isSingleLine={false} />
                    <Input placeholder={'Username'} isSingleLine={true} value={'Joshua'} />
                    <Input placeholder={'Username'} isSingleLine={true} />
                </section>

                <section>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <AssetCard title="NFTs" color="nft" isShowingEditButton={true} bodyCols={2}>
                                {[...Array(5)].map((_, i) => (
                                    <ImageHolder
                                        key={i}
                                        imageUrl={
                                            'https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5'
                                        }
                                        isFullRound={false}
                                        size={84}
                                    />
                                ))}
                            </AssetCard>

                            <AssetCard title="Donations" color="donation" isShowingEditButton={true} bodyCols={2}>
                                {[...Array(5)].map((_, i) => (
                                    <ImageHolder
                                        key={i}
                                        imageUrl={
                                            'https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5'
                                        }
                                        isFullRound={false}
                                        size={84}
                                    />
                                ))}
                            </AssetCard>
                        </div>
                        <div>
                            <AssetCard title="Footprints" color="footprint" isShowingEditButton={true} bodyCols={1}>
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
                                        activity={'Say hi. ' + content}
                                    />
                                ))}
                            </AssetCard>
                        </div>
                    </div>

                    <div>
                        <RecommendSection groups={recommendGroups} />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Test;
