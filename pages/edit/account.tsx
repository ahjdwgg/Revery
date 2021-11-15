import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import AssetCard from '../../components/assets/AssetCard';
import Button from '../../components/buttons/Button';
import { ReactSortable } from 'react-sortablejs';
import { RSS3Account } from 'rss3-next/types/rss3';
import config from '../../common/config';
import EVMpAccountItem from '../../components/account/EVMpAccountItem';
import AccountItem from '../../components/account/AccountItem';

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

    const [unlistedAccounts, setUnlistedAccounts] = useState<RSS3AccountWithID[]>([]);

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
                <div className="pt-12 md:pt-16 flex flex-col w-max max-w-7xl m-auto h-full">
                    <h1 className="mt-4 font-bold text-left text-primary text-lg">Edit Accounts</h1>
                    <section className="flex flex-col w-full h-0 flex-1 items-center pt-10 pb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full gap-4">
                            <div className="flex flex-col gap-5">
                                <div className="flex">
                                    <AssetCard title="Default" color="account" isTransparentBG={true}>
                                        <EVMpAccountItem
                                            size="lg"
                                            address="0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA"
                                            outline="account"
                                        />
                                    </AssetCard>
                                </div>
                                <AssetCard
                                    title="Listed"
                                    color="account"
                                    headerButtonMode={'plus-minus'}
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
                                                className="flex items-center justify-center relative m-auto cursor-move"
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
                                            className="flex items-center justify-center relative m-auto cursor-move"
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
                        <div className="flex flex-row gap-x-3 w-full justify-center">
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
