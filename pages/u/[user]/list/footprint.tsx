import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { GeneralAssetWithTags, POAPResponse } from '../../../../common/types';
import FootprintCard from '../../../../components/assets/FootprintCard';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleFootprint from '../../../../components/details/SingleFootprint';
import Header from '../../../../components/Header';
import Modal from '../../../../components/modal/Modal';
import RSS3, { RSS3DetailPersona } from '../../../../common/rss3';
import ModalLoading from '../../../../components/modal/ModalLoading';
import config from '../../../../common/config';
import utils from '../../../../common/utils';
import { useRouter } from 'next/router';
import buffer from '../../../../common/buffer';

const Footprint: NextPage = () => {
    const router = useRouter();

    const [modalHidden, setModalHidden] = useState(true);
    const [footprint, setFootprint] = useState<POAPResponse | null>(null);
    const [listedFootprint, setListedFootprint] = useState<GeneralAssetWithTags[]>([]);
    const [persona, setPersona] = useState<RSS3DetailPersona>();

    const init = async () => {
        const addrOrName = (router.query.user as string) || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        let orderAsset = await loadFootprints();
        setListedFootprint(orderAsset);
        setPersona(pageOwner);
    };

    const loadFootprints = async () => {
        const { listed } = await utils.initAssets('POAP');
        return listed;
    };

    useEffect(() => {
        if (router.isReady) {
            init();
        }
    }, [router.isReady]);

    const openModal = async (address: string, platform: string, identity: string, id: string) => {
        document.body.style.overflow = 'hidden';
        setModalHidden(false);
        if (!buffer.checkBuffer(address, platform, identity, id, 'xDai-POAP')) {
            setFootprint(null);
            const res = await RSS3.getFootprintDetail(address, platform, identity, id);
            buffer.updateBuffer(address, platform, identity, id, 'xDai-POAP');
            setFootprint(res);
        }
    };

    const closeModal = () => {
        document.body.style.overflow = '';
        setModalHidden(true);
    };

    return (
        <>
            <Header />
            <div className="max-w-6xl px-2 pt-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="flex flex-row justify-between w-full my-4">
                    <Button isOutlined={true} color={COLORS.footprint} text={'Back'} onClick={() => router.back()} />
                    <h1 className="text-lg font-bold text-left text-footprint">
                        {persona ? persona.profile?.name + "'s Footprint" : 'Footprints'}
                    </h1>
                    <Button isOutlined={true} color={COLORS.footprint} text={'Edit'} />
                </section>
                <section className="grid items-center justify-start grid-cols-2 gap-4 py-4">
                    {listedFootprint.map((asset, index) => (
                        <FootprintCard
                            key={index}
                            imageUrl={asset.info.image_preview_url || config.undefinedImageAlt}
                            startDate={asset.info.start_date}
                            endDate={asset.info.end_date}
                            city={asset.info.country}
                            country={asset.info.city}
                            username={persona?.profile?.name || ''}
                            activity={asset.info.title || ''}
                            clickEvent={() => {
                                openModal(persona?.address || '', 'EVM+', asset.identity, asset.id);
                            }}
                        />
                    ))}
                </section>
            </div>
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'footprint'} isCenter={false} size="lg">
                {footprint ? <SingleFootprint POAPInfo={footprint} /> : <ModalLoading color="footprint" />}
            </Modal>
        </>
    );
};

export default Footprint;
