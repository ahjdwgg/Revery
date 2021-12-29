import NFTItem from './NFTItem';

interface AssetDetailsCardProps {
    name: string;
    desc: string;
    imageUrl: string;
    onClick: () => void;
}

const AssetDetailsCard = ({ name, desc, imageUrl, onClick }: AssetDetailsCardProps) => {
    return (
        <div
            className="flex flex-row justify-between pl-2 mt-2 ml-10 border-l-2 hover:border-opacity-50 cursor-pointer select-none hover:border-primary gap-x-4 border-primary-asset"
            onClick={onClick}
        >
            {name || desc ? (
                <div className="flex flex-col justify-between flex-1 w-0 gap-y-4">
                    <div className="text-base font-semibold line-clamp-1">{name || ''}</div>
                    <p className="line-clamp-3">{desc && typeof desc === 'object' ? JSON.stringify(desc) : desc}</p>
                </div>
            ) : (
                <div className="flex flex-col justify-between flex-1 w-0 gap-y-4">
                    <div className="text-base font-semibold line-clamp-1 opacity-20">Oops, no detail found.</div>
                    <p className="line-clamp-3 opacity-20">:(</p>
                </div>
            )}
            <NFTItem previewUrl={imageUrl} isShowingDetails={false} size={84} />
        </div>
    );
};

export default AssetDetailsCard;
