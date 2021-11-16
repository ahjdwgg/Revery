import NFTBadges from '../assets/NFTBadges';
import NFTItem from '../assets/NFTItem';
import NFTDetail from './NFTDetail';
import { NFT } from '../../common/types';

export default function SingleNFT() {
    const NFT: NFT = {
        chain: 'Ethereum',
        token_id: '11',
        name: 'Color #F5C',
        description: null,
        image_url:
            'https://lh3.googleusercontent.com/u0BvRqfOdKyhWf5qPvKgyeFBj4fMmbHuEWdsrkLkL-btQarEi5JL7401-bbF-Cx-awHRZTNROdrbmXp81hsQtJjZUFigHyBk8EnI4A',
        image_preview_url:
            'https://lh3.googleusercontent.com/u0BvRqfOdKyhWf5qPvKgyeFBj4fMmbHuEWdsrkLkL-btQarEi5JL7401-bbF-Cx-awHRZTNROdrbmXp81hsQtJjZUFigHyBk8EnI4A=s250',
        image_thumbnail_url:
            'https://lh3.googleusercontent.com/u0BvRqfOdKyhWf5qPvKgyeFBj4fMmbHuEWdsrkLkL-btQarEi5JL7401-bbF-Cx-awHRZTNROdrbmXp81hsQtJjZUFigHyBk8EnI4A=s128',
        animation_url: null,
        animation_original_url: null,
        asset_contract: {
            address: '0xe8227e29d61889dd04a4f0f87cf609936ad70d76',
            created_date: '2021-09-01T13:28:30.787744',
            symbol: 'Color',
        },
        collection: {
            name: 'ColorNFT',
            description: "What's your color",
            image_url:
                'https://lh3.googleusercontent.com/E4cIJD8YdieR14BMFBMmFTuHASCYdHCOxM59FXaYKf1BtlEJwtCjSXTAPBqHYMdQ3tpZzx9U83WlAhrT79Gq8cdrdCPvZztGaCRd=s120',
        },
        traits: [{ trait_type: 'HEX', value: 'F5C' }],
    };

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
