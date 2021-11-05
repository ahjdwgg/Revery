import React from 'react';
import Image from 'next/image';

interface AssetItemProps {
    imageUrl: string;
    title?: string;
    isFullRound: boolean;
    size: number;
}

const AssetItem = ({ imageUrl, title, isFullRound, size }: AssetItemProps) => {
    const roundedStyleString = isFullRound ? 'rounded-full' : 'rounded';

    return (
        <div className={roundedStyleString}>
            <Image className={roundedStyleString} src={imageUrl} alt={title} width={size} height={size} />
        </div>
    );
};

export default AssetItem;
