interface TraitProps {
    traitType?: String | null;
    traitValue?: String | null;
}

export default function Trait({ traitType, traitValue }: TraitProps) {
    return (
        <div className="flex flex-col items-start justify-center gap-1 px-5 py-3 leading-none rounded bg-primary-bg">
            <div className="text-xs font-normal uppercase text-primary">{traitType}</div>
            <div className="text-sm font-medium capitalize break-all">{traitValue}</div>
        </div>
    );
}
