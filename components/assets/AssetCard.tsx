import React from 'react';
import Button from '../buttons/Button';

/**
 * Asset Card Component
 * @param {string} title - The title of the card
 * @param {string} color - The text and background color of the button
 * @param {string} bodyCols - Columns of the body
 * @param {string} isShowingEditButton - If true, the edit button will be displayed
 * @example
 * <AssetCard
 *     title="NFTs"
 *     color='nft'
 *     isShowingEditButton={true}
 *     bodyCols={2}
 * >
 *     {
 *         [...Array(5)].map((_, i) => (
 *             <ImageHolder key={i} imageUrl={'https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5'} isFullRound={false} />
 *         ))
 *     }
 * </AssetCard>
 *
 */
interface AssetProps {
    title: string;
    color: 'nft' | 'donation' | 'footprint';
    headerButtonMode?: 'edit' | 'plus-minus';
    isShowingExpandButton?: boolean;
    footerTips?: string;
    footerButton?: string;
    isSecondaryBG?: boolean;
    children: React.ReactNode;
}

const AssetCard = ({
    title,
    color,
    headerButtonMode,
    isShowingExpandButton,
    footerTips,
    footerButton,
    isSecondaryBG,
    children,
}: AssetProps) => {
    return (
        <div
            className={`w-full h-full px-3.5 py-3 flex flex-col gap-2 overflow-auto ${
                colorClasses[isSecondaryBG ? 'secondary' : color].cardColorStyles
            }`}
        >
            <div className="flex flex-row justify-between">
                <div className={colorClasses[color].textColorStyles}>
                    <span className="opacity-70 font-semibold text-sm">{title}</span>
                </div>
                <div className="flex flex-row">
                    {headerButtonMode === 'edit' && (
                        <div>
                            <Button key="edit" color={color} text="Edit" isOutlined={true} isDisabled={false} />
                        </div>
                    )}
                    {headerButtonMode === 'plus-minus' && (
                        <div className="flex flex-row gap-2">
                            <Button key="minus" color={color} icon="minus" isOutlined={true} isDisabled={false} />
                            <Button key="plus" color={color} icon="plus" isOutlined={false} isDisabled={false} />
                        </div>
                    )}
                    {isShowingExpandButton && (
                        <div className="ml-2">
                            <Button key="expand" color={color} icon="expand" isOutlined={true} isDisabled={false} />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex h-full w-full p-2 overflow-y-auto">{children}</div>

            {(footerTips || footerButton) && (
                <div className="flex justify-between">
                    <div className="flex">{footerTips && <span className="flex text-nft">{footerTips}</span>}</div>

                    <div className="flex">
                        {footerButton && (
                            <Button key="edit" color={color} text={footerButton} isOutlined={true} isDisabled={false} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const colorClasses = {
    nft: {
        cardColorStyles: 'bg-nft-bg',
        textColorStyles: 'text-nft',
    },
    donation: {
        cardColorStyles: 'bg-donation-bg',
        textColorStyles: 'text-donation',
    },
    footprint: {
        cardColorStyles: 'bg-footprint-bg',
        textColorStyles: 'text-footprint',
    },
    secondary: {
        cardColorStyles: 'bg-secondary-bg',
        textColorStyles: 'text-secondary',
    },
};

export default AssetCard;
