import React from 'react';
import Button from '../buttons/Button';
import { COLORS } from '../buttons/variables';

export default function Payment() {
    return (
        <div className="flex flex-row items-center justify-start gap-x-4">
            <div className="flex flex-row items-center justify-between flex-1 px-4 py-2 rounded bg-donation-bg">
                <div className="flex-shrink pr-2 text-donation">5.20 USDT</div>
                <div className="flex-1 w-0 text-right truncate">2 days ago</div>
            </div>
            <Button isOutlined={false} color={COLORS.donation} icon={'external'} width="w-8 h-8" />
        </div>
    );
}
