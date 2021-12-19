import React from 'react';
import Button from '../buttons/Button';
import { ReactNode } from 'react';
import GitcoinIcon from '../icons/GitcoinIcon';
import FootprintIcon from '../icons/FootprintIcon';
import NFTIcon from '../icons/NFTIcon';

export const FILTER_TAGS = {
    nft: 'NFT',
    donation: 'Donation',
    footprint: 'Footprint',
    content: 'Content',
};
interface FilterTagProps {
    tag: string;
    isActive: boolean;
    onClick?: (param?: any) => void;
    children?: ReactNode;
}

const FilterTag = ({ tag, isActive, onClick }: FilterTagProps) => {
    const style = isActive
        ? 'border-primary border-opacity-70 text-primary text-opacity-70'
        : 'border-black border-opacity-10 text-black text-opacity-70';

    let iconSVG = null;

    iconSVG = iconMap.get(tag);

    return (
        <div className="animate-fade-in-up">
            <Button
                isOutlined={true}
                className={`${style} flex flex-row gap-1 items-center justify-center font-medium text-xs hover:text-opacity-80 py-sm px-2 undefined border hover:border-opacity-40 rounded`}
                onClick={onClick}
            >
                {tag}
                <div className={'flex items-center justify-center w-3 h-3 rounded-full'}>{iconSVG}</div>
            </Button>
        </div>
    );
};

export default FilterTag;

const iconMap = new Map([
    [FILTER_TAGS.donation, <GitcoinIcon key={FILTER_TAGS.donation} />],
    [FILTER_TAGS.footprint, <FootprintIcon key={FILTER_TAGS.footprint} />],
    [FILTER_TAGS.nft, <NFTIcon key={FILTER_TAGS.nft} />],
]);
