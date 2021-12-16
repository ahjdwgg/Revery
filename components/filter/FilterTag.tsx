import React from 'react';
import Button from '../buttons/Button';
import { ReactNode } from 'react';

interface FilterTagProps {
    tag: string;
    isSelected: boolean;
    onClick?: (param?: any) => void;
    children?: ReactNode;
}

const FilterTag = ({ tag, isSelected, onClick }: FilterTagProps) => {
    const style = isSelected
        ? 'border-primary border-opacity-70 text-primary text-opacity-70'
        : 'border-black border-opacity-10 text-black text-opacity-70';

    return (
        <div className="animate-fade-in-up">
            <Button
                isOutlined={true}
                className={`${style} font-medium text-xs hover:text-opacity-80 py-sm px-2 undefined border hover:border-opacity-40 rounded`}
                onClick={onClick}
            >
                {tag}
            </Button>
        </div>
    );
};

export default FilterTag;
