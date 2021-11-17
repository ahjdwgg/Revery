import { NextPage } from 'next';
import { useState } from 'react';
import DonationCard from '../../components/assets/DonationCard';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleDonation from '../../components/details/SingleDonation';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Modal from '../../components/modal/Modal';
import { GitcoinResponse } from '../../common/types';
import RSS3 from '../../common/rss3';
import ModalLoading from '../../components/modal/ModalLoading';

const Donation: NextPage = () => {
    const [modalHidden, setModalHidden] = useState(true);
    const [Gitcoin, setGitcoin] = useState<GitcoinResponse | null>(null);

    const openModal = async () => {
        setModalHidden(false);
        setGitcoin(null);
        const res = await RSS3.getGitcoinDonation(
            '0x55F110395C844963b075674e2956eb414018a7a7',
            '',
            '0x8c23B96f2fb77AaE1ac2832debEE30f09da7af3C',
            '0x7dac9fc15c1db4379d75a6e3f330ae849dffce18',
        );
        setGitcoin(res);
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
                {Gitcoin ? <SingleDonation Gitcoin={Gitcoin} /> : <ModalLoading color="donation" />}
            </Modal>
        </>
    );
};

export default Donation;
