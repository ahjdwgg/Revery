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
    const [isHovered, setHovered] = React.useState(false);

    return (
        <div
            className="text-center w-16 cursor-pointer"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className={`animate-fade-in border rounded-full w-full h-16 flex justify-center items-center ${
                    isSelected ? 'border-primary' : isHovered ? 'border-primary border-opacity-40' : ''
                }`}
            >
                <ImageHolder imageUrl={icon || config.undefinedImageAlt} roundedClassName={'rounded-full'} size={52} />
            </div>
            <div className={'mt-1'}>
                <p className={`text-xs ${isSelected ? 'opacity-100' : 'opacity-20'}`}>{title}</p>
            </div>
        </div>
    );
};

export default GroupItem;
