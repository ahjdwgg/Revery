import React from 'react';
import { BiLinkAlt } from 'react-icons/bi';
import Payment from './Payment';
import { GitcoinResponse } from '../../common/types';
import style from '../../styles/content.module.css';

interface DonationDetailProps {
    detail: GitcoinResponse;
}

export default function DonationDetail({ detail }: DonationDetailProps) {
    let amounts = detail.data.txs.sort((a, b) => {
        return parseInt(b.timeStamp) - parseInt(a.timeStamp);
    });

    const subtitle = 'text-lg font-medium capitalize';

    return (
        <div className="flex flex-col items-start justify-start gap-5 filter">
            <section className="w-full">
                <h2 className="overflow-hidden text-xl font-semibold capitalize break-all overflow-ellipsis">
                    {detail.data.grant.title}
                </h2>
                <div
                    className="flex flex-row items-center justify-start gap-2 my-1 text-primary"
                    onClick={() => {
                        window.open(detail.data.grant.reference_url);
                    }}
                >
                    <BiLinkAlt />
                    <span className="flex-1 text-sm leading-normal truncate cursor-pointer">
                        {detail.data.grant.reference_url}
                    </span>
                </div>
            </section>
            <div>
                <h3 className={`${subtitle} my-2`}>Description</h3>
                <div className={`${style.content} line-clamp-5`}>
                    {detail.data.grant.description || 'No information provided by Gitcoin.'}
                </div>
            </div>
            <div className="text-primary">
                <h3 className={subtitle}>Contributions</h3>
                <div className="text-3xl font-medium">{amounts.length}</div>
            </div>
            <div className="flex flex-col w-full gap-y-2">
                {amounts.map((item, index) => (
                    <Payment donation={item} key={index} />
                ))}
            </div>
        </div>
    );
}
