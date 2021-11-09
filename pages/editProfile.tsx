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

class InputSection extends React.Component<{}, InputStates> {
    constructor(props: {}) {
        super(props);
        this.state = {
            username: '',
            website: '',
            bio: '',
            accountItems: AccountItems, // this is a hard-coded placeholder array
        };

        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangeWebsite = this.handleChangeWebsite.bind(this);
        this.handleChangeBio = this.handleChangeBio.bind(this);
        this.handleChangeAccountItems = this.handleChangeAccountItems.bind(this);
    }

    handleChangeWebsite(event: InputEventType) {
        this.setState({
            website: event.target.value,
        });
    }
    handleChangeBio(event: InputEventType) {
        this.setState({
            bio: event.target.value,
        });
    }
    handleChangeUsername(event: InputEventType) {
        this.setState({
            username: event.target.value,
        });
    }
    handleChangeAccountItems() {
        console.log(this.state.accountItems);
    }
    handlePrint() {
        console.log(this.state);
    }

    render() {
        return (
            <section className="flex flex-col w-4/5 gap-y-5">
                <div className="flex flex-row gap-x-5 w-full justify-end">
                    <label className="w-48 text-right pt-2">Username</label>
                    <Input
                        placeholder={'Username'}
                        isSingleLine={true}
                        value={this.state.username}
                        onChange={this.handleChangeUsername}
                    />
                </div>
                <div className="flex flex-row gap-x-5 w-full justify-end">
                    <label className="w-48 text-right pt-2">Personal Website</label>
                    <Input
                        placeholder={'Personal Website'}
                        isSingleLine={true}
                        prefix={'https://'}
                        onChange={this.handleChangeWebsite}
                    />
                </div>

                <div className="flex flex-row gap-x-5 w-full justify-end">
                    <label className="w-48 text-right pt-2">Bio</label>
                    <Input placeholder={'Bio'} isSingleLine={false} onChange={this.handleChangeBio} />
                </div>

                <div className="flex flex-row gap-x-5 w-full justify-start">
                    <label className="w-48 text-right">Accounts</label>
                    <div className="flex flex-row gap-x-2 w-full">
                        {this.state.accountItems.map((item) => {
                            if (item.type == 'default') {
                                return <AccountItem size="sm" chain={item.value} />;
                            } else {
                                return <EVMpAccountItem size="sm" address={item.value} />;
                            }
                        })}
                    </div>
                </div>
                <div className="flex flex-row gap-x-3 pl-40 justify-center">
                    <Button
                        isOutlined={true}
                        color={COLORS.primary}
                        text={'Discard'}
                        fontSize={'text-base'}
                        width={'w-48'}
                    />
                    <Button
                        isOutlined={false}
                        color={COLORS.primary}
                        text={'Save'}
                        fontSize={'text-base'}
                        width={'w-48'}
                        onClick={() => this.handlePrint()}
                    />
                </div>
            </section>
        );
    }
}

const EditProfile: NextPage = () => {
    const [avatarUrl, setAvatarUrl] = useState('https://i.imgur.com/GdWEt4z.jpg');
    const [username, setUsername] = useState('Fendi');
    const [link, setLink] = useState('Fendi.github.io');

    const handleChangeAvatar = () => {
        console.log('Change Avatar');
        // setAvatarUrl(value)
    };

    const handleLinkOnClieck = () => {
        console.log('Link Clicked');
        // setLink(value)
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
                                        onClick={handleLinkOnClieck}
                                        color={COLORS.primary}
                                        link={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <InputSection />
                </section>
            </div>
        </div>
    );
};

export default EditProfile;
