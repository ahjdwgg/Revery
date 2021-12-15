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
import Logo from './icons/Logo';
import ModalConnect from '../components/modal/ModalConnect';

type LoadingTypes = 'any' | 'WalletConnect' | 'Metamask' | null;

interface HeaderProps {
    triggerModalOpen?: () => void;
}

const Header = ({ triggerModalOpen }: HeaderProps) => {
    const router = useRouter();

    const [top, setTop] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState<LoadingTypes>(null);
    const [modalHidden, setModalHidden] = useState(true);
    const [isConnectModalClosed, setConnectModalClosed] = useState(true);
    // default avatar
    const [avatarURL, setAvatarURL] = useState(config.undefinedImageAlt);

    const init = async () => {
        if (RSS3.getLoginUser().persona || (await RSS3.reconnect())) {
            initAccount();
            setIsLoggedIn(true);
        }
    };

    const openConnectModal = () => {
        setIsLoading('any');
        setConnectModalClosed(false);
    };
    const closeConnectModal = () => {
        setIsLoading(null);
        setConnectModalClosed(true);
    };
    const openModal = () => {
        setIsLoading('any');
        setModalHidden(false);
    };

    const closeModal = () => {
        setIsLoading(null);
        setModalHidden(true);
    };

    const handleWalletConnect = async () => {
        setIsLoading('WalletConnect');
        try {
            if (await RSS3.connect.walletConnect()) {
                initAccount();
                closeModal();
                reloadPage();
                return;
            }
        } catch (e) {
            console.log(e);
        }
        setIsLoading('any');
    };

    const handleMetamask = async () => {
        setIsLoading('Metamask');
        try {
            if (await RSS3.connect.metamask()) {
                initAccount();
                closeModal();
                reloadPage();
                return;
            }
        } catch (e) {
            console.log(e);
        }
        setIsLoading('any');
    };

    const initAccount = () => {
        setIsLoading('any');
        const profile = RSS3.getLoginUser().profile;

        setAvatarURL(profile?.avatar?.[0] || avatarURL);

        setIsLoading(null);
    };

    const toProfilePage = () => {
        const { name, address } = RSS3.getLoginUser();
        router.push(`/u/${name || address}`);
    };

    const reloadPage = () => {
        router.reload();
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
            <header className={`fixed w-full z-30 transition duration-300 ease-in-out ${!top && 'bg-white shadow'}`}>
                <div className="max-w-6xl px-2 mx-auto">
                    <div className="flex items-center justify-between h-12 md:h-16">
                        <nav className="w-full flex items-center justify-between">
                            <div className="cursor-pointer" onClick={() => router.push(`/`)}>
                                <Logo />
                            </div>
                            <div className="flex flex-row justify-end w-full gap-x-4">
                                {isLoggedIn ? (
                                    <>
                                        <Button
                                            isOutlined={false}
                                            color={COLORS.primary}
                                            text={'Create Now'}
                                            width={'w-32'}
                                            height={'h-8'}
                                            isDisabled={true}
                                        />
                                        <div className="cursor-pointer" onClick={toProfilePage}>
                                            <ImageHolder imageUrl={avatarURL} isFullRound={true} size={28} />
                                        </div>
                                    </>
                                ) : isLoading !== null ? (
                                    <Button
                                        isOutlined={false}
                                        color={COLORS.primary}
                                        icon={'loading'}
                                        width={'w-32'}
                                        height={'h-8'}
                                    />
                                ) : (
                                    <Button
                                        isOutlined={false}
                                        color={COLORS.primary}
                                        text={'Connect Wallet'}
                                        width={'w-32'}
                                        height={'h-8'}
                                        onClick={openModal}
                                    />
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
            {/* <ModalConnect hidden={isConnectModalClosed} closeEvent={closeConnectModal} /> */}
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} isCenter={true} size="sm">
                <div className="flex flex-col my-8 gap-y-6 mx-14">
                    {isLoading === 'WalletConnect' ? (
                        <Button
                            isOutlined={false}
                            color={COLORS.primary}
                            icon={'loading'}
                            width={'w-60'}
                            height={'h-14'}
                        />
                    ) : (
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
                    )}
                    {isLoading === 'Metamask' ? (
                        <Button
                            isOutlined={false}
                            color={COLORS.metamask}
                            icon={'loading'}
                            width={'w-60'}
                            height={'h-14'}
                        />
                    ) : (
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
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Header;
