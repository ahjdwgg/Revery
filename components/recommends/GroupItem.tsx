import React, { MouseEventHandler } from 'react';
import ImageHolder from '../ImageHolder';

export interface GroupItemProps {
    name: string;
    avatarUrl: string;
    isSelected?: boolean;
}

const GroupItem = ({ name, avatarUrl, isSelected }: GroupItemProps) => {
    return (
        <div className="text-center w-16 cursor-pointer">
            <div
                className={`border rounded-full w-full h-16 flex justify-center items-center ${
                    isSelected ? 'border-primary' : ''
                }`}
            >
                <ImageHolder imageUrl={avatarUrl} isFullRound={true} size={52} />
            </div>
            <div>
                <span className={`text-xs ${isSelected ? 'opacity-100' : 'opacity-20'}`}>{name}</span>
            </div>
        </div>
    );
};

export default GroupItem;
