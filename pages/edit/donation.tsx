import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import AssetCard from '../../components/assets/AssetCard';
import Button from '../../components/buttons/Button';
import { GeneralAssetWithTags } from '../../common/types';
import { ReactSortable } from 'react-sortablejs';
import ImageHolder from '../../components/ImageHolder';
import config from '../../common/config';

const Donation = () => {
    const [listedDonations, setListedDonations] = useState<GeneralAssetWithTags[]>([
        {
            platform: 'EVM+',
            identity: '0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA',
            type: 'Gitcoin-Donation',
            id: '0x8c23B96f2fb77AaE1ac2832debEE30f09da7af3C',
            info: {
                image_preview_url: 'https://c.gitcoin.co/grants/546622657b597ce151666ed2e2ecbd92/rss3_square_blue.png',
                title: 'RSS3 - RSS with human curation',
                total_contribs: 1,
                token_contribs: [
                    {
                        token: 'ETH',
                        amount: '0.001',
                    },
                ],
            },
        },
        {
            platform: 'EVM+',
            identity: '0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA',
            type: 'Gitcoin-Donation',
            id: '0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6',
            info: {
                image_preview_url: 'https://c.gitcoin.co/grants/adb075fd0039ec8c8dc9d468638744b2/1500x500-1.jpg',
                title: 'Gitcoin Grants Official Matching Pool Fund',
                total_contribs: 1,
                token_contribs: [
                    {
                        token: 'ETH',
                        amount: '0.00005',
                    },
                ],
            },
        },
    ]);

    const [unlistedDonations, setUnlistedDonations] = useState<GeneralAssetWithTags[]>([]);

    return (
        <div style={{ height: '100vh' }}>
            <Head>
                <title>Edit Donations</title>
                <meta name="description" content="Edit Donations" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
            </Head>
            <div className="h-full">
                <Header></Header>
                <div className="flex flex-col h-full m-auto px-12 pt-12 md:pt-16 w-full max-w-4xl xl:max-w-6xl 2xl:max-w-7xl">
                    <h1 className="mt-4 font-bold text-left text-primary text-lg">Edit Donations</h1>
                    <section className="flex flex-col w-full h-0 flex-1 items-center pt-10 pb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full gap-4">
                            <AssetCard
                                title="Listed"
                                color="donation"
                                footerTips="Drag to reorder"
                                footerButtons={[
                                    {
                                        text: 'Unlist All',
                                        isOutlined: true,
                                        isDisabled: false,
                                        onClick: () => {},
                                    },
                                ]}
                            >
                                <ReactSortable
                                    className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                    list={listedDonations}
                                    setList={setListedDonations}
                                    group="asset"
                                    animation={200}
                                    delay={2}
                                >
                                    {listedDonations.map((asset, index) => (
                                        <div
                                            key={asset.id}
                                            className="flex items-center justify-center relative m-auto cursor-move"
                                        >
                                            <ImageHolder
                                                size={84}
                                                imageUrl={
                                                    asset.info.animation_url ||
                                                    asset.info.image_preview_url ||
                                                    config.undefinedImageAlt
                                                }
                                                title={asset.info.title}
                                                isFullRound={false}
                                            />
                                        </div>
                                    ))}
                                </ReactSortable>
                            </AssetCard>
                            <AssetCard
                                title="Unlisted"
                                color="donation"
                                footerButtons={[
                                    {
                                        text: 'List All',
                                        isOutlined: true,
                                        isDisabled: false,
                                        onClick: () => {},
                                    },
                                ]}
                                isSecondaryBG={true}
                            >
                                <ReactSortable
                                    className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                    list={unlistedDonations}
                                    setList={setUnlistedDonations}
                                    group="asset"
                                    animation={200}
                                    delay={2}
                                >
                                    {unlistedDonations.map((asset, index) => (
                                        <div
                                            key={asset.id}
                                            className="flex items-center justify-center relative m-auto cursor-move"
                                        >
                                            <ImageHolder
                                                size={84}
                                                imageUrl={
                                                    asset.info.animation_url ||
                                                    asset.info.image_preview_url ||
                                                    config.undefinedImageAlt
                                                }
                                                title={asset.info.title}
                                                isFullRound={false}
                                            />
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

export default Donation;
