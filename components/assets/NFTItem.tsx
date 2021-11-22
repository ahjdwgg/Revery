import dynamic from 'next/dynamic';
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
            fixedUrl = url.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
        }
        return fixedUrl;
    };

    const fixedPreviewUrl = fixSchemas(previewUrl || '');
    const fixedDetailUrl = fixSchemas(detailUrl || '');

    const imageUrl = isShowingDetails
        ? fixedDetailUrl || fixedPreviewUrl || config.undefinedImageAlt
        : fixedPreviewUrl || fixedDetailUrl || config.undefinedImageAlt;
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
            {getContentType(imageUrl) === 'html' && (
                <iframe className={containerClasses} style={containerStyles} src={fixedDetailUrl} />
            )}
            {getContentType(imageUrl) === 'model' && (
                <DynamicModelViewer className={containerClasses} style={containerStyles} src={fixedDetailUrl} />
            )}
            {getContentType(imageUrl) === 'video' && (
                <video
                    className={containerClasses}
                    style={containerStyles}
                    src={imageUrl}
                    poster={fixedPreviewUrl}
                    controls={isShowingDetails}
                    autoPlay={isShowingDetails}
                    playsInline
                    loop
                    muted
                />
            )}
            {getContentType(imageUrl) === 'image' && (
                <img className={containerClasses} style={containerStyles} src={imageUrl} alt="NFT Image" />
            )}
        </div>
    );
};

const classes = {
    nftItem: 'bg-item-bg filter rounded',
};

export default NFTItem;
