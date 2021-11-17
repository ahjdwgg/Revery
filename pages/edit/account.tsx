import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import AssetCard from '../../components/assets/AssetCard';
import Button from '../../components/buttons/Button';
import { ReactSortable } from 'react-sortablejs';
import { RSS3Account } from 'rss3-next/types/rss3';
import EVMpAccountItem from '../../components/accounts/EVMpAccountItem';
import AccountItem from '../../components/accounts/AccountItem';
import config from '../../common/config';
import RSS3, { IRSS3 } from '../../common/rss3';
import utils from '../../common/utils';
import ContentProviders from '../../common/content-providers';
import Modal from '../../components/Modal';
import Input from '../../components/inputs/Input';
import { BiCheckCircle, BiInfoCircle, BiPaste } from 'react-icons/bi';

interface RSS3AccountWithID {
    id: string; // For ReactSortable only
    account: RSS3Account;
}

interface SpecifyNoSignAccount {
    platform: string;
    accountStyle: string;
    availableFields: string[];
    prefix: string;
    suffix: string;
}

const AdditionalNoSignAccounts = ['Misskey', 'Twitter'];

const Account = () => {
    const ModeTypes = {
        default: 'default',
        add: 'add',
        delete: 'delete',
    };

    const [listedAccounts, setListedAccounts] = useState<RSS3AccountWithID[]>([]);
    const [unlistedAccounts, setUnlistedAccounts] = useState<RSS3AccountWithID[]>([]);
    const [mode, setMode] = useState(ModeTypes.default);
    const [isLoading, setIsLoading] = useState(false);
    const [notice, setNotice] = useState('');
    const [isShowingNotice, setIsShowingNotice] = useState(false);
    const [isAddingNoSignAccount, setIsAddingNoSignAccount] = useState(false);
    const [isCopyingName, setIsCopyingName] = useState(false);

    const toAddAccounts: RSS3AccountWithID[] = [];
    const toDeleteAccounts: RSS3AccountWithID[] = [];

    const [noSignAccountIdentity, setNoSignAccountIdentity] = useState('');
    const [noSignAccountProviderInfo, setNoSignAccountProviderInfo] = useState<SpecifyNoSignAccount>({
        platform: '',
        accountStyle: '',
        availableFields: [],
        prefix: '',
        suffix: '',
    });

    const unlistAll = () => {
        setUnlistedAccounts(unlistedAccounts.concat(listedAccounts));
        setListedAccounts([]);
    };

    const listAll = () => {
        setListedAccounts(listedAccounts.concat(unlistedAccounts));
        setUnlistedAccounts([]);
    };

    const showNotice = (notice: string) => {
        setNotice(notice);
        setIsShowingNotice(true);
    };

    const init = async () => {
        const listed: RSS3Account[] = [];
        const unlisted: RSS3Account[] = [];

        const pageOwner = RSS3.getPageOwner();
        const apiUser = RSS3.apiUser();
        const allAccounts = await (apiUser.persona as IRSS3).accounts.get(pageOwner.address);

        for (const account of allAccounts) {
            if (account.tags?.includes(config.tags.hiddenTag)) {
                unlisted.push(account);
            } else {
                listed.push(account);
            }
        }

        setListedAccounts(utils.sortByOrderTag(listed).map((account) => ({ id: '', account })));
        setUnlistedAccounts(utils.sortByOrderTag(unlisted).map((account) => ({ id: '', account })));
    };

    const save = async () => {
        setIsLoading(true);

        const newListed: RSS3Account[] = await utils.setOrderTag(listedAccounts.map((wrapper) => wrapper.account));
        const newUnlisted: RSS3Account[] = await utils.setHiddenTag(unlistedAccounts.map((wrapper) => wrapper.account));

        // Add and delete
        for (const { account } of toAddAccounts) {
            const showIndex = toDeleteAccounts.findIndex(
                (wrapper) =>
                    account.platform === wrapper.account.platform && account.identity === wrapper.account.identity,
            );
            if (showIndex === -1) {
                await (RSS3.getLoginUser().persona as IRSS3).accounts.post(account);
            } else {
                toDeleteAccounts.splice(showIndex, 1);
            }
        }
        for (const { account } of toDeleteAccounts) {
            await (RSS3.getLoginUser().persona as IRSS3).accounts.delete(account);
        }

        // Update tags
        await Promise.all(
            newListed.concat(newUnlisted).map((account) => {
                (RSS3.getLoginUser().persona as IRSS3).accounts.patchTags(
                    {
                        platform: account.platform,
                        identity: account.identity,
                    },
                    account.tags || [],
                );
            }),
        );

        // Empty array
        toAddAccounts.splice(0, toAddAccounts.length);
        toDeleteAccounts.splice(0, toDeleteAccounts.length);

        // Sync
        try {
            await (RSS3.getLoginUser().persona as IRSS3).files.sync();
        } catch (e) {
            console.log(e);
        }

        setIsLoading(false);
    };

    const checkDup = (newAccount: RSS3Account) => {
        const equalDefaultAccount =
            newAccount.platform === 'EVM+' && newAccount.identity === RSS3.getLoginUser().address;
        const listedIndex = listedAccounts.findIndex(
            ({ account }) => account.platform === newAccount.platform && account.identity === newAccount.identity,
        );
        const unlistedIndex = unlistedAccounts.findIndex(
            ({ account }) => account.platform === newAccount.platform && account.identity === newAccount.identity,
        );
        return equalDefaultAccount || listedIndex !== -1 || unlistedIndex !== -1;
    };

    const addNewAccountCommon = (newAccount: RSS3Account) => {
        if (newAccount.identity) {
            if (!checkDup(newAccount)) {
                const newAccountWithId = {
                    id: '',
                    account: newAccount,
                };
                setListedAccounts(listedAccounts.concat([newAccountWithId]));
                toAddAccounts.push(newAccountWithId);
                setMode('default');
            } else {
                showNotice('Account already exist');
            }
        } else {
            showNotice(newAccount.signature || 'No identity found.');
        }
    };

    const addEVMpAccount = async () => {
        if (!(window as any).ethereum) {
            // No metamask
            showNotice(
                'Adding an EVM+ account is now only supported with MetaMask browser extension enabled. (PC recommended)',
            );
            return;
        }
        const newAccount = await RSS3.addNewMetamaskAccount();
        addNewAccountCommon(newAccount);
    };

    const addNoSignAccount = (platform: string) => {
        setNoSignAccountProviderInfo({
            ...ContentProviders[platform],
            platform,
        });
        setNoSignAccountIdentity('');
        setIsAddingNoSignAccount(true);
    };

    const addNoSignAccountConfirm = () => {
        const newAccount: RSS3Account = {
            ...noSignAccountProviderInfo,
            identity: noSignAccountIdentity,
            signature: '',
        };
        setIsAddingNoSignAccount(false);
        addNewAccountCommon(newAccount);
    };

    // Initialize

    if (RSS3.getLoginUser().persona) {
        init();
    }

    return (
        <div style={{ height: '100vh' }}>
            <Head>
                <title>Edit accounts</title>
                <meta name="description" content="Edit Accounts" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
            </Head>
            <div className="h-full">
                <Header></Header>
                <div className="flex flex-col h-full m-auto px-12 pt-12 md:pt-16 w-full max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                    <h1 className="mt-4 text-lg font-bold text-left text-primary">Edit Accounts</h1>
                    <section className="flex flex-col items-center flex-1 w-full h-0 pt-10 pb-8">
                        <div className="grid w-full h-full grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="flex flex-col gap-5">
                                <div className="flex">
                                    <AssetCard
                                        title="Default"
                                        color="account"
                                        headerButtons={[]}
                                        isTransparentBG={true}
                                    >
                                        <EVMpAccountItem
                                            size="lg"
                                            address="0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA"
                                            outline="account"
                                        />
                                    </AssetCard>
                                </div>
                                {mode === ModeTypes.default && (
                                    <AssetCard
                                        title="Listed"
                                        color="account"
                                        headerButtons={[
                                            {
                                                icon: 'minus',
                                                isOutlined: true,
                                                isDisabled: false,
                                                onClick: () => {
                                                    setMode(ModeTypes.delete);
                                                },
                                            },
                                            {
                                                icon: 'plus',
                                                isOutlined: false,
                                                isDisabled: false,
                                                onClick: () => {
                                                    setMode(ModeTypes.add);
                                                },
                                            },
                                        ]}
                                        footerTips="Drag to reorder"
                                        footerButtons={[
                                            {
                                                text: 'Unlist All',
                                                isOutlined: true,
                                                isDisabled: false,
                                                onClick: () => {
                                                    unlistAll();
                                                },
                                            },
                                        ]}
                                    >
                                        <ReactSortable
                                            className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                            list={listedAccounts}
                                            setList={setListedAccounts}
                                            group="asset"
                                            animation={200}
                                            delay={2}
                                        >
                                            {listedAccounts.map(({ account }, index) => (
                                                <div
                                                    key={account.platform + account.identity}
                                                    className="relative flex items-center justify-center m-auto cursor-move"
                                                >
                                                    {account.platform === 'EVM+' ? (
                                                        <EVMpAccountItem
                                                            size="lg"
                                                            address={account.identity}
                                                            outline="account"
                                                        />
                                                    ) : (
                                                        <AccountItem
                                                            size="lg"
                                                            chain={account.platform}
                                                            outline="account"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </ReactSortable>
                                    </AssetCard>
                                )}
                                {mode === ModeTypes.add && (
                                    <AssetCard
                                        title="Add"
                                        color="account"
                                        headerButtons={[
                                            {
                                                icon: 'minus',
                                                isOutlined: true,
                                                isDisabled: false,
                                                onClick: () => {
                                                    setMode(ModeTypes.delete);
                                                },
                                            },
                                            {
                                                icon: 'check',
                                                isOutlined: false,
                                                isDisabled: false,
                                                onClick: () => {
                                                    setMode(ModeTypes.default);
                                                },
                                            },
                                        ]}
                                        footerTips="Drag to reorder"
                                        footerButtons={[
                                            {
                                                text: 'Unlist All',
                                                isOutlined: true,
                                                isDisabled: false,
                                                onClick: () => {
                                                    unlistAll();
                                                },
                                            },
                                        ]}
                                        isSecondaryBG={true}
                                    >
                                        <div className="w-full content-middle flex-shrink-0 flex flex-col gap-6">
                                            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-center">
                                                <div className="relative flex items-center justify-center m-auto cursor-pointer">
                                                    <EVMpAccountItem
                                                        size="lg"
                                                        outline="account"
                                                        onClick={async () => {
                                                            await addEVMpAccount();
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-center">
                                                {AdditionalNoSignAccounts.map((platform, i) => (
                                                    <div
                                                        className="relative flex items-center justify-center m-auto cursor-pointer"
                                                        key={platform}
                                                    >
                                                        <AccountItem
                                                            size="lg"
                                                            chain={platform}
                                                            outline="account"
                                                            onClick={() => {
                                                                addNoSignAccount(platform);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </AssetCard>
                                )}
                                {mode === ModeTypes.delete && (
                                    <AssetCard
                                        title="Remove"
                                        color="account"
                                        headerButtons={[
                                            {
                                                icon: 'check',
                                                isOutlined: true,
                                                isDisabled: false,
                                                onClick: () => {
                                                    setMode(ModeTypes.default);
                                                },
                                            },
                                            {
                                                icon: 'plus',
                                                isOutlined: false,
                                                isDisabled: false,
                                                onClick: () => {
                                                    setMode(ModeTypes.add);
                                                },
                                            },
                                        ]}
                                        footerTips="Drag to reorder"
                                        footerButtons={[
                                            {
                                                text: 'Unlist All',
                                                isOutlined: true,
                                                isDisabled: false,
                                                onClick: () => {
                                                    unlistAll();
                                                },
                                            },
                                        ]}
                                        isSecondaryBG={true}
                                    >
                                        <div className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center">
                                            {listedAccounts.map(({ account }, index) => (
                                                <div
                                                    key={account.platform + account.identity}
                                                    className="relative flex items-center justify-center m-auto"
                                                >
                                                    {account.platform === 'EVM+' ? (
                                                        <EVMpAccountItem
                                                            size="lg"
                                                            address={account.identity}
                                                            outline="account"
                                                        />
                                                    ) : (
                                                        <AccountItem
                                                            size="lg"
                                                            chain={account.platform}
                                                            outline="account"
                                                        />
                                                    )}
                                                    <div className="absolute right-0 top-0">
                                                        <Button color="account" icon="minus" isFullRound={true} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AssetCard>
                                )}
                            </div>
                            <AssetCard
                                title="Unlisted"
                                color="account"
                                footerButtons={[
                                    {
                                        text: 'List All',
                                        isOutlined: true,
                                        isDisabled: false,
                                        onClick: () => {
                                            listAll();
                                        },
                                    },
                                ]}
                                isSecondaryBG={true}
                            >
                                <ReactSortable
                                    className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                    list={unlistedAccounts}
                                    setList={setUnlistedAccounts}
                                    group="asset"
                                    animation={200}
                                    delay={2}
                                >
                                    {unlistedAccounts.map(({ account }, index) => (
                                        <div
                                            key={account.platform + account.identity}
                                            className="relative flex items-center justify-center m-auto cursor-move"
                                        >
                                            {account.platform === 'EVM+' ? (
                                                <EVMpAccountItem
                                                    size="lg"
                                                    address={account.identity}
                                                    outline="account"
                                                />
                                            ) : (
                                                <AccountItem size="lg" chain={account.platform} outline="account" />
                                            )}
                                        </div>
                                    ))}
                                </ReactSortable>
                            </AssetCard>
                        </div>
                    </section>

                    <footer className="flex w-full mb-11">
                        <div className="flex flex-row justify-center w-full gap-x-3">
                            <Button
                                isOutlined={true}
                                color="primary"
                                text="Discard"
                                fontSize="text-base"
                                width="w-48"
                                // onClick={() => handleDiscard()}
                            />
                            {isLoading ? (
                                <Button
                                    isOutlined={false}
                                    color="primary"
                                    icon="check"
                                    fontSize="text-base"
                                    width="w-48"
                                    isDisabled={true}
                                />
                            ) : (
                                <Button
                                    isOutlined={false}
                                    color="primary"
                                    text="Save"
                                    fontSize="text-base"
                                    width="w-48"
                                    onClick={() => save()}
                                />
                            )}
                        </div>
                    </footer>
                </div>
            </div>
            <Modal theme="account" hidden={!isShowingNotice} closeEvent={() => setIsShowingNotice(false)}>
                <div className="flex flex-col w-full h-full justify-between">
                    <div className="flex flex-start justify-center">
                        <span className="mx-2 text-primary">Oops</span>
                    </div>

                    <div className="flex justify-center">{notice}</div>

                    <div className="flex justify-center">
                        <Button
                            isOutlined={true}
                            color="primary"
                            text="OK"
                            fontSize="text-base"
                            width="w-48"
                            onClick={() => setIsShowingNotice(false)}
                        />
                    </div>
                </div>
            </Modal>
            <Modal theme="account" hidden={!isAddingNoSignAccount} closeEvent={() => setIsAddingNoSignAccount(false)}>
                <div className="flex flex-col w-full h-full justify-between">
                    <div className="flex flex-start justify-center">
                        <span className="text-primary">{noSignAccountProviderInfo.platform}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex">
                            Input
                            <span className="mx-2 text-primary">{noSignAccountProviderInfo.platform}</span>
                            account:
                        </div>
                        <div className="flex">
                            <Input
                                placeholder={noSignAccountProviderInfo.accountStyle}
                                isSingleLine={true}
                                prefix={noSignAccountProviderInfo.prefix}
                                suffix={noSignAccountProviderInfo.suffix}
                                value={noSignAccountIdentity}
                                onChange={(event) => {
                                    setNoSignAccountIdentity(event.target.value);
                                }}
                            />
                        </div>
                        <div className="flex text-sm">
                            <span className="text-primary text-lg mr-1">
                                <BiInfoCircle />
                            </span>
                            <span>
                                <span>You need to place your</span>
                                <span
                                    className="inline-flex mx-1 text-primary items-center cursor-pointer gap-1"
                                    onClick={async () => {
                                        setIsCopyingName(true);
                                        await window.navigator.clipboard.writeText('...');
                                        setTimeout(() => setIsCopyingName(false), 1500);
                                    }}
                                >
                                    BioLink
                                    {isCopyingName ? <BiCheckCircle /> : <BiPaste />}
                                </span>
                                <span>into one of :</span>
                                <span className="ml-1">{noSignAccountProviderInfo.availableFields.join(', ')}</span>.
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4">
                        <Button
                            isOutlined={true}
                            color="primary"
                            text="Discard"
                            fontSize="text-base"
                            width="w-32"
                            onClick={() => {
                                setNoSignAccountIdentity('');
                                setIsAddingNoSignAccount(false);
                            }}
                        />
                        <Button
                            isOutlined={false}
                            color="primary"
                            text="Confirm"
                            fontSize="text-base"
                            width="w-32"
                            onClick={() => {
                                addNoSignAccountConfirm();
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Account;
