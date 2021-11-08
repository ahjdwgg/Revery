export interface AccountItemProps {
    size?: string;
    chain?: string;
    address?: string;
}

export const AccountSize = new Map([
    ['sm', 'w-6 h-6'],
    ['md', 'w-12 h-12'],
]);

export const AccountIcon = new Map([
    ['BSC', 'bg-BSC'],
    ['Ethereum', 'bg-Ethereum'],
    ['Ronin', 'bg-Ronin'],
    ['Misskey', 'bg-Misskey'],
    ['Twitter', 'bg-Twitter'],
]);