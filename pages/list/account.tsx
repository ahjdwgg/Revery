import { NextPage } from 'next';
import { useState } from 'react';
import AccountCard from '../../components/accounts/AccountCard';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleAccount from '../../components/details/SingleAccount';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Model from '../../components/Model';

const account: NextPage = () => {
    const [modelHidden, setModelHidden] = useState(true);

    const openModel = () => {
        setModelHidden(false);
    };

    const closeModel = () => {
        setModelHidden(true);
    };

    return (
        <>
            <Header>
                <div className="flex flex-row justify-end w-full gap-x-8">
                    <Button isOutlined={false} color={COLORS.primary} text={'Create Now'} />
                    <ImageHolder imageUrl="https://i.imgur.com/GdWEt4z.jpg" isFullRound={true} size={28} />
                </div>
            </Header>
            <div className="max-w-6xl px-2 pt-16 mx-auto divide-y divide-solid divide-primary divide-opacity-5">
                <section className="flex flex-row justify-between w-full my-4">
                    <h1 className="text-lg font-bold text-left text-account">Joshua's NFTs</h1>
                    <Button isOutlined={true} color={COLORS.account} text={'Edit'} />
                </section>
                <section className="grid items-center justify-start grid-cols-2 gap-4 py-4 gap-x-12">
                    <AccountCard
                        chain="EVM+"
                        address="0xd0B85A7bB6B602f63B020256654cBE73A753DFC4"
                        clickEvent={openModel}
                    />
                    <AccountCard
                        chain="EVM+"
                        address="0x0000000000000000000000000000000000000000"
                        clickEvent={openModel}
                    />
                </section>
            </div>
            <Model hidden={modelHidden} closeEvent={closeModel} theme={'account'}>
                <SingleAccount chain="EVM+" address="0x0000000000000000000000000000000000000000" />
            </Model>
        </>
    );
};

export default account;
