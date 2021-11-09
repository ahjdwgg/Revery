import type { NextPage } from 'next';
import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react';
import AccountItem from '../components/account/AccountItem';
import EVMpAccountItem from '../components/account/EVMpAccountItem';
import Header from '../components/Header';
import Button from '../components/buttons/Button';
import LinkButton from '../components/buttons/LinkButton';
import { COLORS } from '../components/buttons/variables';
import Input from '../components/inputs/Input';

const AccountItems = [
    {
        type: 'evmp',
        value: '0xd0B85A7bB6B602f63B020256654cBE73A753DFC4',
    },
    {
        type: 'default',
        value: 'BSC',
    },
    {
        type: 'default',
        value: 'Ethereum',
    },
    {
        type: 'default',
        value: 'Ronin',
    },
    {
        type: 'default',
        value: 'Misskey',
    },
    {
        type: 'default',
        value: 'Twitter',
    },
    {
        type: 'evmp',
        value: '0x0000000000000000000000000000000000000000',
    },
];

interface AccountItemInterface {
    type: string;
    value: string;
}

interface InputStates {
    username: string;
    website: string;
    bio: string;
    accountItems: AccountItemInterface[];
}

type InputEventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const EditProfile: NextPage = () => {
    const [avatarUrl, setAvatarUrl] = useState('https://i.imgur.com/GdWEt4z.jpg');
    const [link, setLink] = useState<string>('Fendi.github.io'); // this is a hard-coded placeholder link

    const [username, setUsername] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [website, setWebsite] = useState<string>('');
    const [accountItems, setAccountItems] = useState<AccountItemInterface[]>(AccountItems); // this is a hard-coded placeholder array

    const handleChangeAvatar = () => {
        console.log('Change Avatar');
        // setAvatarUrl(value)
    };

    const handleLinkOnClick = () => {
        console.log('Link Clicked');
        // setLink(value)
    };

    const handleChangeWebsite = (event: InputEventType) => {
        setWebsite(event.target.value);
    };

    const handleChangeBio = (event: InputEventType) => {
        setBio(event.target.value);
    };

    const handleChangeUsername = (event: InputEventType) => {
        setUsername(event.target.value);
    };

    const handleChangeAccountItems = () => {
        console.log(accountItems);
    };

    const handleEdit = () => {
        console.log('Edit Clicked');
    };

    const handleExpand = () => {
        console.log('Expand Clicked');
    };

    const handleDiscard = () => {
        console.log('Discard Clicked');
    };

    const handleSave = () => {
        console.log({
            username: username,
            bio: bio,
            website: website,
        });
    };

    return (
        <div>
            <Header>
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Open+Sans" />
            </Header>
            <div className="pt-12 md:pt-16 flex flex-col max-w-5xl m-auto">
                <h1 className="mt-4 font-bold text-left text-primary text-lg">Edit Profile</h1>
                <section className="flex flex-col w-full items-center pt-10">
                    <div className="flex flex-row pb-5 pl-14 w-4/5 gap-x-3 justify-start items-end">
                        <Image src={avatarUrl} alt={username} width={100} height={100} className="rounded-full" />
                        <div className="flex flex-col gap-y-5">
                            <Button
                                text={'Change Avatar'}
                                onClick={handleChangeAvatar}
                                color={COLORS.primary}
                                isOutlined={true}
                            />
                            <div className={`${!link && 'hidden'}`}>
                                {link && (
                                    <LinkButton
                                        text={link}
                                        onClick={handleLinkOnClick}
                                        color={COLORS.primary}
                                        link={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <section className="flex flex-col w-4/5 gap-y-5">
                        <div className="flex flex-row gap-x-5 w-full justify-end">
                            <label className="w-48 text-right pt-2">Username</label>
                            <Input
                                placeholder={'Username'}
                                isSingleLine={true}
                                value={username}
                                onChange={handleChangeUsername}
                            />
                        </div>
                        <div className="flex flex-row gap-x-5 w-full justify-end">
                            <label className="w-48 text-right pt-2">Personal Website</label>
                            <Input
                                placeholder={'Personal Website'}
                                isSingleLine={true}
                                prefix={'https://'}
                                onChange={handleChangeWebsite}
                            />
                        </div>

                        <div className="flex flex-row gap-x-5 w-full justify-end">
                            <label className="w-48 text-right pt-2">Bio</label>
                            <Input placeholder={'Bio'} isSingleLine={false} onChange={handleChangeBio} />
                        </div>

                        <div className="flex flex-row gap-x-5 w-full justify-start">
                            <label className="w-48 text-right">Accounts</label>
                            <div className="flex flex-row gap-x-2 w-4/5">
                                {accountItems.map((item) => {
                                    if (item.type == 'default') {
                                        return <AccountItem size="sm" chain={item.value} />;
                                    } else {
                                        return <EVMpAccountItem size="sm" address={item.value} />;
                                    }
                                })}
                            </div>
                            <div className="flex flex-row">
                                <div>
                                    <Button
                                        key="edit"
                                        color={COLORS.primary}
                                        text="Edit"
                                        onClick={handleEdit}
                                        isOutlined={true}
                                        isDisabled={false}
                                    />
                                </div>
                                <div className="ml-2">
                                    <Button
                                        key="expand"
                                        color={COLORS.primary}
                                        icon="expand"
                                        onClick={handleExpand}
                                        isOutlined={true}
                                        isDisabled={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-x-3 pl-40 justify-center">
                            <Button
                                isOutlined={true}
                                color={COLORS.primary}
                                text={'Discard'}
                                fontSize={'text-base'}
                                width={'w-48'}
                                onClick={() => handleDiscard()}
                            />
                            <Button
                                isOutlined={false}
                                color={COLORS.primary}
                                text={'Save'}
                                fontSize={'text-base'}
                                width={'w-48'}
                                onClick={() => handleSave()}
                            />
                        </div>
                    </section>
                </section>
            </div>
        </div>
    );
};

export default EditProfile;
