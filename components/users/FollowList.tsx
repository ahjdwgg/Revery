import React from 'react';
import UserCardLoader from '../loaders/UserCardLoader';
import UserCard, { UserItems } from './UserCard';

interface FollowListProps {
    followType: string;
    followList: UserItems[];
    toUserPage: (addrOrName: string) => void;
    shouldShowLoader?: boolean;
}

const FollowList = ({ followType, followList, toUserPage, shouldShowLoader = false }: FollowListProps) => {
    return (
        <div className="flex flex-col p-3 divide-y divide-solid divide-primary divide-opacity-5 gap-3">
            <div>
                <span className="text-primary text-md font-semibold capitalize">{followType}</span>
            </div>
            <div className="flex flex-col">
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
                {shouldShowLoader && [...Array(3)].map((_, i) => <UserCardLoader key={i} />)}
            </div>
        </div>
    );
};

export default FollowList;
