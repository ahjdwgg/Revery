import { NextPage } from 'next';
import NFTBadges from '../../components/assets/NFTBadges';
import NFTItem from '../../components/assets/NFTItem';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';

const nft: NextPage = () => {
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
                        <div key={i} className="relative">
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
        </>
    );
};

export default nft;
