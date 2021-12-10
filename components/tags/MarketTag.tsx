import Opensea from '../icons/Opensea';
import Rarible from '../icons/Rarible';

interface MarketTagProp {
    market: 'opensea' | 'rarible';
    onClick?: (param?: any) => void;
}

export default function MarketTag({ market, onClick }: MarketTagProp) {
    return (
        <div
            className="flex items-center justify-center px-2 py-1.5 text-center leading-none bg-primary-asset bg-contain bg-center bg-no-repeat border rounded border-primary-asset bg-origin-content cursor-pointer"
            onClick={onClick}
        >
            {market === 'opensea' && <Opensea />}
            {market === 'rarible' && <Rarible />}
        </div>
    );
}
