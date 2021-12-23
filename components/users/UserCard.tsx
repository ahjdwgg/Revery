import React, { useEffect, useState } from 'react';
import ImageHolder from '../ImageHolder';
import LinkButton from '../buttons/LinkButton';
import { BiUser, BiUserCheck, BiUserPlus } from 'react-icons/bi';
import RSS3 from '../../common/rss3';
export interface UserItems {
    username: string;
    avatarUrl: string;
    bio: string;
    ethAddress: string;
    rns: string;
}

interface UserItemProps extends UserItems {
    toUserPage?: (addrOrName: string) => void;
}

const UserCard = ({ username, avatarUrl, bio, ethAddress, rns, toUserPage }: UserItemProps) => {
    // Setup user address
    // using rss3.bio or other things maybe
    const address = rns ? `${rns}` : `${ethAddress.slice(0, 6)}...${ethAddress.slice(-4)}`;
    const checkFollowed = RSS3.checkIsFollowing(ethAddress);
    const isLoginUser = RSS3.checkIsLoginUser(ethAddress);
    const [isAvatarFullRounded, setIsAvatarFullRounded] = React.useState(true);
    const [isFollowed, setFollowed] = useState(checkFollowed);

    const handleFollow = () => {
        RSS3.follow(ethAddress);
        setFollowed(true);
    };

    const handleUnfollow = () => {
        RSS3.unfollow(ethAddress);
        setFollowed(false);
    };
    // useEffect(()=>{

    //     setFollowed(RSS3.checkIsFollowing(address));
    // },[isFollowed])
    return (
        <div
            className={`flex flex-row gap-2 justify-start py-2 bg-transparent ${
                toUserPage ? 'cursor-pointer' : ''
            } bg-white transition-all duration-100 ease-in-out`}
            onMouseEnter={() => setIsAvatarFullRounded(false)}
            onMouseLeave={() => setIsAvatarFullRounded(true)}
        >
            <section
                className="animate-fade-in flex flex-row items-center flex-shrink-0 h-10 w-10"
                onClick={() => {
                    if (toUserPage) {
                        toUserPage(rns || ethAddress);
                    }
                }}
            >
                <ImageHolder
                    imageUrl={avatarUrl}
                    roundedClassName={isAvatarFullRounded ? 'rounded-half' : 'rounded-xl'}
                    size={36}
                />
            </section>
            <section
                className="animate-fade-in flex flex-col flex-grow"
                onClick={() => {
                    if (toUserPage) {
                        toUserPage(rns || ethAddress);
                    }
                }}
            >
                <div className="flex flex-row items-center gap-1.5">
                    <span
                        className={`flex-1 w-0 truncate max-w-max ${
                            isAvatarFullRounded ? 'font-semibold tracking-normal' : 'font-bold tracking-tight'
                        } text-sm`}
                    >
                        {username}
                    </span>
                    <LinkButton key={address} text={address} />
                </div>
                <div className="flex flex-row">
                    <span className="flex-1 w-0 truncate text-xs leading-5">{bio}</span>
                </div>
            </section>
            <section className={`animate-fade-in flex flex-row items-center text-lg`}>
                {isLoginUser ? (
                    <BiUser
                        className="text-primary text-opacity-20"
                        onClick={() => {
                            if (toUserPage) {
                                toUserPage(rns || ethAddress);
                            }
                        }}
                    />
                ) : isFollowed ? (
                    <BiUserCheck className="text-black text-opacity-50" onClick={handleUnfollow} />
                ) : (
                    <BiUserPlus className="text-primary text-opacity-50" onClick={handleFollow} />
                )}
            </section>
        </div>
    );
};

export default UserCard;
