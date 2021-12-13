/* eslint-disable @next/next/no-img-element */

import dynamic from 'next/dynamic';
import { useState } from 'react';
import config from '../../common/config';

interface NFTItemProps {
    size: number;
    previewUrl?: string | null;
    detailUrl?: string | null;
    isShowingDetails?: boolean;
}

const DynamicModelViewer = dynamic(() => import('./ModelViewer'), {
    ssr: false,
});

const NFTItem = ({ size, previewUrl, detailUrl, isShowingDetails }: NFTItemProps) => {
    let containerClasses = `${classes.nftItem} ${!isShowingDetails ? 'object-cover' : 'object-contain'}`;
    let containerStyles = {
        width: `${size}px`,
        height: `${size}px`,
    };

    const fixSchemas = (url: string) => {
        let fixedUrl = url;
        if (url.startsWith('ipfs://')) {
            fixedUrl = url.replace('ipfs://', 'https://infura-ipfs.io/ipfs/');
        }
        return fixedUrl;
    };

    const fixedPreviewUrl = fixSchemas(previewUrl || '');
    const fixedDetailUrl = fixSchemas(detailUrl || '');

    const [mainUrl, setMainUrl] = useState(
        isShowingDetails
            ? fixedDetailUrl || fixedPreviewUrl || config.undefinedImageAlt
            : fixedPreviewUrl || fixedDetailUrl || config.undefinedImageAlt,
    );
    type contentTypes = 'html' | 'model' | 'video' | 'image';
    const getContentType = (url: string): contentTypes => {
        // Should better use Content-Type to detect, but don't know how to do that
        // todo: use Content-Type to detect type
        if (/(embed|farmhero\.io|0xAdventures\.com|crudefingers\.com|artblocks\.io)|\.(html?)$/.test(url)) {
            return 'html';
        }
        if (/\.(glb|gltf)$/.test(url)) {
            return 'model';
        }
        if (/\.(mp4|mov|webm|mp3)$/.test(url)) {
            return 'video';
        }
        return 'image'; // default
    };

    return (
        <div className="flex flex-shrink-0">
            {getContentType(mainUrl) === 'html' && (
                <iframe className={containerClasses} style={containerStyles} src={mainUrl} />
            )}
            {getContentType(mainUrl) === 'model' && (
                <div onClick={(e: any) => e.stopPropagation()}>
                    <DynamicModelViewer className={containerClasses} style={containerStyles} src={mainUrl} />
                </div>
            )}
            {getContentType(mainUrl) === 'video' && (
                <video
                    className={containerClasses}
                    style={containerStyles}
                    src={mainUrl}
                    poster={fixedPreviewUrl}
                    controls={isShowingDetails}
                    autoPlay={true}
                    loop
                    muted
                />
            )}
            {getContentType(mainUrl) === 'image' && (
                <img
                    className={containerClasses}
                    style={containerStyles}
                    src={mainUrl}
                    alt="NFT Image"
                    onError={() => setMainUrl(config.undefinedImageAlt)}
                />
            )}
        </div>
    );
};

const classes = {
    nftItem: 'bg-item-bg filter rounded',
};

export default NFTItem;
