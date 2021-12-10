import NFTItem from './NFTItem';

interface NFTCardProps {
    info: string;
    name: string;
    desc: string;
    imageUrl: string;
    onClick: () => void;
}

const NFTCard = ({ info, name, desc, imageUrl, onClick }: NFTCardProps) => {
    return (
        <section className="cursor-pointer" onClick={() => onClick()}>
            <span className="mt-2 ml-10 text-base font-semibold">{info}</span>
            <div className="mt-2 ml-10 border-l-2 pl-2 border-opacity-50 border-primary select-none flex flex-row justify-between gap-x-4">
                <div className="flex flex-col justify-between">
                    {name ? (
                        <div className="text-base font-semibold line-clamp-1">{name}</div>
                    ) : (
                        <div className="text-base font-semibold line-clamp-1 opacity-20">
                            Oops, no detail found for this NFT.
                        </div>
                    )}
                    {name || desc ? (
                        <span className="line-clamp-3">{desc}</span>
                    ) : (
                        <span className="line-clamp-3 opacity-20">:(</span>
                    )}
                </div>
                <NFTItem previewUrl={imageUrl} isShowingDetails={false} size={84} />
            </div>
        </section>
    );
};

export default NFTCard;
