import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import NFTItem from '../../components/assets/NFTItem';
import AssetCard from '../../components/assets/AssetCard';
import Button from '../../components/buttons/Button';
import { GeneralAssetWithTags } from '../../common/types';
import { ReactSortable } from 'react-sortablejs';

const NFT = () => {
    const [listedNFTs, setListedNFTs] = useState<GeneralAssetWithTags[]>([
        {
            platform: 'EVM+',
            identity: '0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA',
            type: 'Ethereum-NFT',
            id: '0x495f947276749ce646f68ac8c248420045cb7b5e-95849343277904350302714541760730559399668504382033917368394353589235277103105',
            info: {
                collection: 'NyaOne Collection',
                collection_icon:
                    'https://lh3.googleusercontent.com/54Zw43PAqoCDLHuiG8rQkhP1tIu7EtkNYdy8LypCho9ZR59NbF306Heka6hYde1Az1orhoakkxaz51VrYdAnU3jJq1lViCF1AttLwg=s120',
                image_preview_url:
                    'https://lh3.googleusercontent.com/Yxe-veT5ZeVxNVMcPt0zAn6V_Q0OYzF-f1-mgmVJC4vCwm8zbfzWPV2VcZYtSWcJ9frRp19u3ZqM3aGIgac20b3YT1q0NSV-w3hg=s250',
                animation_url: null,
                animation_original_url: null,
            },
        },
        {
            platform: 'EVM+',
            identity: '0xD3E8ce4841ed658Ec8dcb99B7a74beFC377253EA',
            type: 'Ethereum-NFT',
            id: '0x495f947276749ce646f68ac8c248420045cb7b5e-95849343277904350302714541760730559399668504382033917368394353588135765475329',
            info: {
                collection: "Candinya's Avatars Collection",
                collection_icon:
                    'https://lh3.googleusercontent.com/7xTZWx9ywz6Af7O8N5ZmuRHQCh2D3raBncT1uo9RYOvqbAZL8wjle1e981l9GZoWyCewXvo32tjVFBe-eRETB4cKNMLgGjn4kRnMyQ=s120',
                image_preview_url:
                    'https://lh3.googleusercontent.com/PTh7RRyy_4y7WUTS8kIBXMFE_g9CBwdxSAw32oGiSb9W4SqveyhXQPBGzIaJuKhqfzskpX0yFGB8D76ldfK0WYI3MFcCyTrv2MMREvc=s250',
                animation_url: null,
                animation_original_url: null,
            },
        },
    ]);

    return (
        <div style={{ height: '100vh' }}>
            <Head>
                <title>Edit NFTs</title>
                <meta name="description" content="Edit NFTs" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
            </Head>
            <div className="h-full">
                <Header></Header>
                <div className="pt-12 md:pt-16 flex flex-col w-max max-w-7xl m-auto h-full">
                    <h1 className="mt-4 font-bold text-left text-primary text-lg">Edit NFTs</h1>
                    <section className="flex flex-col w-full h-0 flex-1 items-center pt-10 pb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full gap-4">
                            <AssetCard
                                title="Listed"
                                color="nft"
                                footerTips="Drag to reorder"
                                footerButton="Unlist All"
                            >
                                <ReactSortable
                                    className="w-full mb-auto flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center"
                                    list={listedNFTs}
                                    setList={setListedNFTs}
                                    group="NFT"
                                    animation={200}
                                    delay={2}
                                >
                                    {listedNFTs.map((nft, index) => (
                                        <div
                                            key={nft.id}
                                            className="flex items-center justify-center relative m-auto cursor-move"
                                        >
                                            <NFTItem
                                                size={84}
                                                previewUrl={nft.info.image_preview_url}
                                                detailUrl={nft.info.animation_url}
                                                isShowingDetails={false}
                                            />
                                        </div>
                                    ))}
                                </ReactSortable>
                            </AssetCard>
                            <AssetCard title="Unlisted" color="nft" footerButton="List All" isSecondaryBG={true}>
                                <div className="w-full mb-auto flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center">
                                    {[...Array(120)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-center relative m-auto cursor-move"
                                        >
                                            <NFTItem size={84} previewUrl="" detailUrl="" />
                                        </div>
                                    ))}
                                </div>
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

export default NFT;
