import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import NFTBadges from '../../../../components/assets/NFTBadges';
import NFTItem from '../../../../components/assets/NFTItem';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleNFT from '../../../../components/details/SingleNFT';
import Header from '../../../../components/Header';
import Modal from '../../../../components/modal/Modal';
import { BiLoaderAlt } from 'react-icons/bi';
import { GeneralAssetWithTags, NFT } from '../../../../common/types';
import RSS3, { RSS3DetailPersona } from '../../../../common/rss3';
import ModalLoading from '../../../../components/modal/ModalLoading';
import utils from '../../../../common/utils';
import { useRouter } from 'next/router';
import buffer from '../../../../common/buffer';
import { AnyObject } from 'rss3/types/extend';

const Nft: NextPage = () => {
    const router = useRouter();

    const [modalHidden, setModalHidden] = useState(true);
    const [NFT, setNFT] = useState<AnyObject>();
    const [listedNFT, setlistedNFT] = useState<AnyObject[]>([]);
    const [listedNFTIsEmpty, setListedNFTIsEmpty] = useState<boolean | null>(null);
    const [persona, setPersona] = useState<RSS3DetailPersona>();

    const init = async () => {
        const addrOrName = (router.query.user as string) || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        let orderAsset = await loadNFTs();
        setlistedNFT(orderAsset);
        if (orderAsset.length > 0) {
            setListedNFTIsEmpty(false);
        } else {
            setListedNFTIsEmpty(true);
        }
        setPersona(pageOwner);
    };

    const loadNFTs = async () => {
        // const { listed } = await utils.initAssets('NFT');
        // return listed;
        const { nfts } = await utils.initAssets();
        const detailList = await utils.loadAssets(nfts);
        return detailList;
    };

    useEffect(() => {
        if (router.isReady) {
            init();
        }
    }, [router.isReady]);

    const openModal = async (asset: AnyObject) => {
        document.body.style.overflow = 'hidden';
        setModalHidden(false);
        if (!buffer.checkBuffer(asset.id)) {
            setNFT(undefined);
            setNFT(asset.detail);
        }
    };

    const closeModal = () => {
        document.body.style.overflow = '';
        setModalHidden(true);
    };

    return (
        <>
            <Header />
            <div className="max-w-6xl px-2 py-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="flex flex-row justify-between w-full my-4">
                    <Button isOutlined={true} color={COLORS.primary} text={'Back'} onClick={() => router.back()} />
                    <h1 className="text-lg font-bold text-left text-primary">
                        {persona ? persona.profile?.name + "'s NFTs" : 'NFTs'}
                    </h1>
                    <Button isOutlined={true} color={COLORS.primary} text={'Edit'} />
                </section>
                {!listedNFT.length && listedNFTIsEmpty === null ? (
                    <div className="flex w-full justify-center items-center py-10">
                        <BiLoaderAlt className={'w-12 h-12 animate-spin text-primary opacity-50'} />
                    </div>
                ) : listedNFTIsEmpty ? (
                    <div className="flex w-full justify-center items-center py-10 text-normal">NFTs list is empty.</div>
                ) : (
                    <section className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center">
                        {listedNFT.map((asset, index) => (
                            <div
                                key={index}
                                className="relative cursor-pointer"
                                onClick={() => {
                                    openModal(asset);
                                }}
                            >
                                <NFTItem
                                    size={208}
                                    previewUrl={asset.detail.image_preview_url}
                                    detailUrl={asset.detail.animation_url}
                                    isShowingDetails={false}
                                />
                                <NFTBadges
                                    location="overlay"
                                    chain={asset.detail.chain.split('.')[0]}
                                    collectionImg={asset.detail.collection_icon}
                                />
                            </div>
                        ))}
                    </section>
                )}
            </div>

            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} isCenter={false} size="lg">
                {NFT ? <SingleNFT NFT={NFT} /> : <ModalLoading color="primary" />}
            </Modal>
        </>
    );
};

export default Nft;
