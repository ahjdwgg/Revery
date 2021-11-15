import Opensea from '../icons/Opensea';
import Rarible from '../icons/Rarible';

interface MarketTagProp {
    market: 'opensea' | 'rarible';
}

export default function MarketTag({ market }: MarketTagProp) {
    return (
        <div className="flex items-center justify-center px-2 py-1.5 text-center leading-none bg-white bg-contain bg-center bg-no-repeat border rounded border-nft border-opacity-40 bg-origin-content">
            {market === 'opensea' && <Opensea />}
            {market === 'rarible' && <Rarible />}
        </div>
    );
}
