import React, { useState } from 'react';
import FilterTag from './FilterTag';

interface FilterSectionProps {
    tagList: string[];
}

const FilterSection = ({ tagList }: FilterSectionProps) => {
    const [isSelected, setSelected] = useState(tagList[0]);

    const selectTag = (tag: string) => {
        setSelected(tag);
        console.log(tag);
    };

    return (
        <div className="animate-fade-in-up flex flex-col p-3 w-full">
            <div>
                <span className="text-primary text-md font-semibold">+ Filter</span>
            </div>
            <div className="flex flex-wrap w-full gap-2 py-3">
                {tagList.map((tag) => (
                    <FilterTag key={tag} tag={tag} isSelected={isSelected === tag} onClick={() => selectTag(tag)} />
                ))}
            </div>
        </div>
    );
};

export default FilterSection;
