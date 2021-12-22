import { useEffect, useState } from 'react';
import RSS3 from '../../common/rss3';
import Button from '../buttons/Button';
import { COLORS } from '../buttons/variables';
import Metamask from '../icons/Metamask';
import WalletConnect from '../icons/WalletConnect';
import Modal from './Modal';

export type ModalColorStyle = 'account' | 'nft' | 'donation' | 'footprint' | 'primary';
type LoadingTypes = 'any' | 'WalletConnect' | 'Metamask' | null;

interface ModalConnectProps {
    hidden: boolean;
    closeEvent: () => void;
}

export default function ModalConnect({ hidden, closeEvent }: ModalConnectProps) {
    const [isLoading, setIsLoading] = useState<LoadingTypes>(null);

    const init = async () => {
        if (RSS3.getLoginUser().persona || (await RSS3.reconnect())) {
            setIsLoading(null);
        }
    };

    const closeModal = () => {
        setIsLoading(null);
        closeEvent();
    };

    const handleWalletConnect = async () => {
        setIsLoading('WalletConnect');
        try {
            if (await RSS3.connect.walletConnect()) {
                setIsLoading(null);
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
                setIsLoading(null);
                closeModal();
                return;
            }
        } catch (e) {
            console.log(e);
        }
        setIsLoading('any');
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <Modal hidden={hidden} closeEvent={closeEvent} theme={'primary'} size="sm">
            <div className="flex flex-col my-8 overflow-y-hidden gap-y-6 mx-14">
                {isLoading === 'WalletConnect' ? (
                    <Button isOutlined={false} color={COLORS.primary} icon={'loading'} width={'w-60'} height={'h-14'} />
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
    );
}
