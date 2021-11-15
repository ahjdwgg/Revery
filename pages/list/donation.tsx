import { NextPage } from 'next';
import { useState } from 'react';
import DonationCard from '../../components/assets/DonationCard';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleDonation from '../../components/details/SingleDonation';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Modal from '../../components/Modal';

const Donation: NextPage = () => {
    const [modalHidden, setModalHidden] = useState(true);

    const openModal = () => {
        setModalHidden(false);
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
                    <h1 className="text-lg font-bold text-left text-donation">Joshua's Donations</h1>
                    <Button isOutlined={true} color={COLORS.donation} text={'Edit'} />
                </section>
                <section className="grid grid-cols-2 gap-4 py-4">
                    {[...Array(7)].map((_, i) => (
                        <DonationCard
                            key={i}
                            imageUrl="https://c.gitcoin.co/grants/546622657b597ce151666ed2e2ecbd92/rss3_square_blue.png"
                            name="RSS3 - RSS with human curation"
                            contribCount={1}
                            contribDetails={[
                                {
                                    token: 'ETH',
                                    amount: 0.1,
                                },
                            ]}
                            clickEvent={openModal}
                        />
                    ))}
                </section>
            </div>
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'gitcoin'}>
                <SingleDonation />
            </Modal>
        </>
    );
};

export default Donation;
