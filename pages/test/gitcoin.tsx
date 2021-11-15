import React from 'react';
import GitcoinDetail from '../../components/details/GitcoinDetail';

export default function gitcoin() {
    const ImgStyle = {
        backgroundImage: `url(https://i.imgur.com/GdWEt4z.jpg)`,
    };

    return (
        <div className="flex flex-col max-w-screen-sm py-12 m-auto gap-y-4">
            <div className="w-full bg-center bg-no-repeat bg-cover rounded aspect-w-1 aspect-h-1" style={ImgStyle} />
            <GitcoinDetail />
        </div>
    );
}
