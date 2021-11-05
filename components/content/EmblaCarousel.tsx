import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { Thumb } from './EmblaCarouselThumb';
import style from '../../styles/embla.module.css';

const EmblaCarousel = ({ slides }: any) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mainViewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
    const [thumbViewportRef, emblaThumbs] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        selectedClass: '',
        dragFree: true,
    });

    const onThumbClick = useCallback(
        (index) => {
            if (!embla || !emblaThumbs) return;
            if (emblaThumbs.clickAllowed()) embla.scrollTo(index);
        },
        [embla, emblaThumbs],
    );

    const onSelect = useCallback(() => {
        if (!embla || !emblaThumbs) return;
        setSelectedIndex(embla.selectedScrollSnap());
        emblaThumbs.scrollTo(embla.selectedScrollSnap());
    }, [embla, emblaThumbs, setSelectedIndex]);

    useEffect(() => {
        if (!embla) return;
        onSelect();
        embla.on('select', onSelect);
    }, [embla, onSelect]);

    return (
        <>
            <div className={style.embla}>
                <div className={style.embla__viewport} ref={mainViewportRef}>
                    <div className={style.embla__container}>
                        {slides.map((imgSrc: string, index: number) => (
                            <div className={style.embla__slide} key={index}>
                                <div className={style.embla__slide__inner}>
                                    <Image src={imgSrc} layout="fill" objectFit="cover" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={`${style.embla} ${style.embla__thumb}`}>
                <div className={style.embla__viewport} ref={thumbViewportRef}>
                    <div className={`${style.embla__container} ${style.embla__container__thumb}`}>
                        {slides.map((imgSrc: string, index: number) => (
                            <Thumb
                                onClick={() => onThumbClick(index)}
                                selected={index === selectedIndex}
                                imgSrc={imgSrc}
                                key={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmblaCarousel;
