import Etherscan from '../icons/Etherscan';
import Bscscan from '../icons/Bscscan';
import PolygonScan from '../icons/PolygonScan';

interface ScanTagProp {
    chain: 'Ethereum' | 'BSC' | 'Polygon';
}

export default function ScanTag({ chain }: ScanTagProp) {
    return (
        <div className="flex items-center justify-center px-2 py-1.5 text-center leading-none bg-white bg-contain bg-center bg-no-repeat border rounded border-primary border-opacity-40 bg-origin-content">
            {chain === 'Ethereum' && <Etherscan />}
            {chain === 'BSC' && <Bscscan />}
            {chain === 'Polygon' && <PolygonScan />}
        </div>
    );
}
