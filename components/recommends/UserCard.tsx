import React from 'react';
import ImageHolder from '../ImageHolder';
import LinkButton from '../buttons/LinkButton';

interface UserProps {
    username: string;
    avatarUrl: string;
    bio: string;
    ethAddress: string;
    rns: string;
}

const UserCard = ({ username, avatarUrl, bio, ethAddress, rns }: UserProps) => {
    // Setup user address
    // using rss3.bio or other things maybe
    const address = rns ? `${rns}.rss3.bio` : ethAddress;

    return (
        <div className="flex flex-row gap-2 justify-start p-4 text-left">
            <ImageHolder imageUrl={avatarUrl} isFullRound={true} size={36} />
            <section className="flex flex-1 flex-col justify-around text-body-text text-sm leading-normal">
                <div className="flex flex-row gap-2 items-center">
                    <span>{username}</span>
                    <LinkButton key={address} text={address} />
                </div>
                <div className="flex flex-row gap-2 font-medium">
                    <span>{bio}</span>
                </div>
            </section>
        </div>
    );
};

export default UserCard;
