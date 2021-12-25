/* eslint-disable @next/next/no-img-element */

import React from 'react';
import utils from '../common/utils';

interface ImageProps {
    imageUrl: string;
    title?: string;
    roundedClassName: string;
    size: number;
    onClick?: () => void;
}

const ImageHolder = ({ imageUrl, title, roundedClassName, size, onClick }: ImageProps) => {
    const imageClassNames = `w-full h-full object-cover transition-all duration-200 ease-in-out ${roundedClassName}`;
    return (
        <div
            className={`flex justify-around relative ${onClick ? 'cursor-pointer' : ''}`}
            style={{ width: size, height: size }}
            onClick={onClick}
        >
            <img
                className={imageClassNames}
                src={utils.fixURLSchemas(imageUrl)}
                width={size}
                height={size}
                alt={title}
            />
        </div>
    );
};

export default ImageHolder;
