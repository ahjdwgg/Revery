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

const Donation: NextPage = () => {
    const router = useRouter();
    const addrOrName = (router.query.user as string) || '';

    const [modalHidden, setModalHidden] = useState(true);
    const [listedDonation, setlistedDonation] = useState<GeneralAssetWithTags[]>([]);
    const [donation, setDonation] = useState<GitcoinResponse | null>(null);
    const [persona, setPersona] = useState<RSS3DetailPersona | undefined>(undefined);

    const init = async () => {
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        let orderAsset = await loadDonations();
        setlistedDonation(orderAsset);
        setPersona(pageOwner);
    };

    const loadDonations = async () => {
        const { listed } = await utils.initAssets('Gitcoin-Donation');

        return listed;
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
            <Header />
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
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'gitcoin'} isCenter={false} size="lg">
                {donation ? <SingleDonation Gitcoin={donation} /> : <ModalLoading color="donation" />}
            </Modal>
        </>
    );
};

export default Donation;
