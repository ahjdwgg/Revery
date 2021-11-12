import React from 'react';
import { BiLinkAlt } from 'react-icons/bi';
import Payment from './Payment';

export default function GitcoinDetail() {
    const subtitle = 'text-lg font-medium capitalize text-donation';

    return (
        <div className="flex flex-col items-start justify-start gap-5 filter">
            <section className="w-full">
                <h2 className="overflow-hidden text-xl font-semibold capitalize break-all overflow-ellipsis">
                    Crypto Disciple Tutorials on Youtube
                </h2>
                <div className="flex flex-row items-center justify-start gap-2 my-1 text-donation">
                    <BiLinkAlt />
                    <span className="flex-1 text-sm leading-normal truncate cursor-pointer">
                        https://www.youtube.com/channel/UCI-mQ-o0...
                    </span>
                </div>
            </section>
            <div>
                <h3 className={subtitle}>Contributions</h3>
                <div className="text-3xl font-medium text-donation">2</div>
            </div>
            <div className="flex flex-col w-full gap-y-2">
                <Payment></Payment>
                <Payment></Payment>
                <Payment></Payment>
            </div>
        </div>
    );
}
