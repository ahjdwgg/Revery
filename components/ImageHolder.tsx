/* eslint-disable @next/next/no-img-element */

import React from 'react';
import utils from '../common/utils';

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
            <img
                className={`w-full h-full object-cover ${roundedStyleString}`}
                src={utils.fixURLSchemas(imageUrl)}
                alt={title}
            />
        </div>
    );
};

export default ImageHolder;
