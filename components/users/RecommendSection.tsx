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
        <div className="flex flex-col p-3">
            <div>
                <span className="text-primary text-md font-semibold">For You</span>
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col divide-primary divide-opacity-10 divide-y">
                    <div className="mt-3 mb-2.5 text-xs">
                        <p>{groups[activeGroupId].intro}</p>
                    </div>
                    <div className="mt-2.5 pt-5">
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
                <div className="flex flex-col gap-5">
                    {groups.map((group, i) => (
                        <GroupItem
                            key={i}
                            name={group.name}
                            avatarUrl={group.avatarUrl}
                            isSelected={i === activeGroupId}
                            onClick={() => setActiveGroupId(i)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecommendSection;
