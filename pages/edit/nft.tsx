import React from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import NFTItem from '../../components/assets/NFTItem';
import AssetCard from '../../components/assets/AssetCard';
import Button from '../../components/buttons/Button';

const NFT = () => {
    return (
        <div style={{ height: '100vh' }}>
            <Head>
                <title>Edit NFTs</title>
                <meta name="description" content="Edit NFTs" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
            </Head>
            <div className="h-full flex flex-col">
                <Header></Header>

                <div className="pt-12 md:pt-16 flex flex-col max-w-7xl m-auto h-full">
                    <h1 className="mt-4 font-bold text-left text-primary text-lg">Edit NFTs</h1>
                    <section className="flex flex-col w-full h-full flex-1 items-center pt-10 pb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full gap-4">
                            <AssetCard
                                title="Listed"
                                color="nft"
                                isShowingEditButton={true}
                                footerTips="Drag to reorder"
                                footerButton="Unlist All"
                            >
                                <div className="w-full mb-auto flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center">
                                    {[...Array(12)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-center relative m-auto cursor-move"
                                        >
                                            <NFTItem size={84} previewUrl="" detailUrl="" />
                                        </div>
                                    ))}
                                </div>
                            </AssetCard>
                            <AssetCard title="Unlisted" color="nft" isShowingEditButton={true} footerButton="List All">
                                <div className="w-full mb-auto flex-shrink-0 grid gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid=cols-6 justify-items-center">
                                    {[...Array(12)].map((_, i) => (
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
