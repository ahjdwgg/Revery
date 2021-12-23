import React from 'react';
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
        <div className="p-3 animate-fade-in-up">
            <div>
                <span className="font-semibold text-primary text-md">+ Filter</span>
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
