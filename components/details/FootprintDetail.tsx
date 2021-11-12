import React from 'react';
import { BiCalendar, BiLinkAlt, BiLocationPlus } from 'react-icons/bi';
import Button from '../buttons/Button';
import { COLORS } from '../buttons/variables';

export default function FootprintDetail() {
    const subtitle = 'text-lg font-medium capitalize text-footprint my-2';

    return (
        <div className="flex flex-col items-start justify-start gap-5 px-5 py-4 filter">
            <section className="w-full">
                <div className="flex flex-row items-center gap-2">
                    <h2 className="flex-1 overflow-hidden text-xl font-semibold capitalize break-all overflow-ellipsis">
                        RSS3 Taurus ♉️️ Conference
                    </h2>
                    <Button isOutlined={false} color={COLORS.footprint} icon={'external'} width="w-8 h-8" />
                </div>
                <div className="flex flex-row items-center justify-start gap-2 my-1 text-footprint">
                    <BiLinkAlt />
                    <span className="flex-1 text-sm leading-normal truncate cursor-pointer">
                        https://www.youtube.com/channel/UCI-mQ-o0...
                    </span>
                </div>
            </section>
            <section className="w-full">
                <div className="flex flex-row items-center gap-2">
                    <BiCalendar className="text-footprint" />
                    <span className="flex-1 w-0 truncate">May 03, 2021</span>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <BiLocationPlus className="text-footprint" />
                    <span className="flex-1 w-0 truncate">NYC</span>
                </div>
            </section>
            <section>
                <h3 className={subtitle}>Description</h3>
                <div>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                </div>
            </section>
        </div>
    );
}
