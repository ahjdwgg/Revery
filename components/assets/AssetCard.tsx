import React from 'react';
import Button from '../buttons/Button';

export interface AssetCardButtonMode {
    icon?: string;
    text?: string;
    isOutlined: boolean;
    isDisabled: boolean;
    onClick?: () => void;
}

interface AssetProps {
    title: string;
    color: 'account' | 'nft' | 'donation' | 'footprint';
    headerButtons?: AssetCardButtonMode[];
    footerTips?: string;
    footerButtons?: AssetCardButtonMode[];
    isSecondaryBG?: boolean;
    isTransparentBG?: boolean;
    children: React.ReactNode;
}

const AssetCard = ({
    title,
    color,
    headerButtons,
    footerTips,
    footerButtons,
    isSecondaryBG,
    isTransparentBG,
    children,
}: AssetProps) => {
    let cardBackgroundColorClass = '';
    if (!isTransparentBG) {
        cardBackgroundColorClass = colorClasses[isSecondaryBG ? 'secondary' : color].cardColorClass;
    }

    return (
        <div className={`w-full h-full px-3.5 py-3 flex flex-col gap-2 overflow-auto ${cardBackgroundColorClass}`}>
            <div className="flex flex-row justify-between">
                <div className={colorClasses[color].textColorClass}>
                    <span className="opacity-70 font-semibold text-sm">{title}</span>
                </div>
                <div className="flex flex-row gap-2">
                    {headerButtons?.map((btn, i) => (
                        <Button
                            key={i}
                            color={color}
                            icon={btn.icon}
                            text={btn.text}
                            isOutlined={btn.isOutlined}
                            isDisabled={btn.isDisabled}
                            onClick={btn.onClick}
                        />
                    ))}
                </div>
            </div>

            <div className="flex h-full w-full p-2 overflow-y-auto">{children}</div>

            {(footerTips || footerButtons?.length) && (
                <div className="flex justify-between">
                    <div className="flex">
                        {typeof footerTips !== 'undefined' && (
                            <span className={colorClasses[color].textColorClass}>{footerTips}</span>
                        )}
                    </div>

                    <div className="flex flex-row gap-2 items-end">
                        {footerButtons?.map((btn, i) => (
                            <Button
                                key={i}
                                color={color}
                                icon={btn.icon}
                                text={btn.text}
                                isOutlined={btn.isOutlined}
                                isDisabled={btn.isDisabled}
                                onClick={btn.onClick}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const colorClasses = {
    account: {
        cardColorClass: 'bg-account-bg',
        textColorClass: 'text-account',
    },
    nft: {
        cardColorClass: 'bg-nft-bg',
        textColorClass: 'text-nft',
    },
    donation: {
        cardColorClass: 'bg-donation-bg',
        textColorClass: 'text-donation',
    },
    footprint: {
        cardColorClass: 'bg-footprint-bg',
        textColorClass: 'text-footprint',
    },
    secondary: {
        cardColorClass: 'bg-secondary-bg',
        textColorClass: 'text-secondary',
    },
};

export default AssetCard;
