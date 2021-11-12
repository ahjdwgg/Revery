import React from 'react';
import MarketTag from '../tags/MarketTag';
import ScanTag from '../tags/ScanTag';
import Trait from './Trait';

export default function NFTDetail() {
    const subtitle = 'text-lg font-medium capitalize text-nft my-2';

    return (
        <div className="flex flex-col items-start justify-start gap-5 px-5 py-4 filter">
            <h2 className="overflow-hidden text-xl font-semibold capitalize break-all overflow-ellipsis">
                Cool cat #233
            </h2>
            <div className="flex flex-row flex-wrap gap-2.5 items-center justify-start">
                <MarketTag market="rarible" />
                <ScanTag chain="Ethereum" />
            </div>
            <div>
                <h3 className={subtitle}>Description</h3>
                <div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                </div>
            </div>
            <div>
                <h3 className={subtitle}>Properties</h3>
                <div className="flex flex-row flex-wrap gap-2.5 items-center justify-start mt-3">
                    <Trait traitType="body" traitValue="blue cat skin"></Trait>
                    <Trait traitType="face" traitValue="heart"></Trait>
                    <Trait traitType="hats" traitValue="beret red"></Trait>
                </div>
            </div>
            <div>
                <h3 className={subtitle}>About</h3>
                <div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                </div>
            </div>
        </div>
    );
}
