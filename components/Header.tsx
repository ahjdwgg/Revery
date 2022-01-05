import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import config from '../common/config';
import Events from '../common/events';
import RNS from '../common/rns';
import RSS3 from '../common/rss3';
import Button from './buttons/Button';
import { COLORS } from './buttons/variables';
import Logo from './icons/Logo';
import ImageHolder from './ImageHolder';
import ModalConnect from './modal/ModalConnect';
import { utils as ethersUtils } from 'ethers';

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

    const [searchError, setSearchError] = useState(false);

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
        } else {
            setAvatarURL(config.undefinedImageAlt);
        }

        setIsLoading(null);
    };

    const toProfilePage = () => {
        const { name, address } = RSS3.getLoginUser();
        router.push(`/u/${name || address}`);
    };

    const handleSearchUser = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentSearchUser(event.target.value as string);
    };

    const toSearchedUserPage = async () => {
        const invalidAddr = '0x0000000000000000000000000000000000000000';
        if (currentSearchUser) {
            let ethAddress = '';
            let rns = '';
            if (ethersUtils.isAddress(currentSearchUser)) {
                // current search input is an address
                ethAddress = ethersUtils.getAddress(currentSearchUser);
                rns = await RNS.addr2Name(ethAddress);
            } else {
                // current search input is an RNS or ENS
                rns = currentSearchUser.toLowerCase();
                ethAddress = await RNS.name2Addr(rns);
            }
            if (ethAddress !== invalidAddr) {
                setSearchError(false);
                router.push(`/u/${rns || ethAddress}`);
            } else {
                setSearchError(true);
            }
        }
    };

    const handleKeypress = async (e: any) => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            await toSearchedUserPage();
        }
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
            <header className={`fixed w-full z-30 transition duration-300 ease-in-out bg-white ${!top && 'shadow'}`}>
                <div className="max-w-6xl px-2 mx-auto">
                    <div className="flex items-center justify-between h-12 md:h-16">
                        <nav className="flex items-center justify-between w-full">
                            <div className="cursor-pointer" onClick={() => router.push(`/`)}>
                                <Logo />
                            </div>
                            <div className="flex flex-row items-center justify-end w-full gap-x-4">
                                <BiSearch className="w-4 h-4 opacity-50" />
                                <div className={`flex flex-col ${searchError ? 'mt-4' : ''}`}>
                                    <input
                                        className="w-64 h-8 text-sm outline-none"
                                        placeholder={'Search for an address, RNS, DAS or ENS'}
                                        type={'text'}
                                        onKeyPress={handleKeypress}
                                        onChange={handleSearchUser}
                                    />
                                    <p className={`text-xs text-error -translate-y-1 ${!searchError ? 'hidden' : ''}`}>
                                        Invalid address, RNS or ENS
                                    </p>
                                </div>
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
            <ModalConnect hidden={modalHidden} closeEvent={closeModal} />
        </>
    );
};

export default Header;
