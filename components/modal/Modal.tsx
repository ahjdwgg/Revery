import { ReactNode, UIEvent, useEffect, useLayoutEffect, useState } from 'react';
import { BiX } from 'react-icons/bi';
import LoadMoreButton from '../buttons/LoadMoreButton';
import { COLORS } from '../buttons/variables';

export type ModalColorStyle = 'account' | 'nft' | 'donation' | 'footprint' | 'primary';

interface ModalProps {
    theme: ModalColorStyle;
    hidden: boolean;
    size: 'sm' | 'md' | 'lg';
    title?: ReactNode;
    children: ReactNode;
    closeEvent: () => void;
    loadMorePlaceholder?: ReactNode;
    onLoadMore?: () => void;
    isLoadingMore?: boolean;
}

export default function Modal({
    theme,
    hidden,
    size,
    title,
    children,
    closeEvent,
    loadMorePlaceholder,
    onLoadMore,
    isLoadingMore,
}: ModalProps) {
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
            className={`fixed top-0 left-0 z-50 w-full h-screen overflow-y-auto bg-black bg-opacity-5 animated faster ${
                isHidden ? 'hidden' : ''
            } ${animation ? 'fadeIn' : 'fadeOut'}`}
            onClick={modalClose}
        >
            <div
                style={{ top: '50%', transform: 'translate(0, -50%)' }}
                className={`relative mx-auto bg-white shadow ${modalSize.get(size)}`}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="py-2 px-2 flex items-center justify-start w-full">
                    <BiX className={`w-8 h-8 cursor-pointer ${buttonTheme.get(theme)}`} onClick={modalClose} />
                    <div>
                        <span className="text-primary text-lg font-semibold capitalize mx-2">{title}</span>
                    </div>
                </div>
                <div style={{ maxHeight: '85vh' }} className="overflow-auto">
                    {children}
                    {typeof isLoadingMore !== 'undefined' && (
                        <LoadMoreButton
                            color={COLORS.primary}
                            width={'w-32'}
                            height={'h-8'}
                            isLoading={isLoadingMore}
                            onClick={() => {
                                if (typeof onLoadMore === 'function') {
                                    onLoadMore();
                                }
                            }}
                        >
                            {loadMorePlaceholder}
                        </LoadMoreButton>
                    )}
                </div>
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
    ['sm', 'max-w-sm pb-8'],
    ['md', 'flex flex-col items-center justify-around w-full max-w-lg pb-6'],
    ['lg', 'w-full max-w-6xl px-2 pb-12'],
]);
