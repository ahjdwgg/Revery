/* eslint-disable react/no-children-prop */
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import LinkButton from '../buttons/LinkButton';
import { COLORS } from '../buttons/variables';
import Button from '../buttons/Button';
import Modal from '../modal/Modal';
import FollowList from '../users/FollowList';
import ImageHolder from '../ImageHolder';
import { UserItemProps } from '../users/UserCard';
import config from '../../common/config';
import RSS3, { IRSS3 } from '../../common/rss3';
import RNS from '../../common/rns';
import utils from '../../common/utils';
import { useRouter } from 'next/router';
interface ProfileProps {
    avatarUrl: string;
    username: string;
    rns?: string;
    link?: string;
    bio: string;
    isOwner: boolean;
    children?: ReactNode;
    followers: string[];
    followings: string[];
    toEditProfile?: () => void;
    toExternalUserSite?: () => void;
    toUserPage: (addrOrName: string) => void;
}

const Profile = ({
    avatarUrl,
    username,
    rns,
    link,
    bio,
    isOwner,
    children,
    followers,
    followings,
    toEditProfile,
    toExternalUserSite,
    toUserPage,
}: ProfileProps) => {
    const router = useRouter();

    const [modalHidden, setModalHidden] = useState(true);
    const [followType, setFollowType] = useState('');

    const [foList, setFoList] = useState<UserItemProps[]>([]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isLoading = useRef<boolean>(false);

    const openModal = () => {
        document.body.style.overflow = 'hidden';
        isLoading.current = true;
        setModalHidden(false);
    };

    const closeModal = () => {
        document.body.style.overflow = '';
        isLoading.current = false;
        setModalHidden(true);
        // setFoList([]);
    };

    const loadFoList = (addressList: string[]) => {
        const userList = addressList.map((ethAddress) => ({
            ethAddress,
            avatarUrl: config.undefinedImageAlt,
            username: '',
            bio: '',
            rns: '',
        }));
        setFoList(userList);
        setTimeout(async () => {
            const apiUser = RSS3.getAPIUser().persona as IRSS3;
            const len = userList.length;
            for (let i = 0; i < len; i++) {
                if (isLoading.current) {
                    const user = userList[i];
                    const profile = await apiUser.profile.get(user.ethAddress);
                    const rns = await RNS.addr2Name(user.ethAddress);
                    const { extracted } = utils.extractEmbedFields(profile.bio || '', []);
                    user.avatarUrl = profile.avatar?.[0] || config.undefinedImageAlt;
                    user.username = profile.name || user.username;
                    user.bio = extracted;
                    user.rns = rns;
                    setFoList([...userList]); // Force change address fore reload
                }
            }
        }, 0);
    };

    const openFollowings = () => {
        setFollowType('Followings');
        loadFoList(followings);
        openModal();
    };

    const openFollowers = () => {
        setFollowType('Followers');
        loadFoList(followers);
        openModal();
    };

    const logout = () => {
        RSS3.disconnect();
        setIsLoggedIn(false);
        reloadPage();
    };

    const reloadPage = () => {
        router.reload();
    };

    return (
        <div className="flex flex-row items-start justify-start w-full py-4 gap-x-8">
            <ImageHolder imageUrl={avatarUrl} title={username} isFullRound={true} size={100} />
            <div className="flex flex-col items-start justify-start flex-1 gap-y-2">
                <div className="flex flex-row items-center gap-x-4">
                    <div className="text-2xl font-semibold">{username}</div>
                    {isOwner && (
                        <div className="flex flex-row gap-2">
                            <Button
                                text={'Edit Profile'}
                                color={COLORS.primary}
                                isOutlined={true}
                                onClick={toEditProfile}
                            />
                            <Button isOutlined={true} color={COLORS.primary} icon={'logout'} onClick={logout} />
                        </div>
                    )}
                </div>
                <div className="flex flex-row text-sm gap-x-8 text-primary">
                    <span className="cursor-pointer" onClick={openFollowers}>
                        <span className="font-bold">{followers.length}</span> followers
                    </span>
                    <span className="cursor-pointer" onClick={openFollowings}>
                        <span className="font-bold">{followings.length}</span> followings
                    </span>
                </div>
                <div className={`flex flex-row gap-x-2 ${!(rns || link) && 'hidden'}`}>
                    {rns && <LinkButton text={rns} color={COLORS.primary} />}
                    {link && <LinkButton text={link} color={COLORS.primary} onClick={toExternalUserSite} link={true} />}
                </div>
                <div className="text-sm leading-5 whitespace-pre-line select-none">{bio}</div>
                <div className={`${!children && 'hidden'} flex flex-row gap-x-2`}>{children}</div>
            </div>
            <Modal hidden={modalHidden} closeEvent={closeModal} theme={'primary'} size={'sm'} isCenter={false}>
                <FollowList
                    followType={followType}
                    followList={foList}
                    toUserPage={(aon) => {
                        closeModal();
                        toUserPage(aon);
                    }}
                />
            </Modal>
        </div>
    );
};

export default Profile;
