import React, { MouseEventHandler } from 'react';
import ImageHolder from '../ImageHolder';
import config from '../../common/config';

export interface GroupItemProps {
    title: string;
    icon?: string;
    isSelected?: boolean;
    onClick?: () => void;
}

const GroupItem = ({ title, icon, isSelected, onClick }: GroupItemProps) => {
    return (
        <div className="text-center w-16 cursor-pointer" onClick={onClick}>
            <div
                className={`border rounded-full w-full h-16 flex justify-center items-center ${
                    isSelected ? 'border-primary' : ''
                }`}
            >
                <ImageHolder imageUrl={icon || config.undefinedImageAlt} isFullRound={true} size={52} />
            </div>
            <div>
                <span className={`text-xs ${isSelected ? 'opacity-100' : 'opacity-20'}`}>{title}</span>
            </div>
        </div>
    );
};

export default GroupItem;
