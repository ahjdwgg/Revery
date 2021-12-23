import React from 'react';
import UserCardLoader from '../loaders/UserCardLoader';
import UserCard, { UserItems } from './UserCard';

interface FollowListProps {
    followList?: UserItems[];
    toUserPage?: (addrOrName: string) => void;
    showLoader?: boolean | number;
}

const FollowList = ({ followList, toUserPage, showLoader = false }: FollowListProps) => {
    return (
        <div className="flex flex-col p-3 divide-y divide-solid divide-primary divide-opacity-5 gap-3">
            <div className="flex flex-col px-2">
                {followList?.map((user, i) => (
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
                {showLoader &&
                    [...Array(typeof showLoader === 'number' ? showLoader : 3)].map((_, i) => (
                        <UserCardLoader key={i} />
                    ))}
            </div>
        </div>
    );
};

export default FollowList;
