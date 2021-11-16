import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import AssetCard from '../../components/assets/AssetCard';
import Button from '../../components/buttons/Button';
import { ReactSortable } from 'react-sortablejs';
import { RSS3Account } from 'rss3-next/types/rss3';
import config from '../../common/config';
import EVMpAccountItem from '../../components/accounts/EVMpAccountItem';
import AccountItem from '../../components/accounts/AccountItem';

interface RSS3AccountWithID extends RSS3Account {
    id: string;
}

const Account = () => {
    const [listedAccounts, setListedAccounts] = useState<RSS3AccountWithID[]>(
        [
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
        ].map((account) => {
            return {
                id: '',
                ...account,
            };
        }),
    );

    const ModeTypes = {
        normal: 'normal',
        add: 'add',
        delete: 'delete',
    };

    const [unlistedAccounts, setUnlistedAccounts] = useState<RSS3AccountWithID[]>([]);
    const [mode, setMode] = useState(ModeTypes.normal);

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
                <div className="flex flex-col h-full pt-12 m-auto md:pt-16 w-max max-w-7xl">
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
                                {mode === ModeTypes.normal && (
                                    <AssetCard
                                        title="Listed"
                                        color="account"
                                        headerButtons={[
                                            {
                                                icon: 'minus',
                                                isOutlined: true,
                                                isDisabled: false,
                                            },
                                            {
                                                icon: 'plus',
                                                isOutlined: false,
                                                isDisabled: false,
                                            },
                                        ]}
                                        footerTips="Drag to reorder"
                                        footerButton="Unlist All"
                                    >
                                        <ReactSortable
                                            className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                            list={listedAccounts}
                                            setList={setListedAccounts}
                                            group="asset"
                                            animation={200}
                                            delay={2}
                                        >
                                            {listedAccounts.map((account, index) => (
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
                                        title="Listed"
                                        color="account"
                                        headerButtons={[
                                            {
                                                icon: 'minus',
                                                isOutlined: true,
                                                isDisabled: false,
                                            },
                                            {
                                                icon: 'check',
                                                isOutlined: false,
                                                isDisabled: false,
                                            },
                                        ]}
                                        footerTips="Drag to reorder"
                                        footerButton="Unlist All"
                                    >
                                        <div className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center">
                                            {listedAccounts.map((account, index) => (
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
                                        </div>
                                    </AssetCard>
                                )}
                                {mode === ModeTypes.delete && (
                                    <AssetCard
                                        title="Listed"
                                        color="account"
                                        headerButtons={[
                                            {
                                                icon: 'check',
                                                isOutlined: true,
                                                isDisabled: false,
                                            },
                                            {
                                                icon: 'plus',
                                                isOutlined: false,
                                                isDisabled: false,
                                            },
                                        ]}
                                        footerTips="Drag to reorder"
                                        footerButton="Unlist All"
                                    >
                                        <div className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center">
                                            {listedAccounts.map((account, index) => (
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
                                        </div>
                                    </AssetCard>
                                )}
                            </div>
                            <AssetCard title="Unlisted" color="account" footerButton="List All" isSecondaryBG={true}>
                                <ReactSortable
                                    className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                    list={unlistedAccounts}
                                    setList={setUnlistedAccounts}
                                    group="asset"
                                    animation={200}
                                    delay={2}
                                >
                                    {unlistedAccounts.map((account, index) => (
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
                            <Button
                                isOutlined={false}
                                color="primary"
                                text="Save"
                                fontSize="text-base"
                                width="w-48"
                                // isDisabled={saveBtnDisabled}
                                // onClick={() => handleSave()}
                            />
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Account;
