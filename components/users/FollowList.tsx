import React, { useState } from 'react';
import UserCard, { UserItemProps } from './UserCard';

interface FollowListProps {
    followType: string;
    followList: UserItemProps[];
}

const FollowList = ({ followType, followList }: FollowListProps) => {
    return (
        <div className="flex flex-col p-3">
            <div>
                <span className="text-primary text-md font-semibold">{followType}</span>
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col divide-primary divide-opacity-10 divide-y">
                    <div className="mt-2.5 pt-5">
                        {followList.map((user) => (
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
            </div>
        </div>
    );
};

export default FollowList;
