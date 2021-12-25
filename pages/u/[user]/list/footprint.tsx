import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import FootprintCard from '../../../../components/assets/FootprintCard';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleFootprint from '../../../../components/details/SingleFootprint';
import Header from '../../../../components/Header';
import Modal, { ModalColorStyle } from '../../../../components/modal/Modal';
import RSS3, { RSS3DetailPersona } from '../../../../common/rss3';
import ModalLoading from '../../../../components/modal/ModalLoading';
import config from '../../../../common/config';
import utils from '../../../../common/utils';
import { useRouter } from 'next/router';
import { AnyObject } from 'rss3/types/extend';
import FootprintItemLoader from '../../../../components/loaders/FootprintItemLoader';
import LoadMoreButton from '../../../../components/buttons/LoadMoreButton';
import Events from '../../../../common/events';

const Footprint: NextPage = () => {
    const router = useRouter();

    const [modalHidden, setModalHidden] = useState(true);
    const [footprint, setFootprint] = useState<AnyObject>();
    const [listedFootprint, setListedFootprint] = useState<AnyObject[]>([]);
    const [listedFootprintIsEmpty, setListedFootprintEmpty] = useState<boolean | null>(null);
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

    const init = async () => {
        const addrOrName = (router.query.user as string) || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);

        const { footprints } = await utils.initAssets();
        briefList.current = footprints;
        let orderAsset = await loadFootprints();
        setListedFootprint(orderAsset);

        if (orderAsset.length > 0) {
            setListedFootprintEmpty(false);
        } else {
            setListedFootprintEmpty(true);
        }

        setPersona(pageOwner);
        checkOwner();
    };

    const loadFootprints = async () => {
        const detailList = await utils.loadAssets(
            briefList.current.slice(assetCount.current, assetCount.current + config.splitPageLimits.assets),
        );
        assetCount.current += config.splitPageLimits.assets;
        return detailList;
    };

    const loadMoreFootprints = async () => {
        setLoadingMore(true);
        let orderAsset = await loadFootprints();
        setListedFootprint([...listedFootprint, ...orderAsset]);
        setLoadingMore(false);
    };

    const checkOwner = () => {
        const latestIsOwner = RSS3.isNowOwner();
        setIsOwner(latestIsOwner);
        return latestIsOwner;
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
        setFootprint(asset.detail);
    };

    const closeModal = () => {
        document.body.style.overflow = '';
        setModalHidden(true);
    };

    return (
        <>
            <Header />
            <div className="max-w-6xl px-2 pt-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="grid justify-between w-full my-4 grid-cols-listHeader">
                    <Button isOutlined={true} color={COLORS.primary} text={'Back'} onClick={() => router.back()} />
                    <h1 className="text-lg font-bold text-left text-primary">
                        {persona ? persona.profile?.name + "'s Footprint" : 'Footprints'}
                    </h1>
                    {isOwner && (
                        <Button
                            isOutlined={true}
                            color={COLORS.primary}
                            text={'Edit'}
                            onClick={() => toRSS3BioEditAssetNotice('Footprints', '/setup/footprints', 'primary')}
                        />
                    )}
                </section>
                {!listedFootprint.length && listedFootprintIsEmpty === null ? (
                    // <div className="flex items-center justify-center w-full py-10">
                    //     <BiLoaderAlt className={'w-12 h-12 animate-spin text-primary opacity-20'} />
                    // </div>
                    <section className="grid items-center justify-start grid-cols-2 py-4 gap-x-4 gap-y-8">
                        {[...Array(10)].map((_, id) => (
                            <FootprintItemLoader key={id} />
                        ))}
                    </section>
                ) : listedFootprintIsEmpty ? (
                    <div className="flex items-center justify-center w-full py-10 text-normal">
                        {persona
                            ? persona.profile?.name + " hasn't got any footprint :)"
                            : "You haven't got any footprint :) "}
                    </div>
                ) : (
                    <>
                        <section className="grid items-center justify-start grid-cols-2 py-4 gap-x-4 gap-y-8">
                            {listedFootprint.map((asset, index) => (
                                <FootprintCard
                                    key={index}
                                    imageUrl={asset.detail.image_url || config.undefinedImageAlt}
                                    startDate={asset.detail.start_date}
                                    endDate={asset.detail.end_date}
                                    city={asset.detail.country}
                                    country={asset.detail.city}
                                    username={persona?.profile?.name || ''}
                                    activity={asset.detail.name || ''}
                                    clickEvent={() => {
                                        openModal(asset);
                                    }}
                                />
                            ))}
                            {assetCount.current < briefList.current.length && (
                                <LoadMoreButton
                                    color={COLORS.primary}
                                    width={'w-32'}
                                    height={'h-8'}
                                    isLoading={isLoadingMore}
                                    onClick={loadMoreFootprints}
                                >
                                    <section className="grid items-center justify-start w-full grid-cols-2 pb-8 gap-x-4 gap-y-8 col-span-full">
                                        {[...Array(6)].map((_, id) => (
                                            <FootprintItemLoader key={id} />
                                        ))}
                                    </section>
                                </LoadMoreButton>
                            )}
                        </section>
                    </>
                )}
            </div>
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} size="lg">
                {footprint ? <SingleFootprint POAPInfo={footprint} /> : <ModalLoading color={'primary'} />}
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

export default Footprint;
