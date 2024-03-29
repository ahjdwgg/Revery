import React, { useState } from 'react';
import UserCard, { UserItems } from './UserCard';
import GroupItem, { GroupItemProps } from './GroupItem';
import UserCardLoader from '../loaders/UserCardLoader';
import config from '../../common/config';
import GroupItemLoader from '../loaders/GroupItemLoader';
import GroupIntroBarLoader from '../loaders/GroupIntroBarLoader';

export interface GroupInfo extends GroupItemProps {
    key: string;
    description?: string;
}

interface RecommendSectionProps {
    groups: GroupInfo[];
    members: UserItems[];
    toGroup: (groupId: string) => void;
    toUserPage: (userId: string) => void;
    isLoadingGroups: boolean; // For skeleton screen
    isLoadingMembers: boolean; // For skeleton screen
}

const RecommendSection = ({
    groups,
    members,
    toGroup,
    toUserPage,
    isLoadingGroups,
    isLoadingMembers,
}: RecommendSectionProps) => {
    const [activeGroupId, setActiveGroupId] = useState(0);

    const setActiveGroup = (groupId: number) => {
        if (activeGroupId !== groupId) {
            toGroup(groups[groupId].key);
            setActiveGroupId(groupId);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div>
                <span className="font-semibold text-primary text-md">For You</span>
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col flex-grow divide-y-2 divide-primary-asset">
                    <div className="mt-3 mb-2.5 text-xs">
                        <p>{isLoadingGroups ? <GroupIntroBarLoader /> : groups[activeGroupId].description || ''}</p>
                    </div>
                    <div className="mt-2.5 pt-5">
                        {isLoadingMembers
                            ? [...Array(config.recommendations.userLimit)].map((_, id) => <UserCardLoader key={id} />)
                            : members.map((user) => (
                                  <UserCard
                                      key={user.ethAddress}
                                      username={user.username}
                                      avatarUrl={user.avatarUrl}
                                      bio={user.bio}
                                      ethAddress={user.ethAddress}
                                      rns={user.rns}
                                      toUserPage={toUserPage}
                                  />
                              ))}
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    {isLoadingGroups
                        ? [...Array(config.recommendations.groupLimit)].map((_, id) => <GroupItemLoader key={id} />)
                        : groups.map((group, i) => (
                              <GroupItem
                                  key={i}
                                  title={group.title}
                                  icon={group.icon}
                                  isSelected={i === activeGroupId}
                                  onClick={() => setActiveGroup(i)}
                              />
                          ))}
                </div>
            </div>
        </div>
    );
};

export default RecommendSection;
