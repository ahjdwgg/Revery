import React from 'react';
import { AccountIcon, AccountItemProps, AccountSize } from './variables';

const AccountItem = ({ size = 'sm', chain = 'BSC' }: AccountItemProps) => {
    return (
        <div
            className={`${AccountSize.get(
                size,
            )} border rounded-full border-primary flex flex-row justify-center items-center p-0.5`}
        >
            <div className={`${AccountIcon.get(chain)} w-full h-full bg-center bg-no-repeat bg-cover`} />
        </div>
    );
};

export default AccountItem;
