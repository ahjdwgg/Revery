import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import AssetCard from '../../components/assets/AssetCard';
import Button from '../../components/buttons/Button';
import { GeneralAssetWithTags } from '../../common/types';
import { ReactSortable } from 'react-sortablejs';
import ImageHolder from '../../components/ImageHolder';
import config from '../../common/config';
import utils from '../../common/utils';
import RSS3, { IRSS3 } from '../../common/rss3';

const Footprint = () => {
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
        const { listed, unlisted } = await utils.initAssets('POAP');
        setListedAssets(listed);
        setUnlistedAssets(unlisted);
    };

    const save = async () => {
        const loginUser = RSS3.getLoginUser();

        // Update tags
        await Promise.all(
            listedAssets.concat(unlistedAssets).map((asset) => {
                (loginUser.persona as IRSS3).assets.patchTags(
                    {
                        ...asset,
                    },
                    asset.tags || [],
                );
            }),
        );

        // Sync
        try {
            await (loginUser.persona as IRSS3).files.sync();
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
                    <h1 className="mt-4 text-lg font-bold text-left text-primary">Edit Footprints</h1>
                    <section className="flex flex-col items-center flex-1 w-full h-0 pt-10 pb-8">
                        <div className="grid w-full h-full grid-cols-1 gap-4 lg:grid-cols-2">
                            <AssetCard
                                title="Listed"
                                color="footprint"
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
                            <AssetCard
                                title="Unlisted"
                                color="footprint"
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
                                onClick={() => save()}
                            />
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Footprint;
