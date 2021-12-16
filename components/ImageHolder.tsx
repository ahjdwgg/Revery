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

const ImageHolder = ({ imageUrl, title, roundedClassName, size, onClick = () => {} }: ImageProps) => {
    return (
        <div className={`flex justify-around relative`} style={{ width: size, height: size }} onClick={onClick}>
            <img
                className={`w-full h-full object-cover transition-all duration-200 ease-in-out ${roundedClassName}`}
                src={utils.fixURLSchemas(imageUrl)}
                alt={title}
            />
        </div>
    );
};

export default ImageHolder;
