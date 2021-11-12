import React from 'react';
import NFTBadges from '../../components/assets/NFTBadges';
import NFTItem from '../../components/assets/NFTItem';
import NFTDetail from '../../components/details/NFTDetail';

export default function nft() {
    return (
        <div className="flex flex-col max-w-screen-sm py-12 m-auto gap-y-4">
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
