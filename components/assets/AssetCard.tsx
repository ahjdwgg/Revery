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
    color: string;
    bodyCols: number;
    isShowingEditButton: boolean;
    children: React.ReactNode;
}

const AssetCard = ({ title, color, bodyCols, isShowingEditButton, children }: AssetProps) => {
    // Setup card colors
    // Must use full strings
    // Refer to https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html
    let cardColorStyles = '';
    let textColorStyles = '';
    switch (color) {
        case 'nft':
            cardColorStyles = 'bg-nft-bg';
            textColorStyles = 'text-nft';
            break;
        case 'donation':
            cardColorStyles = 'bg-donation-bg';
            textColorStyles = 'text-donation';
            break;
        case 'footprint':
            cardColorStyles = 'bg-footprint-bg';
            textColorStyles = 'text-footprint';
            break;
        default:
            break;
    }

    return (
        <div className={`px-3.5 py-3 flex flex-col ${cardColorStyles}`}>
            <div className="flex flex-row justify-between">
                <div className={textColorStyles}>
                    <span className="opacity-70 font-semibold text-sm">{title}</span>
                </div>
                <div className="flex flex-row">
                    {isShowingEditButton && (
                        <div>
                            <Button key="edit" color={color} text="Edit" isOutlined={true} isDisabled={false} />
                        </div>
                    )}
                    <div className="ml-2">
                        <Button key="expand" color={color} icon="expand" isOutlined={true} isDisabled={false} />
                    </div>
                </div>
            </div>

            <div className={`mt-2.5 text-center grid grid-cols-${bodyCols} gap-3`}>{children}</div>
        </div>
    );
};

export default AssetCard;
