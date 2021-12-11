import NFTItem from './NFTItem';

interface NFTCardProps {
    name: string;
    desc: string;
    imageUrl: string;
    onClick: () => void;
}

const NFTCard = ({ name, desc, imageUrl, onClick }: NFTCardProps) => {
    return (
        <div
            className="flex flex-row justify-between pl-2 mt-2 ml-10 border-l-2 border-opacity-50 cursor-pointer select-none border-primary gap-x-4"
            onClick={() => onClick()}
        >
            <div className="flex flex-col justify-between gap-y-4">
                {name ? (
                    <div className="text-base font-semibold line-clamp-1">{name}</div>
                ) : (
                    <div className="text-base font-semibold line-clamp-1 opacity-20">
                        Oops, no detail found for this asset.
                    </div>
                )}
                {name || desc ? <p className="line-clamp-3">{desc}</p> : <p className="line-clamp-3 opacity-20">:(</p>}
            </div>
            <NFTItem previewUrl={imageUrl} isShowingDetails={false} size={84} />
        </div>
    );
};

export default NFTCard;
