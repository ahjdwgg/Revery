/* eslint-disable react/no-children-prop */
import React, { ReactNode, useState, useEffect } from 'react';
import Image from 'next/image';
import LinkButton from '../buttons/LinkButton';
import { COLORS } from '../buttons/variables';
import Button from '../buttons/Button';
import Modal from '../modal/Modal';
import FollowList from '../users/FollowList';
import ImageHolder from '../ImageHolder';
import UserCard, { UserItemProps } from '../users/UserCard';

interface ProfileProps {
    avatarUrl: string;
    username: string;
    followers: number;
    followings: number;
    rns?: string;
    link?: string;
    bio: string;
    isOwner: boolean;
    children?: ReactNode;
    toEditProfile?: () => void;
    followerList: UserItemProps[];
    followingList: UserItemProps[];
}

const Profile = ({
    avatarUrl,
    username,
    followers,
    followings,
    rns,
    link,
    bio,
    isOwner,
    children,
    toEditProfile,
    followerList,
    followingList,
}: ProfileProps) => {
    const [modalHidden, setModalHidden] = useState(true);
    const [followType, setFollowType] = useState('');

    const openModal = () => {
        setModalHidden(false);
    };

    const closeModal = () => {
        setModalHidden(true);
    };

    const openFollowings = () => {
        setFollowType('followings');
        openModal();
    };

    const openFollowers = () => {
        setFollowType('followers');
        openModal();
    };

    return (
        <div className="flex flex-row items-start justify-start w-full py-4 gap-x-8">
            <ImageHolder imageUrl={avatarUrl} title={username} isFullRound={true} size={100} />
            <div className="flex flex-col items-start justify-start flex-1 gap-y-2">
                <div className="flex flex-row items-center gap-x-4">
                    <div className="text-2xl font-semibold">{username}</div>
                    {isOwner && (
                        <Button
                            text={'Edit Profile'}
                            color={COLORS.primary}
                            isOutlined={true}
                            onClick={toEditProfile}
                        />
                    )}
                </div>
                <div className="flex flex-row text-sm gap-x-8 text-primary">
                    <span className="cursor-pointer" onClick={openFollowers}>
                        <span className="font-bold">{followers}</span> followers
                    </span>
                    <span className="cursor-pointer" onClick={openFollowings}>
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
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} size={'sm'} isCenter={false}>
                <FollowList
                    followType={followType}
                    followList={followType === 'followings' ? followingList : followerList}
                />
            </Modal>
        </div>
    );
};

export default Profile;
