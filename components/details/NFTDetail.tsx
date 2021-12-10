import React from 'react';
import MarketTag from '../tags/MarketTag';
import ScanTag from '../tags/ScanTag';
import Trait from './Trait';
import { NFT } from '../../common/types';
import style from '../../styles/content.module.css';
import { Markdown } from 'react-marked-renderer';
import { AnyObject } from 'rss3/types/extend';

interface NFTDetailProps {
    detail: AnyObject;
    market: 'opensea' | 'rarible';
}

export default function NFTDetail({ detail, market }: NFTDetailProps) {
    const subtitle = 'text-lg font-medium capitalize text-primary my-2';
    function toMarket(address: string, tokenId: string) {
        switch (market) {
            case 'opensea':
                switch (detail.chain.split('.')[0]) {
                    case 'Polygon':
                        window.open(`https://opensea.io/assets/matic/${address}/${tokenId}`);
                        break;
                    default:
                        window.open(`https://opensea.io/assets/${address}/${tokenId}`);
                        break;
                }
                break;
            case 'rarible':
                window.open(`https://rarible.com/token/${address}:${tokenId}`);
                break;
        }
    }

    function toScan(address: string, tokenId: string) {
        switch (detail.chain.split('.')[0]) {
            case 'BSC':
                window.open(`https://bscscan.com/token/${address}?a=${tokenId}`);
                break;
            case 'Ethereum':
                window.open(`https://etherscan.io/token/${address}?a=${tokenId}`);
                break;
            case 'Polygon':
                window.open(`https://polygonscan.com/token/${address}?a=${tokenId}`);
                break;
        }
    }

    return (
        <div className="flex flex-col items-start justify-start gap-5 filter">
            <h2 className="overflow-hidden text-xl font-semibold capitalize break-all overflow-ellipsis">
                {detail.name + ' #' + detail.token_id}
            </h2>
            <div className="flex flex-row flex-wrap gap-2.5 items-center justify-start">
                <MarketTag market={market} onClick={() => toMarket(detail.asset_contract?.address, detail.token_id)} />
                <ScanTag
                    chain={detail.chain.split('.')[0]}
                    onClick={() => toScan(detail.asset_contract?.address, detail.token_id)}
                />
            </div>
            {detail.description && (
                <div>
                    <h3 className={subtitle}>Description</h3>
                    <Markdown markdown={detail.description} />
                </div>
            )}
            {detail.traits && detail.traits.length > 0 && (
                <div>
                    <h3 className={subtitle}>Properties</h3>
                    <div className="flex flex-row flex-wrap gap-2.5 items-center justify-start mt-3 w-160">
                        {detail.traits.map(
                            (
                                item: { trait_type: String | null | undefined; value: String | null | undefined },
                                index: React.Key | null | undefined,
                            ) => (
                                <Trait traitType={item.trait_type} traitValue={item.value} key={index} />
                            ),
                        )}
                    </div>
                </div>
            )}
            {detail.collection?.description && (
                <div>
                    <h3 className={subtitle}>About {detail.collection?.name}</h3>
                    <Markdown markdown={detail.collection?.description} />
                </div>
            )}
        </div>
    );
}
