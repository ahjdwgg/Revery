import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import AssetCard from '../../components/assets/AssetCard';
import Button from '../../components/buttons/Button';
import { GeneralAssetWithTags } from '../../common/types';
import { ReactSortable } from 'react-sortablejs';
import ImageHolder from '../../components/ImageHolder';
import config from '../../common/config';
import RSS3, { IRSS3 } from '../../common/rss3';
import utils from '../../common/utils';

const Donation = () => {
    const [listedAssets, setListedAssets] = useState<GeneralAssetWithTags[]>([]);
    const [unlistedAssets, setUnlistedAssets] = useState<GeneralAssetWithTags[]>([]);

    const unlistAll = () => {
        setUnlistedAssets(unlistedAssets.concat(listedAssets));
        setListedAssets([]);
    };

    const listAll = () => {
        setListedAssets(listedAssets.concat(unlistedAssets));
        setUnlistedAssets([]);
    };

    const init = async () => {
        const { listed, unlisted } = await utils.initAssets('Gitcoin-Donation');
        setListedAssets(listed);
        setUnlistedAssets(unlisted);
    };

    const save = async () => {
        const loginUser = RSS3.getLoginUser().persona as IRSS3;

        // Update tags
        await Promise.all(
            listedAssets.concat(unlistedAssets).map((asset) => {
                loginUser.assets.patchTags(
                    {
                        ...asset,
                    },
                    asset.tags || [],
                );
            }),
        );

        // Sync
        try {
            await loginUser.files.sync();
        } catch (e) {
            console.log(e);
        }
    };

    // Initialize

    if (RSS3.getLoginUser().persona) {
        init();
    }

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
                                        onClick: () => {
                                            unlistAll();
                                        },
                                    },
                                ]}
                            >
                                <ReactSortable
                                    className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                    list={listedAssets}
                                    setList={setListedAssets}
                                    group="asset"
                                    animation={200}
                                    delay={2}
                                >
                                    {listedAssets.map((asset, index) => (
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
                                        onClick: () => {
                                            listAll();
                                        },
                                    },
                                ]}
                                isSecondaryBG={true}
                            >
                                <ReactSortable
                                    className="w-full content-start flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                    list={unlistedAssets}
                                    setList={setUnlistedAssets}
                                    group="asset"
                                    animation={200}
                                    delay={2}
                                >
                                    {unlistedAssets.map((asset, index) => (
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
                                onClick={() => save()}
                            />
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Donation;
