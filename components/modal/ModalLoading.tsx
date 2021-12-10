import React from 'react';
import { BiLoaderCircle } from 'react-icons/bi';

export default function ModalLoading(props: { color: string }) {
    let { color } = props;
    return (
        <div className="flex items-center justify-center w-full h-modal">
            <BiLoaderCircle className={`w-12 h-12 animate-spin ${textColor.get(color)}`} />
        </div>
    );
}

const textColor = new Map([
    ['nft', 'text-nft'],
    ['footprint', 'text-footprint'],
    ['donation', 'text-donation'],
    ['primary', 'text-primary'],
]);
