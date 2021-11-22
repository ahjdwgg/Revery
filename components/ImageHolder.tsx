import React from 'react';

interface ImageProps {
    imageUrl: string;
    title?: string;
    isFullRound: boolean;
    size: number;
    onClick?: () => void;
}

const ImageHolder = ({ imageUrl, title, isFullRound, size, onClick = () => {} }: ImageProps) => {
    const roundedStyleString = isFullRound ? 'rounded-full' : 'rounded';

    return (
        <div
            className={`flex justify-around relative ${roundedStyleString}`}
            style={{ width: size, height: size }}
            onClick={onClick}
        >
            <img className={`w-full h-full object-cover ${roundedStyleString}`} src={imageUrl} alt={title} />
        </div>
    );
};

export default ImageHolder;
