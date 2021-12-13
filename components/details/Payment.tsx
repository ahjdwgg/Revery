import React from 'react';
import { timeDifferent } from '../../common/timeStamp';
import { DonationInfo } from '../../common/types';
import Button from '../buttons/Button';
import { COLORS } from '../buttons/variables';

interface PaymentProps {
    donation: DonationInfo;
}

function toScanTx(item: DonationInfo) {
    if (item.approach === 'zkSync') {
        window.open(`https://zkscan.io/explorer/transactions/${item.txHash}`);
    } else {
        window.open(`https://etherscan.io/tx/${item.txHash}`);
    }
}

export default function Payment({ donation }: PaymentProps) {
    return (
        <div className="flex flex-row items-center justify-start gap-x-4">
            <div className="flex flex-row items-center justify-between flex-1 px-4 py-2 bg-primary-bg">
                <div className="flex-shrink pr-2 text-primary">{donation.formatedAmount + ' ' + donation.symbol}</div>
                <div className="flex-1 w-0 text-right truncate">
                    {timeDifferent(parseInt(donation.timeStamp) * 1000)}
                </div>
            </div>
            <Button isOutlined={false} color={COLORS.primary} icon={'external'} onClick={() => toScanTx(donation)} />
        </div>
    );
}
