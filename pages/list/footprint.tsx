import { NextPage } from 'next';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';

const footprint: NextPage = () => {
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
                    <h1 className="text-lg font-bold text-left text-footprint">Joshua's NFTs</h1>
                    <Button isOutlined={true} color={COLORS.footprint} text={'Edit'} />
                </section>
                <section className="grid grid-cols-5 gap-4 py-4 justify-items-center">
                    {[...Array(7)].map((_, i) => (
                        <ImageHolder imageUrl="https://i.imgur.com/GdWEt4z.jpg" isFullRound={true} size={208} />
                    ))}
                </section>
            </div>
        </>
    );
};

export default footprint;
