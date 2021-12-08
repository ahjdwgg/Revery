import React from 'react';
import { AccountIcon, AccountItemProps, AccountSize } from './variables';

const AccountItem = ({ size = 'sm', chain = 'BSC', onClick }: AccountItemProps) => {
    return (
        <div
            className={`${AccountSize.get(size)} rounded-full flex flex-row justify-center items-center`}
            onClick={onClick}
        >
            <div className={`${AccountIcon.get(chain)} w-full h-full bg-center bg-no-repeat bg-cover`} />
        </div>
    );
};

export default AccountItem;
