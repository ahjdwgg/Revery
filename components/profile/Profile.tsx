/* eslint-disable react/no-children-prop */
import React, { ReactNode, useState, useEffect, useRef } from 'react';
import LinkButton from '../buttons/LinkButton';
import { COLORS } from '../buttons/variables';
import Button from '../buttons/Button';
import Modal from '../modal/Modal';
import FollowList from '../users/FollowList';
import ImageHolder from '../ImageHolder';
import { UserItems } from '../users/UserCard';
import config from '../../common/config';
import RSS3, { IRSS3 } from '../../common/rss3';
import RNS from '../../common/rns';
import utils from '../../common/utils';
import ModalRNS from '../modal/ModalRNS';
import ModalConnect from '../modal/ModalConnect';

interface ProfileProps {
    avatarUrl: string;
    username: string;
    rns?: string;
    link?: string;
    website?: string;
    bio: string;
    isLogin: boolean;
    isOwner: boolean;
    children?: ReactNode;
    followers: string[];
    followings: string[];
    isFollowing: boolean;
    onFollow: () => void;
    toEditProfile?: () => void;
    toExternalUserSite?: () => void;
    toRss3BioUserSite?: () => void;
    toUserPage: (addrOrName: string) => void;
}

const Profile = ({
    avatarUrl,
    username,
    rns,
    link,
    website,
    bio,
    isLogin,
    isOwner,
    children,
    followers,
    followings,
    isFollowing,
    onFollow,
    toEditProfile,
    toExternalUserSite,
    toRss3BioUserSite,
    toUserPage,
}: ProfileProps) => {
    const [modalHidden, setModalHidden] = useState(true);
    const [modalRNSHidden, setModalRNSHidden] = useState(true);
    const [followType, setFollowType] = useState<'followers' | 'followings'>('followers');

    const [foList, setFoList] = useState<{ followers: UserItems[]; followings: UserItems[] }>({
        followers: [],
        followings: [],
    });

    const isLoading = useRef<boolean>(false);

    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [currentIndex, setCurrentIndex] = useState({ followers: 0, followings: 0 });

    const [isConnectModalClosed, setConnectModalClosed] = useState(true);

    const openModal = (type: typeof followType) => {
        setFollowType(type);
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

    const openConnectModal = () => {
        setConnectModalClosed(false);
    };
    const closeConnectModal = () => {
        setConnectModalClosed(true);
    };

    const loadFoList = async (addressList: string[]) => {
        setIsLoadingMore(true);
        const curI = currentIndex[followType];
        const apiUser = RSS3.getAPIUser().persona as IRSS3;
        const userList = (await Promise.all(
            addressList
                .slice(curI, curI + config.splitPageLimits.follows)
                .map((ethAddress) => ({
                    ethAddress,
                    avatarUrl: config.undefinedImageAlt,
                    username: '',
                    bio: '',
                    rns: '',
                }))
                .map(async (user) => {
                    const profile = await apiUser.profile.get(user.ethAddress);
                    const rns = await RNS.addr2Name(user.ethAddress);
                    const { extracted } = utils.extractEmbedFields(profile.bio || '', []);
                    user.avatarUrl = profile.avatar?.[0] || config.undefinedImageAlt;
                    user.username = profile.name || user.username;
                    user.bio = extracted;
                    user.rns = rns;
                    return user;
                }),
        )) as unknown as UserItems[];
        setFoList((v) => ({
            ...v,
            [followType]: v[followType].concat(userList),
        }));
        setIsLoadingMore(false);
    };

    const loadMoreFollow = () => {
        const curI = currentIndex[followType];
        const addressList = followType === 'followers' ? followers : followings;
        if (curI < addressList.length && isLoading.current) {
            setCurrentIndex((v) => ({
                ...v,
                [followType]: v[followType] + config.splitPageLimits.follows,
            }));
        }
    };

    const shouldShowLoader = foList[followType].length < (followType === 'followers' ? followers : followings).length;

    useEffect(() => {
        if (!modalHidden && shouldShowLoader) {
            loadFoList(followType === 'followers' ? followers : followings);
        }
    }, [modalHidden, currentIndex.followers, currentIndex.followings]);

    const fixRNS = (rns: string) => {
        if (!rns.includes('.')) {
            if (!rns.endsWith(config.rns.suffix)) {
                return rns + config.rns.suffix;
            }
        }
        return rns;
    };

    const logout = () => {
        if (confirm('Are you sure you want to logout?')) {
            RSS3.disconnect();
        }
    };

    return (
        <div className="flex flex-row items-start justify-start w-full py-4 gap-x-8">
            <ImageHolder imageUrl={avatarUrl} title={username} roundedClassName={'rounded-full'} size={100} />
            <div className="flex flex-col items-start justify-start flex-1 gap-y-2">
                <div className="flex flex-row items-center gap-x-4">
                    <div className="text-2xl font-semibold">{username}</div>
                    {isOwner ? (
                        <div className="flex flex-row gap-2">
                            <Button
                                text={'Edit Profile'}
                                color={COLORS.primary}
                                isOutlined={true}
                                onClick={toEditProfile}
                            />
                            <Button icon={'logout'} color={COLORS.primary} isOutlined={true} onClick={logout} />
                        </div>
                    ) : (
                        // isLogin && (
                        <Button
                            text={isFollowing ? 'Unfollow' : 'Follow'}
                            color={COLORS.primary}
                            isOutlined={true}
                            onClick={isLogin ? onFollow : openConnectModal}
                        />
                        // )
                    )}
                </div>
                <div className="flex flex-row text-sm gap-x-8 text-primary">
                    <span className="cursor-pointer" onClick={() => openModal('followers')}>
                        <span className="font-bold">{followers.length}</span> followers
                    </span>
                    <span className="cursor-pointer" onClick={() => openModal('followings')}>
                        <span className="font-bold">{followings.length}</span> followings
                    </span>
                </div>
                <div className={`flex flex-row gap-x-2`}>
                    {!rns && isOwner ? (
                        <LinkButton
                            text={'Claim Your RNS'}
                            color={COLORS.primary}
                            onClick={() => setModalRNSHidden(false)}
                        />
                    ) : (
                        link && <LinkButton text={link} color={COLORS.primary} onClick={toRss3BioUserSite} />
                    )}
                    {website && (
                        <LinkButton text={website} color={COLORS.primary} onClick={toExternalUserSite} link={true} />
                    )}
                </div>
                <div className="text-sm leading-5 whitespace-pre-line select-none">{bio}</div>
                <div className={`${!children && 'hidden'} flex flex-row gap-x-2`}>{children}</div>
            </div>
            <Modal
                hidden={modalHidden}
                closeEvent={closeModal}
                theme={'primary'}
                size={'sm'}
                loadMorePlaceholder={<FollowList showLoader={true} />}
                isLoadingMore={isLoadingMore}
                onLoadMore={loadMoreFollow}
                title={followType}
            >
                <FollowList
                    followList={foList[followType]}
                    toUserPage={(aon) => {
                        closeModal();
                        toUserPage(aon);
                    }}
                />
            </Modal>
            <ModalRNS hidden={modalRNSHidden} closeEvent={() => setModalRNSHidden(true)} />
            <ModalConnect hidden={isConnectModalClosed} closeEvent={() => closeConnectModal()} />
        </div>
    );
};

export default Profile;
