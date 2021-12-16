/* eslint-disable @next/next/no-img-element */
import Arweave from '../icons/Arweave';
import Twitter from '../icons/Twitter';
import Mirror from '../icons/Mirror';
import Misskey from '../icons/Misskey';
import { timeDifferent } from '../../common/timeStamp';
import Markdown from '../Markdown';
import EmblaCarousel from './EmblaCarousel';
import config from '../../common/config';
import NFTCard from '../assets/NFTCard';
import { imgRegSrc, mdImgRegSrc } from '../../common/image';
import NFTIcon from '../icons/NFTIcon';
import FootprintIcon from '../icons/FootprintIcon';
import GitcoinIcon from '../icons/GitcoinIcon';

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

function categorize(field: string) {
    if (field.includes('Arweave')) {
        return (
            <>
                <span>posted on</span>
                <div className="flex items-center justify-center w-4 h-4 rounded-full">
                    <Arweave />
                </div>
            </>
        );
    } else if (field.includes('Twitter')) {
        return (
            <>
                <span>posted on</span>
                <div className="flex items-center justify-center w-4 h-4 rounded-full">
                    <Twitter />
                </div>
            </>
        );
    } else if (field.includes('Mirror.XYZ')) {
        return (
            <>
                <span>posted on</span>
                <div className="flex items-center justify-center w-4 h-4 rounded-full">
                    <Mirror />
                </div>
            </>
        );
    } else if (field.includes('Misskey')) {
        return (
            <>
                <span>posted on</span>
                <div className="flex items-center justify-center w-4 h-4 rounded-full">
                    <Misskey />
                </div>
            </>
        );
    } else if (field.includes('NFT')) {
        return <NFTIcon />;
    } else if (field.includes('POAP')) {
        return <FootprintIcon />;
    } else if (field.includes('Gitcoin')) {
        return <GitcoinIcon />;
    }
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
    let iconSVG = null;

    if (target.field) {
        iconSVG = categorize(target.field);
    }

    if (!images && content) {
        let { newStr, srcArr } =
            target.field.includes('Twitter') || target.field.includes('Misskey')
                ? imgRegSrc(content)
                : mdImgRegSrc(content);
        content = newStr;
        images = srcArr;
    }

    return (
        <div className="flex flex-col justify-start w-full py-2.5">
            <div className="flex flex-row items-center gap-x-2">
                <img
                    src={avatarUrl}
                    alt={username}
                    className="flex-shrink-0 w-8 h-8 rounded-full cursor-pointer"
                    onClick={() => {
                        toUserProfile();
                    }}
                />
                <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={() => toUserProfile()}>
                    <span className="text-base font-semibold">{username}</span>
                    {asset && <span>{getTopic(target.field, target.action.type)}</span>}
                    {iconSVG && <>{iconSVG}</>}
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
                    onClick={() => showAssetDetail()}
                />
            )}
        </div>
    );
};

export default ItemCard;
