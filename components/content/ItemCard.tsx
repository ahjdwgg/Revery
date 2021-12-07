import Image from 'next/image';
import Arweave from '../icons/Arweave';
import Twitter from '../icons/Twitter';
import Mirror from '../icons/Mirror';
import Misskey from '../icons/Misskey';
import { timeDifferent } from '../../common/timeStamp';
import { Markdown } from 'react-marked-renderer';
import EmblaCarousel from './EmblaCarousel';

interface ItemCardProps {
    avatarUrl: string;
    username: string;
    content: string;
    images?: string[];
    timeStamp: number;
    type?: string;
}

const ItemCard = ({ avatarUrl, username, content, images, timeStamp, type }: ItemCardProps) => {
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
            <div className="flex flex-row items-center gap-x-2">
                <Image src={avatarUrl} alt={username} width={32} height={32} className="rounded-full" />
                <div className="flex flex-row items-center gap-2">
                    <span className="text-base font-semibold">{username}</span>
                    {type && iconSVG && (
                        <>
                            <span>post on</span>
                            <div className="flex w-4 h-4 rounded-full opacity-100 place-items-center">{iconSVG}</div>
                        </>
                    )}
                    <span className="opacity-20">{timeDifferent(timeStamp)}</span>
                </div>
            </div>
            <div className="mt-2 ml-10 border-l-2 pl-2 border-opacity-50 border-primary select-none">
                <Markdown markdown={content} />
                {images && images?.length > 0 && <EmblaCarousel slides={images} />}
            </div>
        </div>
    );
};

export default ItemCard;
