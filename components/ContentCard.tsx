import React from 'react';
import Image from 'next/image';
import EmblaCarousel from '../components/EmblaCarousel';
import { BiHeart, BiMessage, BiShare } from 'react-icons/bi';

interface ContentProps {
    avatarUrl: string;
    username: string;
    content: string;
    images?: string[];
    like?: number;
    comment?: number;
    share?: number;
}

const ContentCard = ({ avatarUrl, username, content, images, like=0, comment=0, share=0 }: ContentProps) => {
    return (
        <div className="flex flex-col justify-start w-full my-2">
            <div className="flex flex-row items-center gap-x-3">
                <Image src={avatarUrl} alt="Avator" width={32} height={32} className="rounded-full" />
                <div className="text-sm font-semibold">{username}</div>
            </div>
            <div className="mt-2 leading-5 whitespace-pre-line">{content}</div>
            {images && images?.length > 0 && <EmblaCarousel slides={images} />}
            <section className="flex flex-row justify-between mt-2 opacity-20">
                <div className="flex flex-row gap-x-2.5">
                    <div className="flex flex-row items-center mr-1">
                        <BiHeart />
                        <span>{like}</span>
                    </div>
                    <div className="flex flex-row items-center mr-1">
                        <BiMessage />
                        <span>{comment}</span>
                    </div>
                    <div className="flex flex-row items-center mr-1">
                        <BiShare />
                        <span>{share}</span>
                    </div>
                </div>
                <span>2 hours ago</span>
            </section>
        </div>
    );
};

export default ContentCard;
