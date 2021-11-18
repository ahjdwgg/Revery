import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { RSS3Account } from 'rss3-next/types/rss3';
import AccountCard from '../../../../components/accounts/AccountCard';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleAccount from '../../../../components/details/SingleAccount';
import Header from '../../../../components/Header';
import Modal from '../../../../components/modal/Modal';
import RSS3, { IRSS3, RSS3DetailPersona } from '../../../../common/rss3';
import config from '../../../../common/config';
import { useRouter } from 'next/router';

interface ModalDetail {
    hidden: boolean;
    account?: RSS3Account;
}

const Account: NextPage = () => {
    const router = useRouter();

    const [listedAccounts, setListedAccounts] = useState<RSS3Account[]>([]);
    const [persona, setPersona] = useState<RSS3DetailPersona | undefined>(undefined);

    const init = async () => {
        const addrOrName = (router.query.user as string) || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        const apiUser = RSS3.getAPIUser();
        const allAccounts = await (apiUser.persona as IRSS3).accounts.get(pageOwner.address);
        const listed: RSS3Account[] = [];
        for (const account of allAccounts) {
            if (!account.tags?.includes(config.tags.hiddenTag)) {
                listed.push(account);
            }
        }
        setListedAccounts(listed);
        setPersona(pageOwner);
    };

    useEffect(() => {
        if (router.isReady) {
            init();
        }
    }, [router.isReady]);

    const [modal, setModal] = useState<ModalDetail>({
        hidden: true,
        account: undefined,
    });

    return (
        <>
            <Header />
            <div className="max-w-6xl px-2 pt-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="flex flex-row justify-between w-full my-4">
                    <h1 className="text-lg font-bold text-left text-account">
                        {persona ? persona.profile?.name + "'s Accounts" : 'Accounts'}
                    </h1>
                    <Button isOutlined={true} color={COLORS.account} text={'Edit'} />
                </section>
                <section className="grid items-center justify-start grid-cols-1 gap-4 py-4 md:grid-cols-2 gap-x-12">
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
                isCenter={true}
                size="md"
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

export default Account;
