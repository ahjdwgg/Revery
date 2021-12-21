import React from 'react';
import utils from '../common/utils';
import Image from 'next/image';

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
            <Image
                className={imageClassNames}
                src={`/api/imageproxy?url=${encodeURIComponent(utils.fixURLSchemas(imageUrl))}`}
                width={size}
                height={size}
                objectFit={'cover'}
                quality={80}
                alt={title}
            />
        </div>
    );
};

export default ImageHolder;
