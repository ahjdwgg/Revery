import { ReactNode, useState } from 'react';
import { BiX } from 'react-icons/bi';

interface ModalProps {
    theme: 'account' | 'nft' | 'gitcoin' | 'footprint';
    hidden: boolean;
    isFixed: boolean;
    children: ReactNode;
    closeEvent: () => void;
}

export default function Modal({ theme, hidden, isFixed, children, closeEvent }: ModalProps) {
    const [animation, setAnimation] = useState(true);

    const modalClose = () => {
        setAnimation(false);
        setTimeout(() => {
            closeEvent();
            setAnimation(true);
        }, 500);
    };

    return (
        <div
            className={`${
                isFixed ? 'fixed' : 'absolute'
            } top-0 z-50 w-full min-h-screen py-16 bg-black bg-opacity-50 animated faster ${hidden ? 'hidden' : ''} ${
                animation ? 'fadeIn' : 'fadeOut'
            } ${theme === 'account' ? 'flex flex-row justify-center items-center' : ''} `}
        >
            {theme !== 'account' ? (
                <div className="relative max-w-6xl px-2 py-12 mx-auto bg-white rounded">
                    <BiX
                        className={`absolute w-8 h-8 cursor-pointer top-2 left-2 ${buttonTheme.get(theme)}`}
                        onClick={modalClose}
                    />
                    {children}
                </div>
            ) : (
                <div className="relative flex flex-col items-center justify-around w-full max-w-lg bg-white rounded h-96 p-14">
                    <BiX className="absolute w-8 h-8 cursor-pointer top-2 left-2 text-account" onClick={modalClose} />
                    {children}
                </div>
            )}
        </div>
    );
}

export const buttonTheme = new Map([
    ['account', 'text-account'],
    ['nft', 'text-nft'],
    ['gitcoin', 'text-donation'],
    ['footprint', 'text-footprint'],
]);
