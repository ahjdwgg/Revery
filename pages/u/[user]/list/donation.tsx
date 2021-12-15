import { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import DonationCard from '../../../../components/assets/DonationCard';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleDonation from '../../../../components/details/SingleDonation';
import Header from '../../../../components/Header';
import Modal from '../../../../components/modal/Modal';
import { GeneralAssetWithTags, GitcoinResponse } from '../../../../common/types';
import RSS3, { RSS3DetailPersona } from '../../../../common/rss3';
import { BiLoaderAlt } from 'react-icons/bi';
import ModalLoading from '../../../../components/modal/ModalLoading';
import config from '../../../../common/config';
import utils from '../../../../common/utils';
import { useRouter } from 'next/router';
import { AnyObject } from 'rss3/types/extend';
import DonationItemLoader from '../../../../components/loaders/DonationItemLoader';
const Donation: NextPage = () => {
    const router = useRouter();

    const [modalHidden, setModalHidden] = useState(true);
    const [listedDonation, setlistedDonation] = useState<AnyObject[]>([]);
    const [listedDonationIsEmpty, setListedDonationIsEmpty] = useState<boolean | null>(null);
    const [donation, setDonation] = useState<AnyObject | null>(null);
    const [persona, setPersona] = useState<RSS3DetailPersona>();

    const briefList = useRef<AnyObject[]>([]);
    const assetCount = useRef(0);
    const [isLoadingMore, setLoadingMore] = useState(false);

    const init = async () => {
        const addrOrName = (router.query.user as string) || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);

        const { donations } = await utils.initAssets();
        briefList.current = donations;
        let orderAsset = await loadDonations();
        setlistedDonation(orderAsset);

        if (orderAsset.length > 0) {
            setListedDonationIsEmpty(false);
        } else {
            setListedDonationIsEmpty(true);
        }

        setPersona(pageOwner);
    };

    const loadDonations = async () => {
        const detailList = await utils.loadAssets(briefList.current.slice(assetCount.current, assetCount.current + 30));
        assetCount.current += 30;
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
        setDonation(asset.detail);
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
                {!listedDonation.length && listedDonationIsEmpty === null ? (
                    // <div className="flex items-center justify-center w-full py-10">
                    //     <BiLoaderAlt className={'w-12 h-12 animate-spin text-primary opacity-20'} />
                    // </div>
                    <section className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-2">
                        {[...Array(10)].map((_, id) => (
                            <DonationItemLoader key={id} />
                        ))}
                    </section>
                ) : listedDonationIsEmpty ? (
                    <div className="flex items-center justify-center w-full py-10 text-normal">
                        {persona
                            ? persona.profile?.name + " hasn't made any donation :)"
                            : "You haven't made any donation :) "}
                    </div>
                ) : (
                    <section className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-2">
                        {listedDonation.map((asset, index) => (
                            <DonationCard
                                key={index}
                                imageUrl={asset.detail.grant.logo || config.undefinedImageAlt}
                                name={asset.detail.grant.title || 'Inactive Project'}
                                contribCount={asset.detail.txs.length || 0}
                                contribDetails={asset.detail.txs || []}
                                clickEvent={() => {
                                    openModal(asset);
                                }}
                            />
                        ))}
                        {assetCount.current < briefList.current.length && (
                            <div className="flex flex-row justify-center w-full py-4 col-span-full">
                                {isLoadingMore ? (
                                    <Button
                                        isOutlined={false}
                                        color={COLORS.primary}
                                        icon={'loading'}
                                        width={'w-32'}
                                        height={'h-8'}
                                    />
                                ) : (
                                    <Button
                                        isOutlined={false}
                                        color={COLORS.primary}
                                        text={'Load more'}
                                        width={'w-32'}
                                        height={'h-8'}
                                        onClick={async () => {
                                            setLoadingMore(true);
                                            let orderAsset = await loadDonations();
                                            setlistedDonation([...listedDonation, ...orderAsset]);
                                            setLoadingMore(false);
                                        }}
                                    />
                                )}
                            </div>
                        )}
                    </section>
                )}
            </div>
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} isCenter={false} size="lg">
                {donation ? <SingleDonation Gitcoin={donation} /> : <ModalLoading color={'primary'} />}
            </Modal>
        </>
    );
};

export default Donation;
