import React from 'react';
import ImageHolder from '../ImageHolder';
import LinkButton from '../buttons/LinkButton';

export interface UserItemProps {
    username: string;
    avatarUrl: string;
    bio: string;
    ethAddress: string;
    rns: string;
}

const UserCard = ({ username, avatarUrl, bio, ethAddress, rns }: UserItemProps) => {
    // Setup user address
    // using rss3.bio or other things maybe
    const address = rns ? `${rns}.rss3.bio` : ethAddress;

    return (
        <div className="flex flex-row gap-2 justify-start p-4 text-left">
            <ImageHolder imageUrl={avatarUrl} isFullRound={true} size={36} />
            <section className="flex flex-col flex-grow">
                <div className="flex flex-row">
                    <span>{username}</span>
                    <LinkButton key={address} text={address} />
                </div>
                <div className="flex flex-row">
                    <span className="flex-1 w-0 truncate">{bio}</span>
                </div>
            </section>
        </div>
    );
};

export default UserCard;
