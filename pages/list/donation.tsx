import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import DonationCard from '../../components/assets/DonationCard';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleDonation from '../../components/details/SingleDonation';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Modal from '../../components/modal/Modal';
import { GeneralAsset, GeneralAssetWithTags, GitcoinResponse } from '../../common/types';
import RSS3, { IRSS3, RSS3DetailPersona } from '../../common/rss3';
import ModalLoading from '../../components/modal/ModalLoading';
import { RSS3Asset } from 'rss3-next/types/rss3';
import config from '../../common/config';
import utils from '../../common/utils';

const Donation: NextPage = () => {
    const [modalHidden, setModalHidden] = useState(true);
    const [listedDonation, setlistedDonation] = useState<GeneralAssetWithTags[]>([]);
    const [donation, setDonation] = useState<GitcoinResponse | null>(null);
    const [persona, setPersona] = useState<RSS3DetailPersona | undefined>(undefined);

    const init = async () => {
        // await RSS3.setPageOwner('RSS3 page owner address');
        const pageOwner = RSS3.getPageOwner();
        const apiUser = RSS3.apiUser();
        const generalAsset = await RSS3.getAssetProfile(pageOwner.address, 'Gitcoin-Donation');
        const rss3Asset = await (apiUser.persona as IRSS3).assets.get(pageOwner.address);
        let orderAsset = await loadDonations(rss3Asset, generalAsset?.assets);
        setlistedDonation(orderAsset);
        setPersona(pageOwner);
    };

    const loadDonations = async (assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[] | undefined) => {
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

        const GitcoinList: GeneralAssetWithTags[] = [];

        for (const am of assetsMerge) {
            if (am.type.includes('Gitcoin-Donation') && !am.tags?.includes('pass:hidden')) {
                GitcoinList.push(am);
            }
        }

        return utils.sortByOrderTag(GitcoinList) as GeneralAssetWithTags[];
    };

    useEffect(() => {
        init();
    }, []);

    const openModal = async (address: string, platform: string, identity: string, id: string) => {
        setModalHidden(false);
        setDonation(null);
        const res = await RSS3.getGitcoinDonation(address, platform, identity, id);
        setDonation(res);
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
                    <h1 className="text-lg font-bold text-left text-donation">
                        {persona ? persona.profile?.name + "'s Donations" : 'Donations'}
                    </h1>
                    <Button isOutlined={true} color={COLORS.donation} text={'Edit'} />
                </section>
                <section className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
                    {listedDonation.map((asset, index) => (
                        <DonationCard
                            key={index}
                            imageUrl={asset.info.image_preview_url || config.undefinedImageAlt}
                            name={asset.info.title || 'Inactive Project'}
                            contribCount={asset.info.total_contribs || 0}
                            contribDetails={asset.info.token_contribs || []}
                            clickEvent={() => {
                                openModal(persona?.address || '', 'EVM+', asset.identity, asset.id);
                            }}
                        />
                    ))}
                </section>
            </div>
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'gitcoin'} isFixed={donation === null}>
                {donation ? <SingleDonation Gitcoin={donation} /> : <ModalLoading color="donation" />}
            </Modal>
        </>
    );
};

export default Donation;
