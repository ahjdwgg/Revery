import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Button from '../components/buttons/Button';
import { COLORS } from '../components/buttons/variables';
import ContentCard from '../components/content/ContentCard';
import Header from '../components/Header';
import ImageHolder from '../components/ImageHolder';
import RecommendSection from '../components/recommends/RecommendSection';
import Modal from '../components/Modal';
import WalletConnect from '../components/icons/WalletConnect';
import Metamask from '../components/icons/Metamask';
import RSS3, { EMPTY_RSS3_DP, IRSS3, RSS3DetailPersona } from '../common/rss3';
import { RSS3Profile } from 'rss3-next/types/rss3';
const Home: NextPage = () => {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [modalHidden, setModalHidden] = useState(true);

    let [rss3, setRss3] = useState<IRSS3 | null>(null);
    let RSS3LoginUser: RSS3DetailPersona = Object.create(EMPTY_RSS3_DP);

    // default avatar
    const [avatarURL, setAvatarURL] = useState(
        'https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5',
    );

    const initRedirect = async () => {
        let profile: RSS3Profile | null = null;
        let address: string = '';
        try {
            console.log('init: ', rss3);
            profile = RSS3LoginUser.profile;
            address = RSS3LoginUser.address;
            console.log('profile: ', profile, address);
        } catch (e) {
            console.log(e);
        }

        if (!(profile?.name || profile?.bio || profile?.avatar?.length)) {
            console.log('no profile');
            // direct to setup page
            await router.push('/setup');
        } else {
            // login
            console.log('login');
            closeModal();
            setAvatarURL(profile?.avatar?.[0] || avatarURL);
            setIsLoggedIn(true);
        }
    };

    const openModal = () => {
        setModalHidden(false);
    };

    const closeModal = () => {
        setModalHidden(true);
    };

    const handleWalletConnect = async () => {
        try {
            RSS3LoginUser = await RSS3.connect.walletConnect();
        } catch (e) {
            return null;
        }
        await verifyProfile();
    };

    const handleMetamask = async () => {
        try {
            RSS3LoginUser = await RSS3.connect.metamask();
        } catch (e) {
            console.log(e);
            return;
        }
        await verifyProfile();
    };

    const verifyProfile = async () => {
        // RSS3LoginUser = await RSS3.apiUser();
        if (RSS3LoginUser.persona) {
            await initRedirect();
        } else {
            console.log('verification failed');
        }
    };

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
        <>
            <Header>
                <div className="flex flex-row justify-end w-full gap-x-8">
                    {isLoggedIn ? (
                        <>
                            <Button isOutlined={false} color={COLORS.primary} text={'Create Now'} />
                            <ImageHolder imageUrl={avatarURL} isFullRound={true} size={28} />
                        </>
                    ) : (
                        <Button
                            isOutlined={false}
                            color={COLORS.primary}
                            text={'Connect Wallet'}
                            height={'h-8'}
                            onClick={openModal}
                        />
                    )}
                </div>
            </Header>
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'}>
                <div className="flex flex-col gap-y-6 mx-14 my-8">
                    <Button
                        isOutlined={false}
                        color={COLORS.primary}
                        onClick={handleWalletConnect}
                        fontSize={'text-md'}
                        width={'w-60'}
                        height={'h-14'}
                    >
                        <WalletConnect size={30} />
                        <span>WalletConnect</span>
                    </Button>
                    <Button
                        isOutlined={false}
                        color={COLORS.metamask}
                        onClick={handleMetamask}
                        fontSize={'text-md'}
                        width={'w-60'}
                        height={'h-14'}
                    >
                        <Metamask size={30} />
                        <span>Metamask</span>
                    </Button>
                </div>
            </Modal>
            <div className="flex flex-row justify-between max-w-6xl px-2 pt-16 mx-auto gap-x-8">
                <section className="divide-y-2 w-7/11 divide-solid divide-opacity-5 divide-primary">
                    {[...Array(2)].map((_, i) => (
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
                    <RecommendSection groups={recommendGroups} />
                </section>
            </div>
        </>
    );
};

export default Home;
