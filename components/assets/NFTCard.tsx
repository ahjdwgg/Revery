import ImageHolder from '../ImageHolder';

interface NFTCardProps {
    name: string;
    desc: string;
    imageUrl: string;
}

const NFTCard = ({ name, desc, imageUrl }: NFTCardProps) => {
    return (
        <>
            <div className="mt-2 ml-10 border-l-2 pl-2 border-opacity-50 border-primary select-none flex flex-row justify-between gap-x-4">
                <div className="flex flex-col justify-between">
                    <div className="text-base font-semibold line-clamp-1">{name}</div>
                    <span className="line-clamp-3">{desc}</span>
                </div>
                <div className="flex-shrink">
                    <ImageHolder imageUrl={imageUrl} isFullRound={false} size={84} />
                </div>
            </div>
        </>
    );
};

export default NFTCard;
