import NFTBadges from '../assets/NFTBadges';
import NFTItem from '../assets/NFTItem';
import NFTDetail from './NFTDetail';

export default function SingleNFT() {
    return (
        <div className="flex flex-col max-w-screen-sm m-auto gap-y-4">
            <div className="relative flex flex-row items-center justify-between">
                <span className="flex-1 w-0 text-xl font-semibold text-left capitalize truncate text-nft">
                    Cool Cats NFT
                </span>
                <NFTBadges
                    location="header"
                    chain="Ethereum"
                    collectionImg="https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5"
                />
            </div>
            <NFTItem size={640} previewUrl="https://i.imgur.com/GdWEt4z.jpg" detailUrl="" />
            <NFTDetail />
        </div>
    );
}
