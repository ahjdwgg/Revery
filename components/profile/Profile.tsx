import React, { ReactNode } from 'react';
import Image from 'next/image';
import LinkButton from '../buttons/LinkButton';
import { COLORS } from '../buttons/variables';
import Button from '../buttons/Button';

interface ProfileProps {
    avatarUrl: string;
    username: string;
    followers: number;
    followings: number;
    rns?: string;
    link?: string;
    bio: string;
    children?: ReactNode;
}

const Profile = ({ avatarUrl, username, followers, followings, rns, link, bio, children }: ProfileProps) => {
    return (
        <div className="flex flex-row items-start justify-start w-full py-4 gap-x-8">
            <Image src={avatarUrl} alt={username} width={100} height={100} className="rounded-full" />
            <div className="flex flex-col items-start justify-start flex-1 gap-y-2">
                <div className="flex flex-row items-center gap-x-4">
                    <div className="text-2xl font-semibold">{username}</div>
                    <Button text={'Edit Profile'} color={COLORS.primary} isOutlined={true} />
                </div>
                <div className="flex flex-row text-sm gap-x-8 text-primary">
                    <span className="cursor-pointer">
                        <span className="font-bold">{followers}</span> followers
                    </span>
                    <span className="cursor-pointer">
                        <span className="font-bold">{followings}</span> followings
                    </span>
                </div>
                <div className={`flex flex-row gap-x-2 ${!(rns || link) && 'hidden'}`}>
                    {rns && <LinkButton text={rns} color={COLORS.primary} />}
                    {link && <LinkButton text={link} color={COLORS.primary} link={true} />}
                </div>
                <div className="text-sm leading-5 whitespace-pre-line select-none">{bio}</div>
                <div className={`${!children && 'hidden'} flex flex-row gap-x-2`}>{children}</div>
            </div>
        </div>
    );
};

export default Profile;
