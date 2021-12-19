import React, { useEffect } from 'react';
import FilterTag from './FilterTag';

interface FilterSectionProps {
    filterTagActiveMap: Map<string, boolean>;
    getFilteredContent: (param?: any) => void; // parent callback
}

export const mapToArray = (map: Map<any, any>) => {
    return Array.from(map, ([key, value]) => ({ key, value }));
};

const FilterSection = ({ filterTagActiveMap, getFilteredContent }: FilterSectionProps) => {
    const selectTag = (tag: string) => {
        filterTagActiveMap.set(tag, !filterTagActiveMap.get(tag));
        getFilteredContent(filterTagActiveMap);
    };

    return (
        <div className="animate-fade-in-up flex flex-col p-3 w-full">
            <div>
                <span className="text-primary text-md font-semibold">+ Filter</span>
            </div>
            <div className="flex flex-wrap w-full gap-2 py-3">
                {mapToArray(filterTagActiveMap).map((item) => {
                    return (
                        <FilterTag
                            key={item.key}
                            tag={item.key}
                            isActive={item.value}
                            onClick={() => selectTag(item.key)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default FilterSection;
