import React, { MouseEventHandler } from 'react';
import ImageHolder from '../ImageHolder';

export interface GroupItemProps {
    name: string;
    avatarUrl: string;
    isSelected?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

class GroupItem extends React.Component<GroupItemProps> {
    constructor(props: GroupItemProps) {
        super(props);
    }

    render() {
        return (
            <div className="text-center w-16 cursor-pointer" onClick={this.props.onClick}>
                <div
                    className={`border rounded-full w-full h-16 flex justify-center items-center ${
                        this.props.isSelected ? 'border-primary' : ''
                    }`}
                >
                    <ImageHolder imageUrl={this.props.avatarUrl} isFullRound={true} size={52} />
                </div>
                <div>
                    <span className={`text-xs ${this.props.isSelected ? 'opacity-100' : 'opacity-20'}`}>
                        {this.props.name}
                    </span>
                </div>
            </div>
        );
    }
}

export default GroupItem;
