import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import ContentCard from '../components/content/ContentCard';
import Header from '../components/Header';
import RecommendSection from '../components/users/RecommendSection';

import RSS3 from '../common/rss3';
import config from '../common/config';

const Home: NextPage = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    let slides = [
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
        'https://i.imgur.com/GdWEt4z.jpg',
    ];

    let content =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    const recommendGroups = [...Array(3)].map((_, gid) => ({
        name: 'RSS3',
        intro: 'Want to keep updated on RSS3 news? Follow any of the crew members!',
        avatarUrl: `https://http.cat/10${gid}`,
        users: [...Array(5)].map((_, uid) => ({
            username: `anniiii@${gid}-${uid}`,
            avatarUrl: `https://http.cat/${gid + 2}0${uid}`,
            bio: "CXO @ RSS3, Cat's name's Fendi" + content,
            ethAddress: `0x${gid}${uid}`,
            rns: 'anniiii',
        })),
    }));

    const init = async () => {
        if (RSS3.getLoginUser().persona || (await RSS3.reconnect())) {
            setIsLoggedIn(true);
        }
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <Header />
            {isLoggedIn ? (
                <div className="flex flex-row justify-between max-w-6xl px-2 pt-16 mx-auto gap-x-8">
                    <section className="divide-y-2 w-7/11 divide-solid divide-opacity-5 divide-primary">
                        {[...Array(2)].map((_, i) => (
                            <ContentCard
                                key={i}
                                avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                                username="Fendi"
                                content={content}
                                images={slides}
                                timeStamp={0x60de434e}
                                type="Twitter"
                            />
                        ))}
                        <div className="w-full py-8 text-sm text-center">That's all :p</div>
                    </section>
                    <section className="flex flex-col gap-4 pb-16 w-4/11 sticky self-start top-16">
                        <RecommendSection groups={recommendGroups} />
                    </section>
                </div>
            ) : (
                <div className="flex flex-col justify-start max-w-6xl px-2 pt-80 mx-auto gap-y-8 h-full">
                    <p className="font-semibold text-4xl">This is a closed beta test for Revery and RSS3 v0.3.1.</p>
                    <p className="text-xl">Please noted that your profile and data will be deleted after the test.</p>
                </div>
            )}
        </>
    );
};

export default Home;
