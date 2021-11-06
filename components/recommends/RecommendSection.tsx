import React, { useState } from 'react';
import UserCard, { UserItemProps } from './UserCard';
import GroupItem, { GroupItemProps } from './GroupItem';

interface GroupInfo extends GroupItemProps {
    intro: string;
    users: UserItemProps[];
}

interface RecommendSectionProps {
    groups: GroupInfo[];
}

const RecommendSection = ({ groups }: RecommendSectionProps) => {
    const [activeGroupId, setActiveGroupId] = useState(0);

    return (
        <div className="flex flex-col">
            <div>
                <span className="text-primary">For You</span>
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col divide-primary divide-y">
                    <div>
                        <p>{groups[activeGroupId].intro}</p>
                    </div>
                    <div>
                        {groups[activeGroupId].users.map((user) => (
                            <UserCard
                                key={user.ethAddress}
                                username={user.username}
                                avatarUrl={user.avatarUrl}
                                bio={user.bio}
                                ethAddress={user.ethAddress}
                                rns={user.rns}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col">
                    {groups.map((group, i) => (
                        <GroupItem
                            key={i}
                            name={group.name}
                            avatarUrl={group.avatarUrl}
                            isSelected={i === activeGroupId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecommendSection;
