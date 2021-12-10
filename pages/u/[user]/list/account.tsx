import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { RSS3Account } from '../../../../common/rss3Types';
import AccountCard from '../../../../components/accounts/AccountCard';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleAccount from '../../../../components/details/SingleAccount';
import Header from '../../../../components/Header';
import Modal from '../../../../components/modal/Modal';
import RSS3, { RSS3DetailPersona } from '../../../../common/rss3';
import { useRouter } from 'next/router';
import utils from '../../../../common/utils';
import { utils as RSS3Utils } from 'rss3';
import { stringify } from 'querystring';

interface ModalDetail {
    hidden: boolean;
    accountInfo?: { platform: string; identity: string };
}

const Account: NextPage = () => {
    const router = useRouter();

    const [listedAccounts, setListedAccounts] = useState<RSS3Account[]>([]);
    const [persona, setPersona] = useState<RSS3DetailPersona>();

    const init = async () => {
        const addrOrName = (router.query.user as string) || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        const { listed } = await utils.initAccounts();
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
        accountInfo: { platform: '', identity: '' },
    });

    return (
        <>
            <Header />
            <div className="max-w-6xl px-2 pt-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="flex flex-row justify-between w-full my-4">
                    <Button isOutlined={true} color={COLORS.primary} text={'Back'} onClick={() => router.back()} />
                    <h1 className="text-lg font-bold text-left text-primary">
                        {persona ? persona.profile?.name + "'s Accounts" : 'Accounts'}
                    </h1>
                    <Button isOutlined={true} color={COLORS.primary} text={'Edit'} />
                </section>
                <section className="grid items-center justify-start grid-cols-1 gap-4 py-4 md:grid-cols-2 gap-x-12">
                    {listedAccounts.map((account, index) => {
                        let accountInfo = RSS3Utils.id.parseAccount(account.id);
                        return (
                            <AccountCard
                                key={index}
                                chain={accountInfo.platform}
                                address={accountInfo.identity}
                                clickEvent={() => {
                                    document.body.style.overflow = 'hidden';
                                    setModal({
                                        hidden: false,
                                        accountInfo: accountInfo,
                                    });
                                }}
                            />
                        );
                    })}
                </section>
            </div>
            <Modal
                hidden={modal.hidden}
                theme={'primary'}
                isCenter={true}
                size="md"
                closeEvent={() => {
                    document.body.style.overflow = '';
                    setModal({
                        hidden: true,
                    });
                }}
            >
                <SingleAccount chain={modal.accountInfo?.platform} address={modal.accountInfo?.identity} />
            </Modal>
        </>
    );
};

export default Account;
