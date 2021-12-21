import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import config from '../common/config';
import RSS3 from '../common/rss3';
import Button from './buttons/Button';
import { COLORS } from './buttons/variables';
import Logo from './icons/Logo';
import Metamask from './icons/Metamask';
import WalletConnect from './icons/WalletConnect';
import ImageHolder from './ImageHolder';
import Modal from './modal/Modal';
import Events from '../common/events';

type LoadingTypes = 'any' | 'WalletConnect' | 'Metamask' | null;

const Header = () => {
    const router = useRouter();

    const [top, setTop] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState<LoadingTypes>(null);
    const [modalHidden, setModalHidden] = useState(true);

    const [currentSearchUser, setCurrentSearchUser] = useState('');

    // default avatar
    const [avatarURL, setAvatarURL] = useState(config.undefinedImageAlt);

    const init = async () => {
        if (RSS3.isValidRSS3()) {
            setIsLoggedIn(true);
            await RSS3.ensureLoginUser();
            initAccount();
        } else {
            setIsLoggedIn(false);
        }
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

        if (profile?.avatar?.[0]) {
            setAvatarURL(profile.avatar[0]);
        }

        setIsLoading(null);
    };

    const toProfilePage = () => {
        const { name, address } = RSS3.getLoginUser();
        router.push(`/u/${name || address}`);
    };

    const handleSearchUser = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentSearchUser(event.target.value);
    };

    const toSearchedUserPage = (event: FormEvent<HTMLInputElement>) => {
        console.log(currentSearchUser);
        router.push(`/u/${currentSearchUser}`);
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
        document.addEventListener(Events.connect, init);
        document.addEventListener(Events.disconnect, init);
    }, []);

    // init();

    return (
        <>
            <header className={`fixed w-full z-30 transition duration-300 ease-in-out ${!top && 'bg-white shadow'}`}>
                <div className="max-w-6xl px-2 mx-auto">
                    <div className="flex items-center justify-between h-12 md:h-16">
                        <nav className="flex items-center justify-between w-full">
                            <div className="cursor-pointer" onClick={() => router.push(`/`)}>
                                <Logo />
                            </div>
                            <div className="flex flex-row justify-end w-full gap-x-4">
                                <input
                                    className="h-8 px-2 text-sm outline-none w-76"
                                    placeholder={'Search for an address, rns or ens'}
                                    type={'text'}
                                    onChange={handleSearchUser}
                                />
                                <Button
                                    isOutlined={false}
                                    text={'Go'}
                                    color={COLORS.primary}
                                    width={'w-10'}
                                    height={'h-8'}
                                    onClick={toSearchedUserPage}
                                />

                                {isLoggedIn ? (
                                    <div className="cursor-pointer" onClick={toProfilePage}>
                                        <ImageHolder imageUrl={avatarURL} roundedClassName={'rounded-full'} size={28} />
                                    </div>
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
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} size="sm">
                <div className="flex flex-col my-8 overflow-y-hidden gap-y-6 mx-14">
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
