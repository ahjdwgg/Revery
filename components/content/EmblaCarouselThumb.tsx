import React from 'react';
import Image from 'next/image';
import style from '../../styles/embla.module.css';

export const Thumb = ({ selected, onClick, imgSrc }: any) => (
    <div className={`${style.embla__slide} ${style.embla__slide__thumb}`}>
        <button
            onClick={onClick}
            className={`${style.embla__slide__inner} ${style.embla__slide__inner__thumb}`}
            type="button"
        >
            <Image src={imgSrc} layout="fill" objectFit="cover" />
        </button>
    </div>
);
