import { NextPage } from 'next';
import { useState } from 'react';
import FootprintCard from '../../components/assets/FootprintCard';
import Button from '../../components/buttons/Button';
import { COLORS } from '../../components/buttons/variables';
import SingleFootprint from '../../components/details/SingleFootprint';
import Header from '../../components/Header';
import ImageHolder from '../../components/ImageHolder';
import Model from '../../components/Model';

const footprint: NextPage = () => {
    const [modelHidden, setModelHidden] = useState(true);

    const openModel = () => {
        setModelHidden(false);
    };

    const closeModel = () => {
        setModelHidden(true);
    };

    let content =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ';

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
                <section className="grid items-center justify-start grid-cols-2 gap-4 py-4">
                    {[...Array(5)].map((_, i) => (
                        <FootprintCard
                            key={i}
                            imageUrl={'https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5'}
                            startDate={'0x61800f00'}
                            endDate={'0x61800f00'}
                            city={''}
                            country={''}
                            username={'RSS3Lover'}
                            activity={'Say hi. ' + content}
                            clickEvent={openModel}
                        />
                    ))}
                </section>
            </div>
            <Model hidden={modelHidden} closeEvent={closeModel} theme={'footprint'}>
                <SingleFootprint />
            </Model>
        </>
    );
};

export default footprint;
