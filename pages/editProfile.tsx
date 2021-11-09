import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { ChangeEvent, useState } from 'react';
import AccountItem from '../components/account/AccountItem';
import EVMpAccountItem from '../components/account/EVMpAccountItem';
import ContentCard from '../components/content/ContentCard';
import Profile from '../components/profile/Profile';
import AssetCard from '../components/assets/AssetCard';
import ImageHolder from '../components/ImageHolder';
import FootprintCard from '../components/assets/FootprintCard';
import RecommendSection from '../components/recommends/RecommendSection';
import Header from '../components/Header';
import Button from '../components/buttons/Button';
import LinkButton from '../components/buttons/LinkButton';
import { COLORS } from '../components/buttons/variables';
import Input from '../components/inputs/Input';

interface InputStates {
    website: string;
    bio: string;
    name1: string;
    name2: string;
}

type InputEventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

class InputSection extends React.Component<{}, InputStates> {
    constructor(props: {}) {
        super(props);
        this.state = {
            website: '',
            bio: '',
            name1: 'Joshua',
            name2: '',
        };

        this.handleChangeWebsite = this.handleChangeWebsite.bind(this);
        this.handleChangeBio = this.handleChangeBio.bind(this);
        this.handleChangeName1 = this.handleChangeName1.bind(this);
        this.handleChangeName2 = this.handleChangeName2.bind(this);
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
    handleChangeName1(event: InputEventType) {
        this.setState({
            name1: event.target.value,
        });
    }
    handleChangeName2(event: InputEventType) {
        this.setState({
            name2: event.target.value,
        });
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
                        value={this.state.name1}
                        onChange={this.handleChangeName1}
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

                <div className="flex flex-row gap-x-5 w-full justify-end">
                    <label className="w-48 text-right pt-2">Personal Website</label>
                    <Input placeholder={'Username'} isSingleLine={true} onChange={this.handleChangeName2} />
                </div>

                <div className="flex flex-row gap-x-5 w-full justify-start">
                    <label className="w-48 text-right">Accounts</label>
                    <div className="flex flex-row gap-x-2 w-full">
                        <EVMpAccountItem size="sm" address="0xd0B85A7bB6B602f63B020256654cBE73A753DFC4" />
                        <AccountItem size="sm" chain="BSC" />
                        <AccountItem size="sm" chain="Ethereum" />
                        <AccountItem size="sm" chain="Ronin" />
                        <AccountItem size="sm" chain="Misskey" />
                        <AccountItem size="sm" chain="Twitter" />
                        <EVMpAccountItem size="sm" address="0x0000000000000000000000000000000000000000" />
                    </div>
                </div>
                <div onClick={() => this.handlePrint()} className="flex flex-row gap-x-3 pl-40 justify-center">
                    <Button
                        isOutlined={false}
                        color={COLORS.primary}
                        text={'PrintState'}
                        fontSize={'text-base'}
                        width={'w-48'}
                    />
                    <Button
                        isOutlined={false}
                        color={COLORS.primary}
                        text={'Save'}
                        fontSize={'text-base'}
                        width={'w-48'}
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
                            <Button text={'Change Avatar'} color={COLORS.primary} isOutlined={true} />
                            <div className={`${!link && 'hidden'}`}>
                                {link && <LinkButton text={link} color={COLORS.primary} link={true} />}
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
