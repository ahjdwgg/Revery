import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import DonationCard from '../../../../components/assets/DonationCard';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleDonation from '../../../../components/details/SingleDonation';
import Header from '../../../../components/Header';
import Modal from '../../../../components/modal/Modal';
import { GeneralAssetWithTags, GitcoinResponse } from '../../../../common/types';
import RSS3, { RSS3DetailPersona } from '../../../../common/rss3';
import ModalLoading from '../../../../components/modal/ModalLoading';
import config from '../../../../common/config';
import utils from '../../../../common/utils';
import { useRouter } from 'next/router';
import buffer from '../../../../common/buffer';
import { AnyObject } from 'rss3/types/extend';

const Donation: NextPage = () => {
    const router = useRouter();

    const [modalHidden, setModalHidden] = useState(true);
    const [listedDonation, setlistedDonation] = useState<AnyObject[]>([]);
    const [donation, setDonation] = useState<AnyObject | null>(null);
    const [persona, setPersona] = useState<RSS3DetailPersona>();

    const init = async () => {
        const addrOrName = (router.query.user as string) || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        let orderAsset = await loadDonations();
        setlistedDonation(orderAsset);
        setPersona(pageOwner);
    };

    const loadDonations = async () => {
        // const { listed } = await utils.initAssets('Gitcoin-Donation');
        // return listed;
        const { donations } = await utils.initAssets();
        return donations;
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
            // setDonation(undefined);
            setDonation(asset.detail);
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
                    <Button isOutlined={true} color={COLORS.primary} text={'Back'} onClick={() => router.back()} />
                    <h1 className="text-lg font-bold text-left text-primary">
                        {persona ? persona.profile?.name + "'s Donations" : 'Donations'}
                    </h1>
                    <Button isOutlined={true} color={COLORS.primary} text={'Edit'} />
                </section>
                <section className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-2">
                    {listedDonation.map((asset, index) => (
                        <DonationCard
                            key={index}
                            imageUrl={asset.detail.image_preview_url || config.undefinedImageAlt}
                            name={asset.detail.title || 'Inactive Project'}
                            contribCount={asset.detail.total_contribs || 0}
                            contribDetails={asset.detail.token_contribs || []}
                            clickEvent={() => {
                                openModal(asset.id);
                            }}
                        />
                    ))}
                </section>
            </div>
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} isCenter={false} size="lg">
                {donation ? <SingleDonation Gitcoin={donation} /> : <ModalLoading color="primary" />}
            </Modal>
        </>
    );
};

export default Donation;
