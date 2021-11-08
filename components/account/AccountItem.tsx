import React from 'react';

interface AccountItemProps {
    size?: string;
    chain?: string;
}

export default function AccountItem({ size = 'sm', chain = 'BSC' }: AccountItemProps) {
    return (
        <div
            className={`${AccountSize.get(
                size,
            )} border rounded-full border-primary flex flex-row justify-center items-center p-0.5`}
        >
            <div className={`${AccountIcon.get(chain)} w-full h-full bg-center bg-no-repeat bg-cover`}></div>
        </div>
    );
}

const AccountSize = new Map([
    ['sm', 'w-6 h-6'],
    ['md', 'w-12 h-12'],
]);

const AccountIcon = new Map([
    ['BSC', 'bg-BSC'],
    ['Ethereum', 'bg-Ethereum'],
    ['Ronin', 'bg-Ronin'],
    ['Misskey', 'bg-Misskey'],
    ['Twitter', 'bg-Twitter'],
]);
