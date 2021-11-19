import React, { useState } from 'react';
import UserCard, { UserItemProps } from './UserCard';

interface FollowListProps {
    followType: string;
    followList: UserItemProps[];
    toUserPage: (addrOrName: string) => void;
}

const FollowList = ({ followType, followList, toUserPage }: FollowListProps) => {
    return (
        <div className="flex flex-col p-3 divide-y divide-solid divide-primary divide-opacity-5 gap-3">
            <div>
                <span className="text-primary text-md font-semibold">{followType}</span>
            </div>
            <div className="flex flex-col divide-primary divide-opacity-10 divide-y">
                {followList.map((user, i) => (
                    <UserCard
                        key={i}
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
    );
};

export default FollowList;
