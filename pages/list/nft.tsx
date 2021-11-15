import { NextPage } from 'next';
import { useState } from 'react';
import NFTBadges from '../../components/assets/NFTBadges';
import NFTItem from '../../components/assets/NFTItem';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleNFT from '../../components/details/SingleNFT';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Model from '../../components/Model';

const nft: NextPage = () => {
    const [modelHidden, setModelHidden] = useState(true);

    const openModel = () => {
        setModelHidden(false);
    };

    const closeModel = () => {
        setModelHidden(true);
    };

    return (
        <>
            <Header>
                <div className="flex flex-row justify-end w-full gap-x-8">
                    <Button isOutlined={false} color={COLORS.primary} text={'Create Now'} />
                    <ImageHolder imageUrl="https://i.imgur.com/GdWEt4z.jpg" isFullRound={true} size={28} />
                </div>
            </Header>
            <div className="max-w-6xl px-2 pt-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="flex flex-row justify-between w-full my-4">
                    <h1 className="text-lg font-bold text-left text-nft">Joshua's NFTs</h1>
                    <Button isOutlined={true} color={COLORS.nft} text={'Edit'} />
                </section>
                <section className="grid grid-cols-5 gap-4 py-4 justify-items-center">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="relative" onClick={openModel}>
                            <NFTItem size={208} previewUrl="https://i.imgur.com/GdWEt4z.jpg" detailUrl="" />
                            <NFTBadges
                                location="overlay"
                                chain="Ethereum"
                                collectionImg="https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5"
                            />
                        </div>
                    ))}
                </section>
            </div>
            <Model hidden={modelHidden} closeEvent={closeModel} theme={'nft'}>
                <SingleNFT />
            </Model>
        </>
    );
};

export default nft;
