import React from 'react';
import { AccountIcon, AccountItemProps, AccountOutline, AccountSize } from './variables';

const AccountItem = ({ size = 'sm', chain = 'BSC', outline = 'default' }: AccountItemProps) => {
    return (
        <div
            className={`${AccountSize.get(size)} border rounded-full ${AccountOutline.get(
                outline,
            )} flex flex-row justify-center items-center`}
        >
            <div className={`${AccountIcon.get(chain)} w-full h-full bg-center bg-no-repeat bg-cover`} />
        </div>
    );
};

export default AccountItem;
