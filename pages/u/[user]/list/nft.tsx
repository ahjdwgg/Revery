import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import NFTBadges from '../../../../components/assets/NFTBadges';
import NFTItem from '../../../../components/assets/NFTItem';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleNFT from '../../../../components/details/SingleNFT';
import Header from '../../../../components/Header';
import Modal from '../../../../components/modal/Modal';
import { GeneralAssetWithTags, NFT } from '../../../../common/types';
import RSS3, { RSS3DetailPersona } from '../../../../common/rss3';
import ModalLoading from '../../../../components/modal/ModalLoading';
import utils from '../../../../common/utils';
import { useRouter } from 'next/router';

const Nft: NextPage = () => {
    const router = useRouter();
    const addrOrName = (router.query.user as string) || '';

    const [modalHidden, setModalHidden] = useState(true);
    const [NFT, setNFT] = useState<NFT | undefined>(undefined);
    const [listedNFT, setlistedNFT] = useState<GeneralAssetWithTags[]>([]);
    const [persona, setPersona] = useState<RSS3DetailPersona | undefined>(undefined);

    const init = async () => {
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        let orderAsset = await loadNFTs();
        setlistedNFT(orderAsset);
        setPersona(pageOwner);
    };

    const loadNFTs = async () => {
        const { listed } = await utils.initAssets('NFT');

        return listed;
    };

    useEffect(() => {
        init();
    }, []);

    const openModal = async (address: string, platform: string, identity: string, id: string, type: string) => {
        setModalHidden(false);
        setNFT(undefined);
        const res = await RSS3.getNFTDetails(address, platform, identity, id, type);
        console.log(res);
        setNFT(res?.data);
    };

    const closeModal = () => {
        setModalHidden(true);
    };

    return (
        <>
            <Header />
            <div className="max-w-6xl px-2 py-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="flex flex-row justify-between w-full my-4">
                    <h1 className="text-lg font-bold text-left text-nft">
                        {persona ? persona.profile?.name + "'s NFTs" : 'NFTs'}
                    </h1>
                    <Button isOutlined={true} color={COLORS.nft} text={'Edit'} />
                </section>
                <section className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center">
                    {listedNFT.map((asset, index) => (
                        <div
                            key={index}
                            className="relative cursor-pointer"
                            onClick={() => {
                                openModal(persona?.address || '', 'EVM+', asset.identity, asset.id, asset.type);
                            }}
                        >
                            <NFTItem
                                size={208}
                                previewUrl={asset.info.image_preview_url}
                                detailUrl={asset.info.animation_url}
                            />
                            <NFTBadges
                                location="overlay"
                                chain={asset.type.split('-')[0]}
                                collectionImg={asset.info.collection_icon}
                            />
                        </div>
                    ))}
                </section>
            </div>

            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'nft'} isCenter={false} size="lg">
                {NFT ? <SingleNFT NFT={NFT} /> : <ModalLoading color="nft" />}
            </Modal>
        </>
    );
};

export default Nft;
