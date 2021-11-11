import { NextPage } from 'next';
import AccountCard from '../../components/account/AccountCard';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';

const account: NextPage = () => {
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
                    <AccountCard chain="EVM+" address="0xd0B85A7bB6B602f63B020256654cBE73A753DFC4" />
                    <AccountCard chain="EVM+" address="0x0000000000000000000000000000000000000000" />
                    <AccountCard chain="Misskey" address="Fendi" />
                    <AccountCard chain="Twitter" address="Fendi" />
                </section>
            </div>
        </>
    );
};

export default account;
