import React from 'react';
import Image from 'next/image';

interface ContentProps {
    imageUrl: string;
    title?: string;
    isFullRound: boolean;
}

const ContentCard = ({ imageUrl, title, isFullRound }: ContentProps) => {
    const roundedStyleString = isFullRound ? 'rounded-full' : 'rounded';

    return (
        <div className={roundedStyleString}>
            <Image className={roundedStyleString} src={imageUrl} alt={title} width={84} height={84} />
        </div>
    );
};

export default ContentCard;
