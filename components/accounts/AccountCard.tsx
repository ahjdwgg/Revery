import React from 'react';
import formatter from '../../common/address';
import Button from '../buttons/Button';
import { COLORS } from '../buttons/variables';
import AccountItem from './AccountItem';
import EVMpAccountItem from './EVMpAccountItem';

interface AccountCardProps {
    size?: string;
    chain: string;
    address: string;
    clickEvent?: () => void;
}

const AccountCard = ({ size = 'lg', chain, address, clickEvent = () => {} }: AccountCardProps) => {
    return (
        <section className="grid items-center grid-cols-3 cursor-pointer" onClick={clickEvent}>
            {chain !== 'EVM+' ? (
                <AccountItem size={size} chain={chain} outline="account" />
            ) : (
                <EVMpAccountItem size={size} address={address} outline="account" />
            )}
            <span className="text-lg font-bold text-left">{formatter(address)}</span>
            <div className="flex flex-row items-center gap-x-2">
                <Button isOutlined={true} color={COLORS.primary} text={'Copy'} />
                <Button isOutlined={false} color={COLORS.primary} icon={'external'} />
            </div>
        </section>
    );
};

export default AccountCard;
