import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import NFTBadges from '../../components/assets/NFTBadges';
import NFTItem from '../../components/assets/NFTItem';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleNFT from '../../components/details/SingleNFT';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Modal from '../../components/modal/Modal';
import { GeneralAsset, GeneralAssetWithTags, NFT } from '../../common/types';
import RSS3, { IAssetProfile, IRSS3, RSS3DetailPersona } from '../../common/rss3';
import ModalLoading from '../../components/modal/ModalLoading';
import { RSS3Asset } from 'rss3-next/types/rss3';
import config from '../../common/config';
import utils from '../../common/utils';

const nft: NextPage = () => {
    const [modalHidden, setModalHidden] = useState(true);
    const [NFT, setNFT] = useState<NFT | undefined>(undefined);
    const [listedNFT, setlistedNFT] = useState<GeneralAssetWithTags[]>([]);
    const [persona, setPersona] = useState<RSS3DetailPersona | undefined>(undefined);

    const init = async () => {
        // await RSS3.setPageOwner('RSS3 page owner address');
        const pageOwner = RSS3.getPageOwner();
        const apiUser = RSS3.apiUser();
        const generalAsset = await RSS3.getAssetProfile(pageOwner.address, 'NFT');
        const rss3Asset = await (apiUser.persona as IRSS3).assets.get(pageOwner.address);
        let orderAsset = await loadNFTs(rss3Asset, generalAsset?.assets);
        setlistedNFT(orderAsset);
        setPersona(pageOwner);
    };

    const loadNFTs = async (assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[] | undefined) => {
        const assetsMerge: GeneralAssetWithTags[] = await Promise.all(
            (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
                const origType = ag.type;
                if (config.hideUnlistedAsstes) {
                    ag.type = 'Invalid'; // Using as a match mark
                }
                for (const airf of assetsInRSS3File) {
                    if (
                        airf.platform === ag.platform &&
                        airf.identity === ag.identity &&
                        airf.id === ag.id &&
                        airf.type === origType
                    ) {
                        // Matched
                        ag.type = origType; // Recover type
                        if (airf.tags) {
                            ag.tags = airf.tags;
                        }
                        break;
                    }
                }
                return ag;
            }),
        );

        const NFTList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type.includes('NFT')) {
                NFTList.push(am);
            }
        }

        return utils.sortByOrderTag(NFTList) as GeneralAssetWithTags[];
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
            <Header>
                <div className="flex flex-row justify-end w-full gap-x-8">
                    <Button isOutlined={false} color={COLORS.primary} text={'Create Now'} />
                    <ImageHolder imageUrl="https://i.imgur.com/GdWEt4z.jpg" isFullRound={true} size={28} />
                </div>
            </Header>
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

            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'nft'} isFixed={NFT === undefined}>
                {NFT ? <SingleNFT NFT={NFT} /> : <ModalLoading color="nft" />}
            </Modal>
        </>
    );
};

export default nft;
