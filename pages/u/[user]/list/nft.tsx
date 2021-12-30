import { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import NFTBadges from '../../../../components/assets/NFTBadges';
import NFTItem from '../../../../components/assets/NFTItem';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleNFT from '../../../../components/details/SingleNFT';
import Header from '../../../../components/Header';
import Modal, { ModalColorStyle } from '../../../../components/modal/Modal';
import RSS3, { RSS3DetailPersona } from '../../../../common/rss3';
import ModalLoading from '../../../../components/modal/ModalLoading';
import utils from '../../../../common/utils';
import { useRouter } from 'next/router';
import { AnyObject } from 'rss3/types/extend';
import NFTItemLoader from '../../../../components/loaders/NFTItemLoader';
import LoadMoreButton from '../../../../components/buttons/LoadMoreButton';
import config from '../../../../common/config';
import Events from '../../../../common/events';

const Nft: NextPage = () => {
    const router = useRouter();

    const [modalHidden, setModalHidden] = useState(true);
    const [NFT, setNFT] = useState<AnyObject>();
    const [listedNFT, setlistedNFT] = useState<AnyObject[]>([]);
    const [listedNFTIsEmpty, setListedNFTIsEmpty] = useState<boolean | null>(null);
    const [persona, setPersona] = useState<RSS3DetailPersona>();

    const briefList = useRef<AnyObject[]>([]);
    const assetCount = useRef(0);
    const [isLoadingMore, setLoadingMore] = useState(false);

    const [isOwner, setIsOwner] = useState(false);
    const [isShowingRedirectNotice, setIsShowingRedirectNotice] = useState(false);
    const [otherProductRedirectSettings, setOtherProductRedirectSettings] = useState<{
        product: string;
        type: string;
        route: string;
        baseUrl: string;
        colorStyle: ModalColorStyle;
    }>({
        product: '',
        type: '',
        route: '',
        baseUrl: '',
        colorStyle: 'primary',
    });

    const checkOwner = () => {
        const latestIsOwner = RSS3.isNowOwner();
        setIsOwner(latestIsOwner);
        return latestIsOwner;
    };

    const init = async () => {
        const addrOrName = (router.query.user as string) || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);

        const { nfts } = await utils.initAssets();
        briefList.current = nfts;
        let orderAsset = await loadNFTs();
        setlistedNFT(orderAsset);

        if (orderAsset.length > 0) {
            setListedNFTIsEmpty(false);
        } else {
            setListedNFTIsEmpty(true);
        }

        setPersona(pageOwner);
        checkOwner();
    };

    const loadNFTs = async () => {
        const detailList = await utils.loadAssets(
            briefList.current.slice(assetCount.current, assetCount.current + config.splitPageLimits.assets),
        );
        assetCount.current += config.splitPageLimits.assets;
        return detailList;
    };

    const loadMoreNFTs = async () => {
        setLoadingMore(true);
        let orderAsset = await loadNFTs();
        setlistedNFT([...listedNFT, ...orderAsset]);
        setLoadingMore(false);
    };

    const toRSS3BioEditAssetNotice = (type: string, route: string, colorStyle: ModalColorStyle) => {
        // to RSS3.Bio edit this
        const product = 'RSS3Bio';
        const loginUser = RSS3.getLoginUser();
        const baseUrl = RSS3.buildProductBaseURL(product, loginUser.address, loginUser.name);
        setOtherProductRedirectSettings({ product, type, route, baseUrl, colorStyle });
        setIsShowingRedirectNotice(true);
    };

    const toEditAssetRedirect = () => {
        // open new window
        setIsShowingRedirectNotice(false);
        window.open(`${otherProductRedirectSettings.baseUrl}${otherProductRedirectSettings.route}`, '_blank');
    };

    useEffect(() => {
        if (router.isReady) {
            init();
        }
    }, [router.isReady]);

    useEffect(() => {
        addEventListener(Events.connect, checkOwner);
        addEventListener(Events.disconnect, checkOwner);
    }, []);

    const openModal = async (asset: AnyObject) => {
        document.body.style.overflow = 'hidden';
        setModalHidden(false);
        setNFT(asset.detail);
    };

    const closeModal = () => {
        document.body.style.overflow = '';
        setNFT(undefined);
        setModalHidden(true);
    };

    return (
        <>
            <Header />
            <div className="max-w-6xl px-2 py-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="grid justify-between w-full my-4 grid-cols-listHeader">
                    <Button isOutlined={true} color={COLORS.primary} text={'Back'} onClick={() => router.back()} />
                    <h1 className="text-lg font-bold text-left text-primary">
                        {persona ? persona.profile?.name + "'s NFTs" : 'NFTs'}
                    </h1>
                    {isOwner && (
                        <Button
                            isOutlined={true}
                            color={COLORS.primary}
                            text={'Edit'}
                            onClick={() => toRSS3BioEditAssetNotice('NFTs', '/setup/nfts', 'primary')}
                        />
                    )}
                </section>
                {!listedNFT.length && listedNFTIsEmpty === null ? (
                    // <div className="flex items-center justify-center w-full py-10">
                    //     <BiLoaderAlt className={'w-12 h-12 animate-spin text-primary opacity-20'} />
                    // </div>
                    <section className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center">
                        {[...Array(20)].map((_, id) => (
                            <NFTItemLoader key={id} />
                        ))}
                    </section>
                ) : listedNFTIsEmpty ? (
                    <div className="flex items-center justify-center w-full py-10 text-normal">
                        {persona ? persona.profile?.name + " hasn't got any NFT :)" : "You haven't got any NFT :) "}
                    </div>
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
                                    previewUrl={
                                        asset.detail.image_preview_url ||
                                        asset.detail.image_url ||
                                        asset.detail.animation_url ||
                                        asset.animation_original_url
                                    }
                                    detailUrl={asset.detail.animation_url}
                                    isShowingDetails={false}
                                />
                                <NFTBadges
                                    location="overlay"
                                    chain={asset.detail.chain.split('.')[0]}
                                    collectionImg={asset.detail.collection?.image_url}
                                />
                            </div>
                        ))}
                        {assetCount.current < briefList.current.length && (
                            <LoadMoreButton
                                color={COLORS.primary}
                                width={'w-32'}
                                height={'h-8'}
                                isLoading={isLoadingMore}
                                onClick={loadMoreNFTs}
                            >
                                <section className="grid w-full grid-cols-2 gap-4 pb-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-items-center col-span-full">
                                    {[...Array(5)].map((_, id) => (
                                        <NFTItemLoader key={id} />
                                    ))}
                                </section>
                            </LoadMoreButton>
                        )}
                    </section>
                )}
            </div>

            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} size="lg">
                {NFT ? <SingleNFT NFT={NFT} /> : <ModalLoading color={'primary'} />}
            </Modal>

            <Modal
                theme={'primary'}
                size={'sm'}
                hidden={!isShowingRedirectNotice}
                closeEvent={() => setIsShowingRedirectNotice(false)}
            >
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className={`mx-2 text-xl text-${otherProductRedirectSettings.colorStyle}`}>Info</span>
                    </div>

                    <div className="flex justify-center">
                        <div className="inline px-12 pt-8 pb-12">
                            {`You will be redirect to`}
                            <span className="mx-2 text-primary">{otherProductRedirectSettings.product}</span>
                            {`to set up your`}
                            <span className={`mx-2 text-${otherProductRedirectSettings.colorStyle}`}>
                                {otherProductRedirectSettings.type}
                            </span>
                            {`.`}
                        </div>
                    </div>

                    <div className="flex justify-center gap-x-3">
                        <Button
                            isOutlined={true}
                            color={otherProductRedirectSettings.colorStyle}
                            text={'Cancel'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={() => setIsShowingRedirectNotice(false)}
                        />
                        <Button
                            isOutlined={false}
                            color={otherProductRedirectSettings.colorStyle}
                            text={'Go'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={toEditAssetRedirect}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Nft;
