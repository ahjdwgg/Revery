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
import { imgRegSrc } from '../../common/image';

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
        ['add', 'Got one '],
        ['update', 'Transfer one '],
        ['delete', 'Remove one '],
    ]);

    let content = topic.get(type) || '';

    if (field.includes('NFT')) {
        content += 'NFT';
    } else if (field.includes('POAP')) {
        content += 'POAP';
    } else if (field.includes('Gitcoin')) {
        content += 'donation record';
    }

    return content;
};

const toExternalLink = (field: string, payload: string) => {
    if (field.includes('Twitter')) {
        window.open('https://twitter.com/' + field.split('-')[3] + '/status/' + payload);
    } else if (field.includes('Misskey')) {
        return window.open('https://nya.one/notes/8sufsk86r0' + payload);
    } else if (field.includes('Mirror-XYZ')) {
        console.log('coming soon');
    }
};

const toExternalLinkWithAsset = (field: string, eventUrl: string) => {
    if (field.includes('xDai.POAP') || field.includes('Gitcoin')) {
        window.open(eventUrl);
    } else if (field.includes('Polygon.NFT')) {
        window.open('https://polygonscan.com/token/' + field.split('-')[4].replaceAll('.', '?a='));
    } else if (field.includes('Ethereum.NFT')) {
        window.open('https://etherscan.io/token/' + field.split('-')[4].replaceAll('.', '?a='));
    }
};

const toExternalProfile = (field: string) => {
    if (field.includes('Twitter')) {
        window.open('https://twitter.com/' + field.split('-')[3]);
    } else if (field.includes('Misskey')) {
        window.open('https://nya.one/@' + field.split('-')[3].split('@')[0]);
    } else if (field.includes('Mirror-XYZ')) {
        console.log('coming soon');
    }
};

const ItemCard = ({ avatarUrl, username, title, content, images, asset, timeStamp, target }: ItemCardProps) => {
    let iconSVG = null;
    content = content?.replaceAll('">,<img', '"><img');

    if (target.field) {
        iconSVG = categorize(target.field);
    }

    if (!images && content) {
        images = imgRegSrc(content);
    }

    return (
        <div className="flex flex-col justify-start w-full py-2.5">
            <div className="flex flex-row items-center gap-x-2">
                <Image
                    src={avatarUrl || config.undefinedImageAlt}
                    alt={username}
                    width={32}
                    height={32}
                    className="rounded-full cursor-pointer"
                    onClick={() => toExternalProfile(target.field)}
                />
                <div
                    className="flex flex-row items-center gap-2 cursor-pointer"
                    onClick={() => toExternalProfile(target.field)}
                >
                    <span className="text-base font-semibold">{username}</span>
                    {asset && <span>{getTopic(target.field, target.action.type)}</span>}
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
                <div
                    className="pl-2 mt-2 ml-10 border-l-2 border-opacity-50 cursor-pointer border-primary"
                    onClick={() => {
                        toExternalLink(target.field, target.action.payload);
                    }}
                >
                    {title && <div className="text-base font-semibold">{title}</div>}
                    {content && <Markdown markdown={content} />}
                    {images && images?.length > 0 && <EmblaCarousel slides={images} />}
                </div>
            ) : (
                <NFTCard
                    name={asset.name}
                    desc={asset.description}
                    imageUrl={asset.image_url || config.undefinedImageAlt}
                    onClick={() => {
                        toExternalLinkWithAsset(target.field, asset.reference_url);
                    }}
                />
            )}
        </div>
    );
};

export default ItemCard;
