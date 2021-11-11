import React from 'react';
import Image from 'next/image';

interface ImageProps {
    imageUrl: string;
    title?: string;
    isFullRound: boolean;
    size: number;
}

const ImageHolder = ({ imageUrl, title, isFullRound, size }: ImageProps) => {
    const roundedStyleString = isFullRound ? 'rounded-full' : 'rounded';

    return (
        <div className={`flex justify-around ${roundedStyleString}`} style={{ width: size, height: size }}>
            <Image className={roundedStyleString} src={imageUrl} alt={title} layout="fill" objectFit="cover" />
        </div>
    );
};

export default ImageHolder;
