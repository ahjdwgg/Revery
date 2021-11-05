export const COLORS = {
    primary: 'primary',
    nft: 'nft',
    donation: 'donation',
    footprint: 'footprint',
};

export const BUTTON_ICONS = {
    expand: 'expand',
    plus: 'plus',
    minus: 'minus',
};

interface colorToStyleInterface {
    name: string;
    bgDefault: string;
    bgBg: string;
    text: string;
    border: string;
    hoverBg: string;
    hoverText: string;
    hoverBorder: string;
}

export const COLORTOSTYLE: colorToStyleInterface[] = [
    {
        name: 'primary',
        bgDefault: 'bg-primary',
        bgBg: 'bg-white',
        text: 'text-primary',
        border: 'border-primary',
        hoverBg: 'hover:bg-white',
        hoverText: 'hover:text-primary',
        hoverBorder: 'hover:border-primary',
    },
    {
        name: 'nft',
        bgDefault: 'bg-nft',
        bgBg: 'bg-nft-bg',
        text: 'text-nft',
        border: 'border-nft',
        hoverBg: 'hover:bg-nft-bg',
        hoverText: 'hover:text-nft',
        hoverBorder: 'hover:border-nft',
    },
    {
        name: 'donation',
        bgDefault: 'bg-donation',
        bgBg: 'bg-donation-bg',
        text: 'text-donation',
        border: 'border-donation',
        hoverBg: 'hover:bg-donation-bg',
        hoverText: 'hover:text-donation',
        hoverBorder: 'hover:border-donation',
    },
    {
        name: 'footprint',
        bgDefault: 'bg-footprint',
        bgBg: 'bg-footprint-bg',
        text: 'text-footprint',
        border: 'border-footprint',
        hoverBg: 'hover:bg-footprint-bg',
        hoverText: 'hover:text-footprint',
        hoverBorder: 'hover:border-footprint',
    },
];
