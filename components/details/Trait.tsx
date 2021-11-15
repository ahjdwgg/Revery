interface TraitProps {
    traitType: String;
    traitValue: String;
}

export default function Trait({ traitType, traitValue }: TraitProps) {
    return (
        <div className="flex flex-col items-start justify-center gap-1 px-5 py-3 leading-none rounded bg-nft-bg">
            <div className="text-xs font-normal uppercase text-nft">{traitType}</div>
            <div className="text-sm font-medium capitalize">{traitValue}</div>
        </div>
    );
}
