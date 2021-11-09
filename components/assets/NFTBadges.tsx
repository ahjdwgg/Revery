interface NFTBadgesProps {
    location: 'overlay' | 'header';
    chain: 'BSC' | 'Ethereum' | 'Polygon' | 'Ronin';
    collectionImg?: string;
}

const NFTBadges = ({ location, chain, collectionImg }: NFTBadgesProps) => {
    const containerClass = `${classes.containerBase} ${classes.containerExtend[location]}`;
    const badgeClass = `${classes.badgeBase} ${classes.badgeExtend[location]}`;
    const chainClass = `${badgeClass} ${classes.badgeChain[chain]}`;

    const collectionImgStyle = {
        backgroundImage: `url(${collectionImg})`,
    };

    return (
        <div className={containerClass}>
            {collectionImg && <div className={badgeClass} style={collectionImgStyle} />}
            <div className={chainClass} />
        </div>
    );
};

const classes = {
    containerBase: 'flex flex-row gap-1 items-center justify-end absolute',
    containerExtend: {
        overlay: 'right-2.5 top-2.5',
        header: 'right-0',
    },
    badgeBase: 'bg-item-bg bg-cover bg-center bg-no-repeat border-sm border-item-border rounded-full shadow-nft',
    badgeExtend: {
        overlay: 'w-6 h-6',
        header: 'w-7 h-7',
    },
    badgeChain: {
        BSC: 'bg-BSC',
        Ethereum: 'bg-Ethereum',
        Polygon: 'bg-Polygon',
        Ronin: 'bg-Ronin',
    },
};

export default NFTBadges;
