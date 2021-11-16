import { NextPage } from 'next';
import { useState } from 'react';
import { RSS3Account } from 'rss3-next/types/rss3';
import AccountCard from '../../components/accounts/AccountCard';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleAccount from '../../components/details/SingleAccount';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Modal from '../../components/Modal';

interface ModalDetail {
    hidden: boolean;
    account?: RSS3Account;
}

const account: NextPage = () => {
    const [listedAccounts, setListedAccounts] = useState<RSS3Account[]>([
        {
            platform: 'Misskey',
            identity: 'Candinya@nya.one',
            tags: ['pass:order:0'],
        },
        {
            platform: 'Twitter',
            identity: 'CandiiRua',
            tags: ['pass:order:1'],
        },
    ]);

    const [modal, setModal] = useState<ModalDetail>({
        hidden: true,
        account: undefined,
    });

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
                    <h1 className="text-lg font-bold text-left text-account">Joshua's NFTs</h1>
                    <Button isOutlined={true} color={COLORS.account} text={'Edit'} />
                </section>
                <section className="grid items-center justify-start grid-cols-2 gap-4 py-4 gap-x-12">
                    {listedAccounts.map((account, index) => (
                        <AccountCard
                            key={index}
                            chain={account.platform}
                            address={account.identity}
                            clickEvent={() => {
                                setModal({
                                    hidden: false,
                                    account: account,
                                });
                            }}
                        />
                    ))}
                </section>
            </div>
            <Modal
                hidden={modal.hidden}
                theme={'account'}
                closeEvent={() => {
                    setModal({
                        hidden: true,
                    });
                }}
            >
                <SingleAccount chain={modal.account?.platform} address={modal.account?.identity} />
            </Modal>
        </>
    );
};

export default account;
