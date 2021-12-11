import React from 'react';
import { BiCalendar, BiLinkAlt, BiLocationPlus } from 'react-icons/bi';
import { AnyObject } from 'rss3/types/extend';
import { formatDate } from '../../common/timeStamp';
import { POAP } from '../../common/types';
import Button from '../buttons/Button';
import { COLORS } from '../buttons/variables';

interface FootprintDetailProps {
    detail: AnyObject;
}

function getDate(detail: AnyObject): string {
    return (
        detail.start_date + (detail.end_date && detail.end_date !== detail.start_date ? ` ~ ${detail.end_date}` : '')
    );
}

export default function FootprintDetail({ detail }: FootprintDetailProps) {
    const subtitle = 'text-lg font-medium capitalize text-primary my-2';

    return (
        <div className="flex flex-col items-start justify-start gap-5 px-5 py-4 filter">
            <section className="w-full">
                <div className="flex flex-row items-center gap-2">
                    <h2 className="flex-1 overflow-hidden text-xl font-semibold capitalize break-all overflow-ellipsis">
                        {detail.name}
                    </h2>
                    <Button
                        isOutlined={false}
                        color={COLORS.primary}
                        icon={'external'}
                        width="w-8"
                        height="h-8"
                        onClick={() => {
                            window.open(detail.event_url);
                        }}
                    />
                </div>
                {detail.event_url && (
                    <div className="flex flex-row items-center justify-start gap-2 my-1 text-primary">
                        <BiLinkAlt />
                        <span className="flex-1 text-sm leading-normal truncate">{detail.event_url}</span>
                    </div>
                )}
            </section>
            <section className="w-full">
                <div className="flex flex-row items-center gap-2">
                    <BiCalendar className="text-primary" />
                    <span className="flex-1 w-0 truncate">{getDate(detail)}</span>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <BiLocationPlus className="text-primary" />
                    <span className="flex-1 w-0 truncate">{detail.city || detail.country || 'Metaverse'}</span>
                </div>
            </section>
            {detail.description && (
                <section>
                    <h3 className={subtitle}>Description</h3>
                    <p>{detail.description}</p>
                </section>
            )}
        </div>
    );
}
