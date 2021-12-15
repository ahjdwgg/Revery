import { ReactNode, useEffect, useState } from 'react';
import { BiX } from 'react-icons/bi';

export type ModalColorStyle = 'account' | 'nft' | 'donation' | 'footprint' | 'primary';

interface ModalProps {
    theme: ModalColorStyle;
    hidden: boolean;
    size: 'sm' | 'md' | 'lg';
    isCenter: boolean;
    children: ReactNode;
    closeEvent: () => void;
}

export default function Modal({ theme, hidden, size, isCenter, children, closeEvent }: ModalProps) {
    const [isHidden, setIsHidden] = useState(hidden);
    const [animation, setAnimation] = useState(true);

    const modalClose = () => {
        setAnimation(false);
        setTimeout(() => {
            closeEvent();
            setAnimation(true);
            if (hidden) {
                setIsHidden(true);
            }
        }, 500);
    };

    const onStateChange = () => {
        if (hidden && !isHidden) {
            modalClose();
        } else {
            setIsHidden(hidden);
        }
    };

    useEffect(() => {
        onStateChange();
    }, [hidden]);

    return (
        <div
            className={`fixed top-0 left-0 z-50 w-full h-screen overflow-y-auto py-16 bg-black bg-opacity-5 animated faster ${
                isHidden ? 'hidden' : ''
            } ${animation ? 'fadeIn' : 'fadeOut'} ${isCenter ? 'flex flex-row justify-center items-center' : ''} `}
            onClick={modalClose}
        >
            <div
                className={modalSize.get(size)}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <BiX
                    className={`absolute w-8 h-8 cursor-pointer top-2 left-2 ${buttonTheme.get(theme)}`}
                    onClick={modalClose}
                />
                {children}
            </div>
        </div>
    );
}

export const buttonTheme = new Map([
    ['account', 'text-account'],
    ['nft', 'text-nft'],
    ['donation', 'text-donation'],
    ['footprint', 'text-footprint'],
    ['primary', 'text-primary'],
]);

export const modalSize = new Map([
    ['sm', 'relative max-w-sm px-2 py-12 mx-auto bg-white shadow'],
    ['md', 'relative flex flex-col items-center justify-around w-full max-w-lg bg-white h-96 p-14 shadow'],
    ['lg', 'relative w-full max-w-6xl px-2 py-12 mx-auto bg-white shadow'],
]);
