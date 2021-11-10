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

    const imageUrl = isShowingDetails
        ? detailUrl || previewUrl || config.undefinedImageAlt
        : previewUrl || detailUrl || config.undefinedImageAlt;
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

    const fixSchemas = (url: string) => {
        if (url.startsWith('ipfs://')) {
            return url.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/');
        }
        return url;
    };

    previewUrl = fixSchemas(previewUrl || '');
    detailUrl = fixSchemas(detailUrl || '');

    return (
        <div className="flex flex-shrink-0">
            {getContentType(imageUrl) === 'html' && (
                <iframe className={containerClasses} style={containerStyles} src={detailUrl} />
            )}
            {getContentType(imageUrl) === 'model' && (
                <DynamicModelViewer className={containerClasses} style={containerStyles} src={detailUrl} />
            )}
            {getContentType(imageUrl) === 'video' && (
                <video
                    className={containerClasses}
                    style={containerStyles}
                    src={detailUrl || previewUrl}
                    poster={previewUrl}
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
