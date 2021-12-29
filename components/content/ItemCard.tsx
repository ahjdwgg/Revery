/* eslint-disable @next/next/no-img-element */
import Arweave from '../icons/Arweave';
import Twitter from '../icons/Twitter';
import Mirror from '../icons/Mirror';
import Misskey from '../icons/Misskey';
import { timeDifferent } from '../../common/timeStamp';
import Markdown from '../Markdown';
import EmblaCarousel from './EmblaCarousel';
import config from '../../common/config';
import AssetDetailsCard from '../assets/AssetDetailsCard';
import { imgRegSrc, mdImgRegSrc } from '../../common/image';
import NFTIcon from '../icons/NFTIcon';
import FootprintIcon from '../icons/FootprintIcon';
import GitcoinIcon from '../icons/GitcoinIcon';
import ImageHolder from '../ImageHolder';
import React from 'react';

interface ItemCardProps {
    avatarUrl: string;
    username: string;
    title?: string;
    content?: string;
    images?: string[];
    asset: any;
    timeStamp: number;
    target: {
        field: string;
        action: {
            type: string;
            payload: string;
        };
    };
    toUserProfile: () => void;
    showAssetDetail: () => void;
}

const getTopic = (field: string, type: string) => {
    const topic = new Map([
        ['add', 'got '],
        ['update', 'transferred '],
        ['delete', 'removed '],
    ]);

    let content = topic.get(type) || '';

    if (field.includes('NFT')) {
        content += 'an NFT';
    } else if (field.includes('POAP')) {
        content += 'a footprint';
    } else if (field.includes('Gitcoin')) {
        content = content.replace('got', 'made');
        content += 'a donation';
    }

    return content;
};

const categorize = (field: string, type: string) => {
    let iconSVG = null;
    let topic = 'posted on';

    if (field.includes('NFT')) {
        topic = getTopic(field, type);
        iconSVG = <NFTIcon />;
    } else if (field.includes('POAP')) {
        topic = getTopic(field, type);
        iconSVG = <FootprintIcon />;
    } else if (field.includes('Gitcoin')) {
        topic = getTopic(field, type);
        iconSVG = <GitcoinIcon />;
    } else if (field.includes('Arweave')) {
        iconSVG = <Arweave />;
    } else if (field.includes('Twitter')) {
        iconSVG = <Twitter />;
    } else if (field.includes('Mirror.XYZ')) {
        iconSVG = <Mirror />;
    } else if (field.includes('Misskey')) {
        iconSVG = <Misskey />;
    }

    return (
        <>
            <span className="flex-shrink-0">{topic}</span>
            <div className="flex items-center justify-center w-4 h-4 rounded-full">{iconSVG}</div>
        </>
    );
};

const toExternalLink = (field: string, payload: string) => {
    if (field.includes('Mirror.XYZ')) {
        window.open(payload);
    } else {
        const fields = field.split('-');
        const dic: { [key: string]: () => void } = {
            Twitter: () => window.open('https://twitter.com/' + field.split('-')[3] + '/status/' + payload),
            Misskey: () => window.open(`https://${fields[3].split('@')[1]}/notes/` + payload),
        };
        dic[fields[2]]?.call('');
    }
};

const ItemCard = ({
    avatarUrl,
    username,
    title,
    content,
    images,
    asset,
    timeStamp,
    target,
    toUserProfile,
    showAssetDetail,
}: ItemCardProps) => {
    if (!images && content) {
        let { newStr, srcArr } =
            target.field.includes('Twitter') || target.field.includes('Misskey')
                ? imgRegSrc(content)
                : mdImgRegSrc(content);
        content = newStr;
        images = srcArr;
    }

    return (
        <div className="flex flex-col justify-start w-full py-2.5 bg-white transition-all duration-100 ease-in-out">
            <div className="flex flex-row items-center gap-x-2">
                <ImageHolder
                    imageUrl={avatarUrl}
                    title={username}
                    roundedClassName={'rounded-full cursor-pointer'}
                    size={32}
                    onClick={toUserProfile}
                />
                <div className="flex flex-row items-center gap-2 cursor-pointer">
                    <span className="text-base font-semibold flex-shrink-0">{username}</span>
                    {categorize(target.field, target.action.type)}
                    <span className="opacity-20 truncate">{timeDifferent(timeStamp)}</span>
                </div>
            </div>
            {!asset ? (
                <div
                    className="pl-2 mt-2 ml-10 border-l-2 hover:border-opacity-50 cursor-pointer hover:border-primary border-primary-asset"
                    onClick={() => {
                        toExternalLink(target.field, target.action.payload);
                    }}
                >
                    {title && <div className="text-base font-semibold">{title}</div>}
                    {content && <Markdown markdown={content} />}
                    {images && images?.length > 0 && <EmblaCarousel slides={images} />}
                </div>
            ) : (
                <AssetDetailsCard
                    name={asset.name}
                    desc={asset.description}
                    imageUrl={asset.image_url || config.undefinedImageAlt}
                    onClick={showAssetDetail}
                />
            )}
        </div>
    );
};

export default ItemCard;
