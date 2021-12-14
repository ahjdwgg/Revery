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
import Modal, { ModalColorStyle } from '../../components/modal/Modal';
import { useRouter } from 'next/router';
import { utils as RSS3Utils } from 'rss3';
import { stringify } from 'querystring';
import { AnyObject } from 'rss3/types/extend';

type InputEventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const Profile: NextPage = () => {
    const router = useRouter();
    const loginUser = RSS3.getLoginUser();

    const [avatarUrl, setAvatarUrl] = useState(RSS3.getLoginUser().profile?.avatar?.[0] || config.undefinedImageAlt);
    const [link, setLink] = useState<string>('');

    const [username, setUsername] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [website, setWebsite] = useState<string>('');

    const [accountItems, setAccountItems] = useState<AnyObject[]>([]);

    const [notice, setNotice] = useState('');
    const [isShowingNotice, setIsShowingNotice] = useState(false);

    const [isShowingRedirectNotice, setIsShowingRedirectNotice] = useState(false);
    const [otherProductRedirectSettings, setOtherProductRedirectSettings] = useState<{
        product: string;
        type: string;
        route: string;
        baseUrl: string;
        colorStyle: ModalColorStyle;
    }>({
        product: '',
        type: '',
        route: '',
        baseUrl: '',
        colorStyle: 'primary',
    });

    const [isEdited, setIsEdited] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
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

    const handleSave = async () => {
        setIsLoading(true);
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
                await RSS3.reloadLoginUser();
                await RSS3.reloadPageOwner();
                setIsEdited(false);
                setIsProfileSaved(true);
            } catch (e) {
                console.log(e);
                showNotice('Failed to save profile');
            }
        } else {
            showNotice('Nothing changed.');
        }
        setIsLoading(false);
    };

    const handleSaveSuccessfully = () => {
        back();
    };

    const toListPage = async (type: string) => {
        const addrOrName = loginUser.name || loginUser.address;
        await router.push(`/u/${addrOrName}/list/${type}`);
    };

    const toRSS3BioEditAccountNotice = () => {
        // to RSS3.Bio edit this

        const product = 'RSS3Bio';
        const loginUser = RSS3.getLoginUser();
        const baseUrl = RSS3.buildProductBaseURL(product, loginUser.address, loginUser.name);
        setOtherProductRedirectSettings({
            product,
            type: 'Account',
            route: '/setup/accounts',
            baseUrl,
            colorStyle: 'account',
        });
        setIsShowingRedirectNotice(true);
    };

    const toEditAssetRedirect = () => {
        // open new window
        setIsShowingRedirectNotice(false);
        window.open(`${otherProductRedirectSettings.baseUrl}${otherProductRedirectSettings.route}`, '_blank');
    };

    const toRss3BioUserSite = () => {
        if (link) {
            const prefix = link.endsWith('.rss3') ? link.split('.rss3')[0] : link;
            const url = RSS3.buildProductBaseURL('RSS3Bio', '', prefix);
            window.open(url, '_blank');
        }
    };

    const back = () => {
        router.back();
    };

    const toHome = () => {
        router.push('/');
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
        const accountList = listed.map((account) => RSS3Utils.id.parseAccount(account.id));
        setAccountItems(
            [
                {
                    platform: 'EVM+',
                    identity: RSS3.getLoginUser().address,
                },
            ].concat(accountList),
        );
        setIsLoading(false);
    };

    // Initialize

    useEffect(() => {
        setTimeout(async () => {
            if (await RSS3.reconnect()) {
                const iv = setInterval(() => {
                    if (loginUser.isReady) {
                        clearInterval(iv);
                        init();
                    }
                }, 200);
            } else {
                // Not login
                toHome();
            }
        }, 0);
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
                                {link && <LinkButton text={link} onClick={toRss3BioUserSite} color={COLORS.primary} />}
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
                                    onClick={toRSS3BioEditAccountNotice}
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
                                height={'h-8'}
                                onClick={() => handleDiscard()}
                            />
                            {isLoading ? (
                                <Button
                                    isOutlined={false}
                                    color={COLORS.primary}
                                    icon="loading"
                                    width={'w-48'}
                                    height={'h-8'}
                                />
                            ) : (
                                <Button
                                    isOutlined={false}
                                    color={COLORS.primary}
                                    text={'Save'}
                                    fontSize={'text-base'}
                                    width={'w-48'}
                                    height={'h-8'}
                                    onClick={() => handleSave()}
                                />
                            )}
                        </div>
                    </section>
                </section>
            </div>

            <Modal
                theme={'primary'}
                size={'sm'}
                isCenter={true}
                hidden={!isShowingRedirectNotice}
                closeEvent={() => setIsShowingRedirectNotice(false)}
            >
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className={`mx-2 text-xl text-${otherProductRedirectSettings.colorStyle}`}>Info</span>
                    </div>

                    <div className="flex justify-center">
                        <div className="inline px-12 pt-8 pb-12">
                            {`You will be redirect to`}
                            <span className="text-primary mx-2">{otherProductRedirectSettings.product}</span>
                            {`to set up your`}
                            <span className={`mx-2 text-${otherProductRedirectSettings.colorStyle}`}>
                                {otherProductRedirectSettings.type}
                            </span>
                            {`.`}
                        </div>
                    </div>

                    <div className="flex justify-center gap-x-3">
                        <Button
                            isOutlined={true}
                            color={otherProductRedirectSettings.colorStyle}
                            text={'Cancel'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={() => setIsShowingRedirectNotice(false)}
                        />
                        <Button
                            isOutlined={false}
                            color={otherProductRedirectSettings.colorStyle}
                            text={'Go'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={toEditAssetRedirect}
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                theme={'primary'}
                size={'md'}
                isCenter={true}
                hidden={!isShowingNotice}
                closeEvent={() => setIsShowingNotice(false)}
            >
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className="mx-2 text-primary">Oops</span>
                    </div>

                    <div className="flex justify-center">{notice}</div>

                    <div className="flex justify-center gap-x-3">
                        <Button
                            isOutlined={true}
                            color={'primary'}
                            text={'OK'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={() => setIsShowingNotice(false)}
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                theme={'primary'}
                size={'md'}
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
                            color={'primary'}
                            text={'OK'}
                            fontSize={'text-base'}
                            width={'w-48'}
                            onClick={handleSaveSuccessfully}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
