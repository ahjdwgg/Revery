/* eslint-disable @next/next/no-img-element */

import React from 'react';
import EmblaCarousel from './EmblaCarousel';
import Arweave from '../icons/Arweave';
import Twitter from '../icons/Twitter';
import Mirror from '../icons/Mirror';
import Misskey from '../icons/Misskey';
import { timeDifferent } from '../../common/timeStamp';

interface ContentProps {
    avatarUrl: string;
    username: string;
    title?: string;
    content?: string;
    images?: string[];
    timeStamp: number;
    type?: string;
}

const ContentCard = ({ avatarUrl, username, title, content, images, timeStamp, type }: ContentProps) => {
    let iconSVG = null;

    if (type) {
        switch (type) {
            case 'Arweave':
                iconSVG = <Arweave />;
                break;
            case 'Twitter':
                iconSVG = <Twitter />;
                break;
            case 'Mirror-XYZ':
                iconSVG = <Mirror />;
                break;
            case 'Misskey':
                iconSVG = <Misskey />;
                break;
        }
    }
    return (
        <div className="flex flex-col justify-start w-full py-2.5">
            <div className="flex flex-row items-center gap-x-3">
                <img src={avatarUrl} alt={username} width={32} height={32} className="rounded-full" />
                <div className="text-base font-semibold">{username}</div>
                <>
                    <span className="opacity-20">{timeDifferent(timeStamp)}</span>
                    {type && iconSVG && (
                        <div className="flex w-4 h-4 rounded-full opacity-100 place-items-center">{iconSVG}</div>
                    )}
                </>
            </div>
            {title && <div className="mt-2 text-base font-semibold">{title}</div>}
            {content && <div className="mt-1 text-base leading-5 whitespace-pre-line select-none">{content}</div>}
            {images?.length && <EmblaCarousel slides={images} />}
        </div>
    );
};

export default ContentCard;
