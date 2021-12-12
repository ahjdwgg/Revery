export const COLORS = {
    primary: 'primary',
    account: 'account',
    nft: 'nft',
    donation: 'donation',
    footprint: 'footprint',
    metamask: 'metamask',
};

export const BUTTON_ICONS = {
    expand: 'expand',
    plus: 'plus',
    minus: 'minus',
    external: 'external',
    check: 'check',
    circle: 'circle',
    loading: 'loading',
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

export const COLORTOSTYLE: { [key: string]: colorToStyleInterface } = {
    primary: {
        name: 'primary',
        bgDefault: 'bg-primary',
        bgAlt: 'bg-white',
        text: 'text-primary',
        border: 'border-primary',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-primary',
    },
    account: {
        name: 'account',
        bgDefault: 'bg-account',
        bgAlt: 'bg-white',
        text: 'text-account',
        border: 'border-account',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-account',
    },
    nft: {
        name: 'nft',
        bgDefault: 'bg-nft',
        bgAlt: 'bg-white',
        text: 'text-nft',
        border: 'border-nft',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-nft',
    },
    donation: {
        name: 'donation',
        bgDefault: 'bg-donation',
        bgAlt: 'bg-white',
        text: 'text-donation',
        border: 'border-donation',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-donation',
    },
    footprint: {
        name: 'footprint',
        bgDefault: 'bg-footprint',
        bgAlt: 'bg-white',
        text: 'text-footprint',
        border: 'border-footprint',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-white',
        hoverBorder: 'hover:border-footprint',
    },
    metamask: {
        name: 'metamask',
        bgDefault: 'bg-metamask-bg',
        bgAlt: 'bg-metamask-bg',
        text: 'text-metamask-text',
        border: 'border-metamask-bg',
        hoverBg: 'hover:opacity-90',
        hoverText: 'hover:text-metamask-text',
        hoverBorder: 'hover:border-metamask-bg',
    },
};
