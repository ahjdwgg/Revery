import { NextPage } from 'next';
import { useState } from 'react';
import NFTBadges from '../../components/assets/NFTBadges';
import NFTItem from '../../components/assets/NFTItem';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleNFT from '../../components/details/SingleNFT';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Modal from '../../components/modal/Modal';
import { NFT } from '../../common/types';
import RSS3 from '../../common/rss3';
import ModalLoading from '../../components/modal/ModalLoading';

const nft: NextPage = () => {
    const [modalHidden, setModalHidden] = useState(true);
    const [NFT, setNFT] = useState<NFT | undefined>(undefined);

    const openModal = async () => {
        setModalHidden(false);
        setNFT(undefined);
        const res = await RSS3.getNFTDetails(
            '0x55F110395C844963b075674e2956eb414018a7a7',
            '',
            '0x8c23B96f2fb77AaE1ac2832debEE30f09da7af3C',
            '0xe8227e29d61889dd04a4f0f87cf609936ad70d76-15',
            'Ethereum-NFT',
        );
        setNFT(res?.data);
    };

    const closeModal = () => {
        setModalHidden(true);
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
                <section className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="relative" onClick={openModal}>
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
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'nft'}>
                {NFT ? <SingleNFT NFT={NFT} /> : <ModalLoading color="nft" />}
            </Modal>
        </>
    );
};

export default nft;
