import React from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

export default function ModalLoading(props: { color: string }) {
    let { color } = props;
    return (
        <div className="flex items-center justify-center w-full h-modal">
            <BiLoaderAlt className={`w-12 h-12 animate-spin ${textColor.get(color)} opacity-50`} />
        </div>
    );
}

const textColor = new Map([
    ['account', 'text-primary-asset'],
    ['nft', 'text-primary-asset'],
    ['footprint', 'text-primary-asset'],
    ['donation', 'text-primary-asset'],
    ['primary', 'text-primary-asset'],
]);
