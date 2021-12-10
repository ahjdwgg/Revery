import Image from 'next/image';
import Arweave from '../icons/Arweave';
import Twitter from '../icons/Twitter';
import Mirror from '../icons/Mirror';
import Misskey from '../icons/Misskey';
import { timeDifferent } from '../../common/timeStamp';
import { Markdown } from 'react-marked-renderer';
import EmblaCarousel from './EmblaCarousel';
import config from '../../common/config';
import NFTCard from '../assets/NFTCard';

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
        };
    };
}

function categorize(field: string) {
    if (field.includes('Arweave')) {
        return <Arweave />;
    } else if (field.includes('Twitter')) {
        return <Twitter />;
    } else if (field.includes('Mirror-XYZ')) {
        return <Mirror />;
    } else if (field.includes('Misskey')) {
        return <Misskey />;
    }
}

const getTopic = (field: string, type: string) => {
    const topic = new Map([
        ['add', 'Got an '],
        ['update', 'Transfer an '],
        ['delete', 'Remove an '],
    ]);

    let content = topic.get(type) || '';

    if (field.includes('NFT')) {
        content += 'NFT';
    } else if (field.includes('POAP')) {
        content += 'POAP';
    }

    return content;
};

const fixSchemas = (url: string) => {
    let fixedUrl = url;
    if (url.startsWith('ipfs://')) {
        fixedUrl = url.replace('ipfs://', 'https://infura-ipfs.io/ipfs/');
    }
    return fixedUrl;
};

const ItemCard = ({ avatarUrl, username, title, content, images, asset, timeStamp, target }: ItemCardProps) => {
    let iconSVG = null;

    if (target.field) {
        iconSVG = categorize(target.field);
    }

    return (
        <div className="flex flex-col justify-start w-full py-2.5">
            <div className="flex flex-row items-center gap-x-2">
                <Image
                    src={avatarUrl || config.undefinedImageAlt}
                    alt={username}
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <div className="flex flex-row items-center gap-2">
                    <span className="text-base font-semibold">{username}</span>
                    {iconSVG && (
                        <>
                            <span>post on</span>
                            <div className="flex w-4 h-4 rounded-full opacity-100 place-items-center">{iconSVG}</div>
                        </>
                    )}
                    <span className="opacity-20">{timeDifferent(timeStamp)}</span>
                </div>
            </div>
            {!asset ? (
                <div className="mt-2 ml-10 border-l-2 pl-2 border-opacity-50 border-primary select-none">
                    {title && <div className="text-base font-semibold">{title}</div>}
                    {content && <Markdown markdown={content} />}
                    {images && images?.length > 0 && <EmblaCarousel slides={images} />}
                </div>
            ) : (
                <NFTCard
                    name={asset.detail.name}
                    desc={asset.detail.description}
                    imageUrl={fixSchemas(
                        asset.detail.image_preview_url ||
                            asset.detail.image_url ||
                            asset.detail.image_thumbnail_url ||
                            asset.detail.animation_url ||
                            asset.detail.animation_original_url ||
                            config.undefinedImageAlt,
                    )}
                />
            )}
        </div>
    );
};

export default ItemCard;
