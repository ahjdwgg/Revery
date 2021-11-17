import NFTBadges from '../assets/NFTBadges';
import NFTItem from '../assets/NFTItem';
import NFTDetail from './NFTDetail';
import { NFT } from '../../common/types';

export default function SingleNFT(props: { NFT: NFT }) {
    let { NFT } = props;

    return (
        <div className="flex flex-col max-w-screen-sm m-auto gap-y-4">
            <div className="relative flex flex-row items-center justify-between">
                <span className="flex-1 w-0 text-xl font-semibold text-left capitalize truncate text-nft">
                    {NFT.name}
                </span>
                <NFTBadges location="header" chain={NFT.chain} collectionImg={NFT.collection?.image_url} />
            </div>
            <NFTItem size={640} previewUrl={NFT.image_preview_url} detailUrl={NFT.image_url} />
            <NFTDetail detail={NFT} market="opensea" />
        </div>
    );
}
