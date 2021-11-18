import React, { useState, useEffect } from 'react';
import Modal from './modal/Modal';
import Button from './buttons/Button';
import { COLORS } from './buttons/variables';
import WalletConnect from './icons/WalletConnect';
import Metamask from './icons/Metamask';
import ImageHolder from './ImageHolder';
import RSS3 from '../common/rss3';
import { useRouter } from 'next/router';
import config from '../common/config';

function Header(props: any) {
    const router = useRouter();

    const [top, setTop] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [modalHidden, setModalHidden] = useState(true);

    // default avatar
    const [avatarURL, setAvatarURL] = useState(config.undefinedImageAlt);

    const init = async () => {
        if (RSS3.getLoginUser().persona || (await RSS3.reconnect())) {
            initAccount();
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
            await RSS3.connect.walletConnect();
            initAccount();
        } catch (e) {
            return null;
        }
    };

    const handleMetamask = async () => {
        try {
            await RSS3.connect.metamask();
            initAccount();
        } catch (e) {
            console.log(e);
            return;
        }
    };

    const initAccount = () => {
        const profile = RSS3.getLoginUser().profile;

        setAvatarURL(profile?.avatar?.[0] || avatarURL);
        setIsLoggedIn(true);
        setModalHidden(true);
    };

    const toProfilePage = () => {
        const { name } = RSS3.getLoginUser();
        router.push(`/u/${name}`);
    };

    // detect whether user has scrolled the page down by 10px
    useEffect(() => {
        const scrollHandler = () => {
            window.pageYOffset > 10 ? setTop(false) : setTop(true);
        };
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [top]);

    useEffect(() => {
        init();
    }, []);

    // init();

    return (
        <>
            <header
                className={`fixed w-full z-30 transition duration-300 ease-in-out ${
                    !top && 'bg-white border-b border-black shadow-lg'
                }`}
            >
                <div className="max-w-6xl px-2 mx-auto">
                    <div className="flex items-center justify-between h-12 md:h-16">
                        <nav className="hidden w-full md:flex md:flex-grow">
                            <div className="flex flex-row justify-end w-full gap-x-8">
                                {isLoggedIn ? (
                                    <>
                                        <Button isOutlined={false} color={COLORS.primary} text={'Create Now'} />
                                        <div className="cursor-pointer" onClick={toProfilePage}>
                                            <ImageHolder imageUrl={avatarURL} isFullRound={true} size={28} />
                                        </div>
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
                        </nav>
                    </div>
                </div>
            </header>
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} isCenter={true} size="sm">
                <div className="flex flex-col my-8 gap-y-6 mx-14">
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
        </>
    );
}

export default Header;
