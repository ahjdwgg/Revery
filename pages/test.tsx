import type { NextPage } from 'next';
import ContentCard from '../components/content/ContentCard';
import Button from '../components/buttons/Button';
import LinkButton from '../components/buttons/LinkButton';
import { COLORS } from '../components/buttons/variables';

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
                    like={7}
                    comment={4}
                    share={6}
                    timeStamp={0x60de434e}
                    type="Twitter"
                />
                <ContentCard
                    avatarUrl="https://i.imgur.com/GdWEt4z.jpg"
                    username="Fendi"
                    content="hello world:)"
                    like={3}
                    comment={2}
                    share={1}
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
            <div>
                <h1>
                    <b>Components Samples</b>
                </h1>
                <Button isOutlined={false} color={COLORS.account} icon={'minus'} />
                <Button isOutlined={true} color={COLORS.account} icon={'plus'} />
                <Button isOutlined={true} color={COLORS.donation} icon={'expand'} />
                <Button isOutlined={true} color={COLORS.nft} text={'Edit'} />
                <Button isOutlined={true} color={COLORS.donation} text={'Edit'} />
                <Button isOutlined={true} color={COLORS.footprint} text={'Edit'} />
                <Button isOutlined={false} color={COLORS.primary} text={'Save'} fontSize={'text-base'} width={'w-48'} />
                <Button
                    isOutlined={true}
                    color={COLORS.primary}
                    text={'Discard'}
                    fontSize={'text-base'}
                    width={'w-48'}
                />
                <Button isOutlined={false} isDisabled={true} color={COLORS.primary} text={'Edit Profile'} />
                <LinkButton text={'mypersonalsite.com'} color={COLORS.primary} />
            </div>
        </div>
    );
};

export default Test;
