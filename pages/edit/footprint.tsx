import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import AssetCard from '../../components/assets/AssetCard';
import Button from '../../components/buttons/Button';
import { GeneralAssetWithTags } from '../../common/types';
import { ReactSortable } from 'react-sortablejs';
import ImageHolder from '../../components/ImageHolder';
import config from '../../common/config';

const Footprint = () => {
    const [listedFootprints, setlistedFootprints] = useState<GeneralAssetWithTags[]>([
        {
            platform: 'EVM+',
            identity: '0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA',
            info: {
                image_preview_url: 'https://assets.poap.xyz/rss3-fully-support-poap-2021-logo-1635826323177.png',
                title: 'RSS3 Fully Supports POAP',
                start_date: '0x61800f00',
                end_date: '0x61800f00',
                city: '',
                country: '',
            },
            type: 'xDai-POAP',
            id: '2443267',
        },
        {
            platform: 'EVM+',
            identity: '0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA',
            info: {
                image_preview_url: 'https://assets.poap.xyz/rss3-fully-support-poap-2021-logo-1635826323177.png',
                title: 'RSS3 Fully Supports POAP',
                start_date: '0x61800f00',
                end_date: '0x61800f00',
                city: '',
                country: '',
            },
            type: 'xDai-POAP',
            id: '2443267',
        },
    ]);

    const [unlistedFootprints, setUnlistedFootprints] = useState<GeneralAssetWithTags[]>([]);

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
                    <h1 className="mt-4 text-lg font-bold text-left text-primary">Edit Footprints</h1>
                    <section className="flex flex-col items-center flex-1 w-full h-0 pt-10 pb-8">
                        <div className="grid w-full h-full grid-cols-1 gap-4 lg:grid-cols-2">
                            <AssetCard
                                title="Listed"
                                color="footprint"
                                footerTips="Drag to reorder"
                                footerButton="Unlist All"
                            >
                                <ReactSortable
                                    className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                    list={listedFootprints}
                                    setList={setlistedFootprints}
                                    group="asset"
                                    animation={200}
                                    delay={2}
                                >
                                    {listedFootprints.map((asset, index) => (
                                        <div
                                            key={asset.id}
                                            className="relative flex items-center justify-center m-auto cursor-move"
                                        >
                                            <ImageHolder
                                                size={84}
                                                imageUrl={
                                                    asset.info.animation_url ||
                                                    asset.info.image_preview_url ||
                                                    config.undefinedImageAlt
                                                }
                                                title={asset.info.title}
                                                isFullRound={true}
                                            />
                                        </div>
                                    ))}
                                </ReactSortable>
                            </AssetCard>
                            <AssetCard title="Unlisted" color="footprint" footerButton="List All" isSecondaryBG={true}>
                                <ReactSortable
                                    className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                    list={unlistedFootprints}
                                    setList={setUnlistedFootprints}
                                    group="asset"
                                    animation={200}
                                    delay={2}
                                >
                                    {unlistedFootprints.map((asset, index) => (
                                        <div
                                            key={asset.id}
                                            className="relative flex items-center justify-center m-auto cursor-move"
                                        >
                                            <ImageHolder
                                                size={84}
                                                imageUrl={
                                                    asset.info.animation_url ||
                                                    asset.info.image_preview_url ||
                                                    config.undefinedImageAlt
                                                }
                                                title={asset.info.title}
                                                isFullRound={true}
                                            />
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

export default Footprint;
