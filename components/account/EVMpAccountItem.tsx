import React from 'react';
import { hex2rgb, hslToRgb, rgb2hex, rgbToHsl } from '../../utils/color';
import { AccountItemProps, AccountSize } from './variables';

const EVMpAccountItem = ({ size = 'sm', address = '0x0000000000000000000000000000000000000000' }: AccountItemProps) => {
    const style = {
        background: 'white',
    };
    const addr = address.replace(/^0x/, '');

    if (addr.length == 40) {
        style.background = `linear-gradient(-${(parseInt(addr.slice(0, 4), 16) % 360).toString()}deg`;
        for (let i = 0; i < 6; i++) {
            style.background += `, ${rgb2hex(
                ...hslToRgb(rgbToHsl(...hex2rgb(addr.slice(4 + i * 6, 4 + i * 6 + 6)))[0], 1, 0.86),
            )} ${i * 20}%`;
        }
        style.background += ')';
    }

    return (
        <div className={`${AccountSize.get(size)} p-1 border rounded-full border-primary`} style={style}>
            <div className="w-full h-full bg-center bg-no-repeat bg-cover bg-EVM bg-85 mix-blend-overlay" />
        </div>
    );
};

export default EVMpAccountItem;
