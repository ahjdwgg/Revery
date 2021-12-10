import NFTBadges from '../assets/NFTBadges';
import NFTItem from '../assets/NFTItem';
import NFTDetail from './NFTDetail';
import { NFT } from '../../common/types';
import { AnyObject } from 'rss3/types/extend';

export default function SingleNFT(props: { NFT: AnyObject }) {
    let { NFT } = props;

    return (
        <div className="flex flex-col max-w-screen-sm m-auto gap-y-4">
            <div className="relative flex flex-row items-center justify-between">
                <span className="flex-1 w-0 text-xl font-semibold text-left capitalize truncate text-primary">
                    {NFT.name}
                </span>
                <NFTBadges
                    location="header"
                    chain={NFT.chain.split('.')[0]}
                    collectionImg={NFT.collection?.image_url}
                />
            </div>
            <NFTItem
                size={640}
                previewUrl={NFT.animation_url || NFT.image_preview_url}
                detailUrl={NFT.animation_original_url || NFT.image_url}
                isShowingDetails={true}
            />
            <NFTDetail detail={NFT} market="opensea" />
        </div>
    );
}
