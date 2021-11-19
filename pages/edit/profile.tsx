import type { NextPage } from 'next';
import React, { ChangeEvent, useEffect, useState } from 'react';
import AccountItem from '../../components/accounts/AccountItem';
import EVMpAccountItem from '../../components/accounts/EVMpAccountItem';
import Header from '../../components/Header';
import Button from '../../components/buttons/Button';
import LinkButton from '../../components/buttons/LinkButton';
import { COLORS } from '../../components/buttons/variables';
import Input from '../../components/inputs/Input';
import ImageHolder from '../../components/ImageHolder';
import config from '../../common/config';
import RSS3, { IRSS3 } from '../../common/rss3';
import utils from '../../common/utils';
import { RSS3Account } from 'rss3-next/types/rss3';
import Modal from '../../components/modal/Modal';
import { useRouter } from 'next/router';

interface AccountItemInterface {
    type: string;
    value: string;
}

type InputEventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const Profile: NextPage = () => {
    const router = useRouter();
    const loginUser = RSS3.getLoginUser();

    const [avatarUrl, setAvatarUrl] = useState(RSS3.getLoginUser().profile?.avatar?.[0] || config.undefinedImageAlt);
    const [link, setLink] = useState<string>('');

    const [username, setUsername] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [website, setWebsite] = useState<string>('');

    const [accountItems, setAccountItems] = useState<RSS3Account[]>([]);

    const [notice, setNotice] = useState('');
    const [isShowingNotice, setIsShowingNotice] = useState(false);

    const [isEdited, setIsEdited] = useState(false);
    const [saveBtnDisabled, setSaveBtnDisabled] = useState<boolean>(false);
    const [isProfileSaved, setIsProfileSaved] = useState<boolean>(false);

    const showNotice = (notice: string, cb?: () => void) => {
        setNotice(notice);
        setIsShowingNotice(true);
    };

    const showOversizeNotice = (field: string) => {
        showNotice(`${field} cannot be longer than ${config.fieldMaxLength} chars`);
    };

    const handleChangeAvatar = () => {
        showNotice('You can edit your Avatar at rss3.bio');
    };

    const handleLinkOnClick = () => {
        console.log('Link Clicked');
        // setLink(value)
    };

    const handleChangeWebsite = (event: InputEventType) => {
        setWebsite(event.target.value);
        setIsEdited(true);
    };

    const handleChangeBio = (event: InputEventType) => {
        setBio(event.target.value);
        setIsEdited(true);
    };

    const handleChangeUsername = (event: InputEventType) => {
        setUsername(event.target.value);
        setIsEdited(true);
    };

    const handleChangeAccountItems = () => {
        console.log(accountItems);
    };

    const handleEdit = () => {
        showNotice('You can change your Accounts at rss3.bio');
    };

    const handleExpand = () => {
        if (isEdited) {
            showNotice('Profile changed, you may need to save before view your accounts. For safety concern.');
        } else {
            toListPage('account');
        }
    };

    const handleDiscard = () => {
        setIsEdited(false);
        back();
    };

    const init = async () => {
        const profile = loginUser.profile;
        const { extracted, fieldsMatch } = utils.extractEmbedFields(profile?.bio || '', ['SITE']);

        setAvatarUrl(profile?.avatar?.[0] || avatarUrl);
        setUsername(profile?.name || '');
        setBio(extracted);
        setWebsite(fieldsMatch?.['SITE'] || '');
        setLink(loginUser.name);

        await RSS3.setPageOwner(loginUser.address);
        const { listed } = await utils.initAccounts();
        setAccountItems(
            [
                {
                    platform: 'EVM+',
                    identity: RSS3.getLoginUser().address,
                },
            ].concat(listed),
        );
    };

    const handleSave = async () => {
        if (isEdited) {
            const profile = {
                avatar: [avatarUrl],
                name: username,
                bio: bio + (website ? `<SITE#${website}>` : ''),
            };

            const loginUser = RSS3.getLoginUser().persona as IRSS3;
            if (profile.name.length > config.fieldMaxLength) {
                showOversizeNotice('Name');
                return;
            }
            if (profile.bio.length > config.fieldMaxLength) {
                showOversizeNotice('Bio');
                return;
            }

            try {
                await loginUser.profile.patch(profile);
                await loginUser.files.sync();
                setIsEdited(false);
                setIsProfileSaved(true);
            } catch (e) {
                console.log(e);
                showNotice('Failed to save profile');
            }
        } else {
            showNotice('Nothing changed.');
        }
    };

    const handleSaveSuccessfully = () => {
        back();
    };

    const toListPage = async (type: string) => {
        const addrOrName = loginUser.name || loginUser.address;
        await router.push(`/u/${addrOrName}/list/${type}`);
    };

    const back = () => {
        router.back();
    };

    // Initialize

    useEffect(() => {
        let iv: ReturnType<typeof setInterval> | null = null;
        if (!iv) {
            iv = setInterval(async () => {
                if (loginUser.isReady) {
                    if (iv) {
                        clearInterval(iv);
                    }
                    await init();
                }
            }, 200);
        }
    }, []);

    return (
        <div>
            <Header />
            <div className="flex flex-col max-w-5xl pt-12 m-auto md:pt-16">
                <h1 className="mt-4 text-lg font-bold text-left text-primary">Edit Profile</h1>
                <section className="flex flex-col items-center w-full pt-10">
                    <div className="flex flex-row items-end justify-start w-4/5 pb-5 pl-14 gap-x-3">
                        <ImageHolder imageUrl={avatarUrl} title={username} isFullRound={true} size={100} />
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
                        <div className="flex flex-row justify-end w-full gap-x-5">
                            <label className="w-48 pt-2 text-right">Username</label>
                            <Input
                                placeholder={'Username'}
                                isSingleLine={true}
                                value={username}
                                onChange={handleChangeUsername}
                            />
                        </div>
                        <div className="flex flex-row justify-end w-full gap-x-5">
                            <label className="w-48 pt-2 text-right">Personal Website</label>
                            <Input
                                placeholder={'Personal Website'}
                                isSingleLine={true}
                                value={website}
                                prefix={'https://'}
                                onChange={handleChangeWebsite}
                            />
                        </div>

                        <div className="flex flex-row justify-end w-full gap-x-5">
                            <label className="w-48 pt-2 text-right">Bio</label>
                            <Input placeholder={'Bio'} isSingleLine={false} value={bio} onChange={handleChangeBio} />
                        </div>

                        <div className="flex flex-row justify-start w-full gap-x-5">
                            <label className="w-48 text-right">Accounts</label>
                            <div className="flex flex-row w-4/5 gap-x-2">
                                {accountItems.map((account) =>
                                    account.platform === 'EVM+' ? (
                                        <EVMpAccountItem
                                            key={account.platform + account.identity}
                                            size="sm"
                                            address={account.identity}
                                        />
                                    ) : (
                                        <AccountItem
                                            key={account.platform + account.identity}
                                            size="sm"
                                            chain={account.platform}
                                        />
                                    ),
                                )}
                            </div>
                            <div className="flex flex-row gap-2">
                                <Button
                                    key="edit"
                                    color={COLORS.primary}
                                    text="Edit"
                                    onClick={handleEdit}
                                    isOutlined={true}
                                    isDisabled={false}
                                />
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
                        <div className="flex flex-row justify-center pl-40 gap-x-3">
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
                                isDisabled={saveBtnDisabled}
                                onClick={() => handleSave()}
                            />
                        </div>
                    </section>
                </section>
            </div>
            <Modal
                theme="account"
                size="md"
                isCenter={true}
                hidden={!isShowingNotice}
                closeEvent={() => setIsShowingNotice(false)}
            >
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className="mx-2 text-primary">Oops</span>
                    </div>

                    <div className="flex justify-center">{notice}</div>

                    <div className="flex justify-center">
                        <Button
                            isOutlined={true}
                            color="primary"
                            text="OK"
                            fontSize="text-base"
                            width="w-48"
                            onClick={() => setIsShowingNotice(false)}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                theme="account"
                size="md"
                isCenter={true}
                hidden={!isProfileSaved}
                closeEvent={() => setIsShowingNotice(false)}
            >
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className="mx-2 text-primary">Succeed</span>
                    </div>

                    <div className="flex justify-center">Profile saved successfully.</div>

                    <div className="flex justify-center">
                        <Button
                            isOutlined={true}
                            color="primary"
                            text="OK"
                            fontSize="text-base"
                            width="w-48"
                            onClick={handleSaveSuccessfully}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
