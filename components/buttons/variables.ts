export const COLORS = {
    primary: 'primary',
    account: 'account',
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
    bgAlt: string;
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
        bgAlt: 'bg-white',
        text: 'text-primary',
        border: 'border-primary',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-primary',
    },
    {
        name: 'account',
        bgDefault: 'bg-account',
        bgAlt: 'bg-white',
        text: 'text-account',
        border: 'border-account',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-account',
    },
    {
        name: 'nft',
        bgDefault: 'bg-nft',
        bgAlt: 'bg-white',
        text: 'text-nft',
        border: 'border-nft',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-nft',
    },
    {
        name: 'donation',
        bgDefault: 'bg-donation',
        bgAlt: 'bg-white',
        text: 'text-donation',
        border: 'border-donation',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-donation',
    },
    {
        name: 'footprint',
        bgDefault: 'bg-footprint',
        bgAlt: 'bg-white',
        text: 'text-footprint',
        border: 'border-footprint',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-footprint',
    },
];
