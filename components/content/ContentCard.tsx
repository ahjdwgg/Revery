import React from 'react';
import Image from 'next/image';
import EmblaCarousel from './EmblaCarousel';
import { BiHeart, BiMessage, BiShare } from 'react-icons/bi';
import Arweave from '../icons/Arweave';
import Twitter from '../icons/Twitter';
import Mirror from '../icons/Mirror';
import Misskey from '../icons/Misskey';

interface ContentProps {
    avatarUrl: string;
    username: string;
    content: string;
    images?: string[];
    timeStamp: number;
    type: string;
}

const timeDifferent = (timeStamp: number): string => {
    const date1: any = new Date(timeStamp * 1000);
    const date2: any = Date.now();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (diffDays == 0) {
        return diffHours + ' hours ago';
    } else if (diffDays > 99 || diffHours == 0) {
        return diffDays + ' days ago';
    } else {
        return diffDays + ' days ' + diffHours + ' hours ago';
    }
};

const ContentCard = ({ avatarUrl, username, content, images, timeStamp, type }: ContentProps) => {
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
                <Image src={avatarUrl} alt={username} width={32} height={32} className="rounded-full" />
                <div className="text-base font-semibold">{username}</div>
            </div>
            <div className="mt-2 text-base leading-5 whitespace-pre-line select-none">{content}</div>
            {images && images?.length > 0 && <EmblaCarousel slides={images} />}
            <div className="flex flex-row items-center justify-end mt-2 text-sm gap-x-2">
                <span className="opacity-20">{timeDifferent(timeStamp)}</span>
                {type && iconSVG && (
                    <div className="flex w-4 h-4 rounded-full opacity-100 place-items-center">{iconSVG}</div>
                )}
            </div>
        </div>
    );
};

export default ContentCard;
