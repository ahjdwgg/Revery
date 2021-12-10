import Etherscan from '../icons/Etherscan';
import Bscscan from '../icons/Bscscan';
import PolygonScan from '../icons/PolygonScan';

interface ScanTagProp {
    chain: 'Ethereum' | 'BSC' | 'Polygon';
    onClick?: (param?: any) => void;
}

export default function ScanTag({ chain, onClick }: ScanTagProp) {
    return (
        <div
            className="flex items-center justify-center px-2 py-1.5 text-center leading-none bg-primary-asset bg-contain bg-center bg-no-repeat border rounded border-primary-asset bg-origin-content cursor-pointer"
            onClick={onClick}
        >
            {chain === 'Ethereum' && <Etherscan />}
            {chain === 'BSC' && <Bscscan />}
            {chain === 'Polygon' && <PolygonScan />}
        </div>
    );
}
