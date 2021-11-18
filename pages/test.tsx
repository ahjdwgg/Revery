import type { NextPage } from 'next';
import Head from 'next/head';
import React, { ChangeEvent } from 'react';
import AccountItem from '../components/accounts/AccountItem';
import EVMpAccountItem from '../components/accounts/EVMpAccountItem';
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
import NFTBadges from '../components/assets/NFTBadges';
import NFTItem from '../components/assets/NFTItem';
import DonationCard from '../components/assets/DonationCard';
import AccountCard from '../components/accounts/AccountCard';
import MarketTag from '../components/tags/MarketTag';
import ScanTag from '../components/tags/ScanTag';
import Trait from '../components/details/Trait';
import NFTDetail from '../components/details/NFTDetail';
import Payment from '../components/details/Payment';

interface InputStates {
    website: string;
    bio: string;
    name1: string;
    name2: string;
}

type InputEventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

class InputSection extends React.Component<{}, InputStates> {
    constructor(props: {}) {
        super(props);
        this.state = {
            website: '',
            bio: '',
            name1: 'Joshua',
            name2: '',
        };

        this.handleChangeWebsite = this.handleChangeWebsite.bind(this);
        this.handleChangeBio = this.handleChangeBio.bind(this);
        this.handleChangeName1 = this.handleChangeName1.bind(this);
        this.handleChangeName2 = this.handleChangeName2.bind(this);
    }

    handleChangeWebsite(event: InputEventType) {
        this.setState({
            website: event.target.value,
        });
    }
    handleChangeBio(event: InputEventType) {
        this.setState({
            bio: event.target.value,
        });
    }
    handleChangeName1(event: InputEventType) {
        this.setState({
            name1: event.target.value,
        });
    }
    handleChangeName2(event: InputEventType) {
        this.setState({
            name2: event.target.value,
        });
    }
    handlePrint() {
        console.log(this.state);
    }

    render() {
        return (
            <section>
                <Input
                    placeholder={'Personal Website'}
                    isSingleLine={true}
                    prefix={'https://'}
                    onChange={this.handleChangeWebsite}
                />
                <Input placeholder={'Bio'} isSingleLine={false} onChange={this.handleChangeBio} />
                <Input
                    placeholder={'Username'}
                    isSingleLine={true}
                    value={this.state.name1}
                    onChange={this.handleChangeName1}
                />
                <Input placeholder={'Username'} isSingleLine={true} onChange={this.handleChangeName2} />
                <div onClick={() => this.handlePrint()}>
                    <Button
                        isOutlined={false}
                        color={COLORS.primary}
                        text={'PrintState'}
                        fontSize={'text-base'}
                        width={'w-48'}
                    />
                </div>
            </section>
        );
    }
}

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

    return (
        <div>
            <Head>
                <title>Test page</title>
            </Head>
            <Header>
                <div className="flex flex-row justify-end w-full gap-x-8">
                    <Button isOutlined={false} color={COLORS.primary} text={'Create Now'} />
                    <ImageHolder imageUrl="https://i.imgur.com/GdWEt4z.jpg" isFullRound={true} size={28} />
                </div>
            </Header>
            <div className="flex flex-col max-w-lg pt-12 m-auto md:pt-16">
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
                        timeStamp={0x60de434e}
                        type="Twitter"
                    />
                    <ContentCard
                        avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                        username="Fendi"
                        content="hello world:)"
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
                    <Button isOutlined={false} color={COLORS.account} icon={'minus'} isFullRound={true} />
                    <Button
                        isOutlined={false}
                        color={COLORS.account}
                        icon={'minus'}
                        isFullRound={true}
                        width="w-4 h-4"
                    />
                    <Button isOutlined={true} color={COLORS.account} icon={'plus'} />
                    <Button isOutlined={true} color={COLORS.donation} icon={'expand'} />
                    <Button isOutlined={true} color={COLORS.donation} icon={'check'} />
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

                <InputSection />

                <section>
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <AssetCard title="NFTs" color="nft">
                                <div className={`grid grid-cols-2 gap-3`}>
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="relative flex items-center justify-center m-auto">
                                            <NFTItem size={84} previewUrl="" detailUrl="" />
                                            {/*<NFTBadges location="overlay" chain="Ethereum" collectionImg='https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5' />*/}
                                        </div>
                                    ))}
                                </div>
                            </AssetCard>

                            <AssetCard title="Donations" color="donation">
                                <div className={`grid grid-cols-2 gap-3`}>
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
                                </div>
                            </AssetCard>
                        </div>
                        <div>
                            <AssetCard title="Footprints" color="footprint">
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
                </section>
                <section>
                    <div className="grid grid-cols-2 gap-6 justify-items-center">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="relative">
                                <NFTItem size={208} previewUrl="" detailUrl="" />
                                <NFTBadges
                                    location="overlay"
                                    chain="Ethereum"
                                    collectionImg="https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5"
                                />
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <DonationCard
                        imageUrl="https://c.gitcoin.co/grants/546622657b597ce151666ed2e2ecbd92/rss3_square_blue.png"
                        name="RSS3 - RSS with human curation"
                        contribCount={1}
                        contribDetails={[
                            {
                                token: 'ETH',
                                amount: '0.1',
                            },
                        ]}
                    />
                </section>

                <section className="flex flex-col gap-y-4">
                    <AccountCard chain="EVM+" address="0xd0B85A7bB6B602f63B020256654cBE73A753DFC4" />
                    <AccountCard chain="EVM+" address="0x0000000000000000000000000000000000000000" />
                    <AccountCard chain="Misskey" address="Fendi" />
                    <AccountCard chain="Twitter" address="Fendi" />
                    <EVMpAccountItem size="lg" />
                </section>

                <section className="flex flex-col items-start p-4 rounded-lg gap-y-2">
                    <MarketTag market="opensea" />
                    <MarketTag market="rarible" />
                    <ScanTag chain="Ethereum" />
                    <ScanTag chain="BSC" />
                    <ScanTag chain="Polygon" />
                </section>

                <section className="flex flex-row flex-wrap items-start gap-2 p-4 m-4 rounded-lg">
                    <Trait traitType="body" traitValue="blue cat skin"></Trait>
                    <Trait traitType="face" traitValue="heart"></Trait>
                    <Trait traitType="hats" traitValue="beret red"></Trait>
                </section>

                <section>
                    <div>
                        <RecommendSection
                            groups={[...Array(3)].map((_, gid) => ({
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
                            }))}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Test;
