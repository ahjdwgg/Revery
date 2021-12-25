import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import AccountCard from '../../../../components/accounts/AccountCard';
import Button from '../../../../components/buttons/Button';
import { COLORS } from '../../../../components/buttons/variables';
import SingleAccount from '../../../../components/details/SingleAccount';
import Header from '../../../../components/Header';
import Modal, { ModalColorStyle } from '../../../../components/modal/Modal';
import { BiLoaderAlt } from 'react-icons/bi';
import RSS3, { RSS3DetailPersona } from '../../../../common/rss3';
import { useRouter } from 'next/router';
import utils from '../../../../common/utils';
import { utils as RSS3Utils } from 'rss3';
import { stringify } from 'querystring';
import Events from '../../../../common/events';

interface ModalDetail {
    hidden: boolean;
    accountInfo?: { platform: string; identity: string };
}

const Account: NextPage = () => {
    const router = useRouter();

    const [listedAccounts, setListedAccounts] = useState<RSS3Account[]>([]);
    const [listedAccountsIsEmpty, setListedAccountsIsEmpty] = useState<boolean | null>(null);
    const [persona, setPersona] = useState<RSS3DetailPersona>();

    const [isOwner, setIsOwner] = useState(false);
    const [isShowingRedirectNotice, setIsShowingRedirectNotice] = useState(false);
    const [otherProductRedirectSettings, setOtherProductRedirectSettings] = useState<{
        product: string;
        type: string;
        route: string;
        baseUrl: string;
        colorStyle: ModalColorStyle;
    }>({
        product: '',
        type: '',
        route: '',
        baseUrl: '',
        colorStyle: 'primary',
    });

    const init = async () => {
        const addrOrName = (router.query.user as string) || '';
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        const { listed } = await utils.initAccounts();
        setListedAccounts(
            [
                {
                    id: `EVM+-${pageOwner.address}`,
                },
            ].concat(listed),
        );
        if (listed.length > 0) {
            setListedAccountsIsEmpty(false);
        } else {
            setListedAccountsIsEmpty(true);
        }
        setPersona(pageOwner);
        checkOwner();
    };

    const checkOwner = () => {
        const latestIsOwner = RSS3.isNowOwner();
        setIsOwner(latestIsOwner);
        return latestIsOwner;
    };

    const toRSS3BioEditAssetNotice = (type: string, route: string, colorStyle: ModalColorStyle) => {
        // to RSS3.Bio edit this
        const product = 'RSS3Bio';
        const loginUser = RSS3.getLoginUser();
        const baseUrl = RSS3.buildProductBaseURL(product, loginUser.address, loginUser.name);
        setOtherProductRedirectSettings({ product, type, route, baseUrl, colorStyle });
        setIsShowingRedirectNotice(true);
    };

    const toEditAssetRedirect = () => {
        // open new window
        setIsShowingRedirectNotice(false);
        window.open(`${otherProductRedirectSettings.baseUrl}${otherProductRedirectSettings.route}`, '_blank');
    };

    useEffect(() => {
        if (router.isReady) {
            init();
        }
    }, [router.isReady]);

    useEffect(() => {
        addEventListener(Events.connect, checkOwner);
        addEventListener(Events.disconnect, checkOwner);
    }, []);

    const [modal, setModal] = useState<ModalDetail>({
        hidden: true,
        accountInfo: { platform: '', identity: '' },
    });

    return (
        <>
            <Header />
            <div className="max-w-6xl px-2 pt-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="grid justify-between w-full my-4 grid-cols-listHeader">
                    <Button isOutlined={true} color={COLORS.primary} text={'Back'} onClick={() => router.back()} />
                    <h1 className="text-lg font-bold text-left text-primary">
                        {persona ? persona.profile?.name + "'s Accounts" : 'Accounts'}
                    </h1>
                    {isOwner && (
                        <Button
                            isOutlined={true}
                            color={COLORS.primary}
                            text={'Edit'}
                            onClick={() => toRSS3BioEditAssetNotice('Accounts', '/setup/accounts', 'primary')}
                        />
                    )}
                </section>
                {!listedAccounts.length && listedAccountsIsEmpty === null ? (
                    <div className="flex items-center justify-center w-full py-10">
                        <BiLoaderAlt className={'w-12 h-12 animate-spin text-primary opacity-50'} />
                    </div>
                ) : listedAccountsIsEmpty ? (
                    <div className="flex items-center justify-center w-full py-10 text-normal">
                        {persona ? persona.profile?.name + "'s Accounts list is empty :)" : 'Accounts list is empty :)'}
                    </div>
                ) : (
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
                )}
            </div>
            <Modal
                hidden={modal.hidden}
                theme={'primary'}
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

            <Modal
                theme={'primary'}
                size={'sm'}
                hidden={!isShowingRedirectNotice}
                closeEvent={() => setIsShowingRedirectNotice(false)}
            >
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className={`mx-2 text-xl text-${otherProductRedirectSettings.colorStyle}`}>Info</span>
                    </div>

                    <div className="flex justify-center">
                        <div className="inline px-12 pt-8 pb-12">
                            {`You will be redirect to`}
                            <span className="mx-2 text-primary">{otherProductRedirectSettings.product}</span>
                            {`to set up your`}
                            <span className={`mx-2 text-${otherProductRedirectSettings.colorStyle}`}>
                                {otherProductRedirectSettings.type}
                            </span>
                            {`.`}
                        </div>
                    </div>

                    <div className="flex justify-center gap-x-3">
                        <Button
                            isOutlined={true}
                            color={otherProductRedirectSettings.colorStyle}
                            text={'Cancel'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={() => setIsShowingRedirectNotice(false)}
                        />
                        <Button
                            isOutlined={false}
                            color={otherProductRedirectSettings.colorStyle}
                            text={'Go'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={toEditAssetRedirect}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Account;
