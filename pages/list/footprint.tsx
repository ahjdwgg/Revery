import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { GeneralAsset, GeneralAssetWithTags, POAPResponse } from '../../common/types';
import FootprintCard from '../../components/assets/FootprintCard';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleFootprint from '../../components/details/SingleFootprint';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Modal from '../../components/modal/Modal';
import RSS3, { IRSS3, RSS3DetailPersona } from '../../common/rss3';
import ModalLoading from '../../components/modal/ModalLoading';
import { RSS3Asset } from 'rss3-next/types/rss3';
import config from '../../common/config';
import utils from '../../common/utils';

const footprint: NextPage = () => {
    const [modalHidden, setModalHidden] = useState(true);
    const [footprint, setFootprint] = useState<POAPResponse | null>(null);
    const [listedFootprint, setListedFootprint] = useState<GeneralAssetWithTags[]>([]);
    const [persona, setPersona] = useState<RSS3DetailPersona | undefined>(undefined);

    const init = async () => {
        // await RSS3.setPageOwner('RSS3 page owner address');
        const pageOwner = RSS3.getPageOwner();
        const apiUser = RSS3.getAPIUser();
        const generalAsset = await RSS3.getAssetProfile(pageOwner.address, 'POAP');
        const rss3Asset = await (apiUser.persona as IRSS3).assets.get(pageOwner.address);
        let orderAsset = await loadFootprints(rss3Asset, generalAsset?.assets);
        setListedFootprint(orderAsset);
        setPersona(pageOwner);
    };

    const loadFootprints = async (assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[] | undefined) => {
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

        const FootprintList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type.includes('POAP')) {
                FootprintList.push(am);
            }
        }

        return utils.sortByOrderTag(FootprintList) as GeneralAssetWithTags[];
    };

    useEffect(() => {
        init();
    }, []);

    const openModal = async (address: string, platform: string, identity: string, id: string) => {
        setModalHidden(false);
        setFootprint(null);
        const res = await RSS3.getFootprintDetail(address, platform, identity, id);
        setFootprint(res);
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

export default footprint;
