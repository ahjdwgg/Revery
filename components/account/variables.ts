export interface AccountItemProps {
    size?: string;
    chain?: string;
    address?: string;
    outline?: string;
}

export const AccountSize = new Map([
    ['sm', 'w-6 h-6 p-0.5'],
    ['md', 'w-12 h-12 p-2'],
    ['lg', 'w-24 h-24 p-4']
]);

export const AccountIcon = new Map([
    ['BSC', 'bg-BSC'],
    ['Ethereum', 'bg-Ethereum'],
    ['Ronin', 'bg-Ronin'],
    ['Misskey', 'bg-Misskey'],
    ['Twitter', 'bg-Twitter'],
]);

export const AccountOutline = new Map([
    ['default','border-primary'],
    ['account','border-account'],
])