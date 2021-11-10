import React from 'react';
import Image from 'next/image';

export const Thumb = ({ onClick, imgSrc }: any) => (
    <div className="relative pl-2 -mt-3 min-w-1/4">
        <button
            onClick={onClick}
            className="relative w-full m-0 overflow-hidden bg-transparent cursor-pointer aspect-w-16 aspect-h-9"
            type="button"
        >
            <Image src={imgSrc} layout="fill" objectFit="cover" />
        </button>
    </div>
);
