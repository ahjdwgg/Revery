interface NFTBadgesProps {
    location: 'overlay' | 'header';
    chain: string;
    collectionImg?: string | null;
}

const NFTBadges = ({ location, chain, collectionImg }: NFTBadgesProps) => {
    const containerClass = `${classes.containerBase} ${classes.containerExtend[location]}`;
    const badgeClass = `${classes.badgeBase} ${classes.badgeExtend[location]}`;
    const chainBaseClass = 'p-0.5 w-6 h-6 bg-white rounded-full';
    const chainClass = `w-full h-full ${classes.badgeBase} ${badgeChain.get(chain)}`;

    const collectionImgStyle = {
        backgroundColor: 'white',
        backgroundImage: `url(${collectionImg})`,
    };

    return (
        <div className={containerClass}>
            {collectionImg && <div className={badgeClass} style={collectionImgStyle} />}
            <div className={chainBaseClass}>
                <div className={chainClass}></div>
            </div>
        </div>
    );
};

const classes = {
    containerBase: 'flex flex-row gap-1 items-center justify-end',
    containerExtend: {
        overlay: 'absolute right-2.5 top-2.5',
        header: '',
    },
    badgeBase: 'bg-center bg-no-repeat bg-cover rounded-full bg-item-bg border-sm border-item-border shadow-nft',
    badgeExtend: {
        overlay: 'w-6 h-6',
        header: 'w-7 h-7',
    },
};

const badgeChain = new Map([
    ['BSC', 'bg-BSC'],
    ['Ethereum', 'bg-Ethereum'],
    ['Polygon', 'bg-Polygon'],
    ['Ronin', 'bg-Ronin'],
]);

export default NFTBadges;
