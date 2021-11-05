import EmblaCarousel from '../components/content/EmblaCarousel';
import type { NextPage } from 'next';
import Image from 'next/image';
import ContentCard from '../components/content/ContentCard';

function getRandomNumber() {
    return Math.round(Math.random() * 100) % 13;
}

const Test: NextPage = () => {
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

    return (
        <div className="flex flex-col max-w-lg m-auto">
            <h1 className="mt-4 font-bold text-center">Test Page</h1>
            <section className="divide-y-2 divide-solid divide-opacity-5 divide-primary">
                <ContentCard
                    avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                    username="Fendi"
                    content="hello world:)"
                    images={slides}
                    like={getRandomNumber()}
                    comment={getRandomNumber()}
                    share={getRandomNumber()}
                    timeStamp={0x60de434e}
                    type="Twitter"
                />
                <ContentCard
                    avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                    username="Fendi"
                    content="hello world:)"
                    like={getRandomNumber()}
                    comment={getRandomNumber()}
                    share={getRandomNumber()}
                    timeStamp={0x60de1fce}
                    type="Misskey"
                />
                <ContentCard
                    avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                    username="Fendi"
                    content={content}
                    timeStamp={0x60de43ce}
                    type="Mirror-XYZ"
                />
                <ContentCard
                    avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                    username="Fendi"
                    content={content}
                    timeStamp={0x60de41ce}
                    type="Arweave"
                />
            </section>
        </div>
    );
};

export default Test;
