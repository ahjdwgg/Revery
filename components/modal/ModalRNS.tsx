import React, { ChangeEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import Button from '../buttons/Button';
import { COLORS } from '../buttons/variables';
import Input from '../inputs/Input';
import { BiInfoCircle, BiErrorCircle } from 'react-icons/bi';
import RSS3 from '../../common/rss3';
import config from '../../common/config';
import RNS from '../../common/rns';
import { Exception } from '@sentry/types';

interface ModalConnectProps {
    hidden: boolean;
    closeEvent: () => void;
}
type InputEventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export default function ModalRNS({ hidden, closeEvent }: ModalConnectProps) {
    const [rns, setRns] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState('');
    const [notice, setNotice] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isShowingConfirm, setIsShowingConfirm] = useState(false);
    const [isShowingNotice, setIsShowingNotice] = useState(false);

    const loginUser = RSS3.getLoginUser();

    const isPassEnough = async () => {
        const balanceOfPass = await RNS.balanceOfPASS(loginUser.address);
        console.log('Your PASS balance: ', balanceOfPass);
        return balanceOfPass >= 1;
    };

    const init = async () => {
        setIsLoading(true);
        setIsDisabled(true);
        setErrorMsg('');

        const rns = await RNS.addr2Name(loginUser.address, true);
        if (rns) {
            // Verify if already have RNS
            setRns(rns);
        } else if (!RNS.isMetamaskEnabled()) {
            // Verify if metamask is enabled
            setErrorMsg('You need MetaMask extension to sign');
        } else if (!(await RNS.isSpecifyNetwork())) {
            // Verify if metamask is on right chain
            setErrorMsg(`MetaMask should be connected to ${config.rns.smartContract.networkName} chain.`);
        } else if (!(await isPassEnough())) {
            // Verify if $PASS is enough
            setErrorMsg('Sorry, but you need 1 $PASS to register an RNS');
        } else {
            // Pre-test passed
            setIsDisabled(false);
        }
        setIsLoading(false);
    };

    const handleSetRNS = (event: InputEventType) => {
        setRns(event.target.value.replace(/[^a-z0-9\-_]/g, ''));
    };

    // All modal
    const closeAll = () => {
        setIsShowingConfirm(false);
        setIsShowingNotice(false);
        closeEvent();
    };

    // Base modal
    const handleRefresh = () => {
        init();
    };
    const handleCheck = async () => {
        setIsLoading(true);
        setIsDisabled(true);
        setErrorMsg('');
        if (rns.length < 5 || rns.length >= 15) {
            setErrorMsg('An RNS must have at least 5 characters and no more than 15');
        } else if (!/^[a-z0-9\-_]+$/.test(rns)) {
            setErrorMsg('An RNS should only contain lower case letters, numbers, minus and underlines.');
        } else if (rns.startsWith('0x')) {
            setErrorMsg('An RNS should not start with "0x".');
        } else if (!(await isPassEnough())) {
            // Check $PASS balance
            setErrorMsg('Sorry, but you need 1 $PASS to register an RNS');
        } else if (parseInt(await RNS.name2Addr(rns + config.rns.suffix)) !== 0) {
            // Already taken
            setErrorMsg('Sorry, but this RNS has already been taken.');
        } else {
            // Final-test passed
            setIsShowingConfirm(true);
        }
        setIsDisabled(false);
        setIsLoading(false);
    };

    // Confirm modal
    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await RNS.registerRNS(rns);
            setNotice('RNS registered successfully! It might need a while for the transaction to confirm.');
        } catch (e) {
            setNotice((e as any)?.message || 'Sorry, but something went wrong. Please try again later.');
            console.log(e);
        }
        setIsLoading(false);
        setIsShowingConfirm(false);
        setIsShowingNotice(true);
    };
    const handleCancel = () => {
        setIsShowingConfirm(false);
    };

    const handleOK = () => {
        closeAll();
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <Modal hidden={hidden} closeEvent={closeAll} theme={'primary'} size="md" title={'Claim Your RNS'}>
                <div className="flex flex-col my-8 gap-y-6 mx-14">
                    <div className="text-base text-error h-5">
                        {errorMsg && (
                            <div className="flex flex-row gap-2.5 justify-start items-center">
                                <BiErrorCircle />
                                <span className="text-primary">{errorMsg}</span>
                            </div>
                        )}
                    </div>

                    <Input
                        placeholder={'Input Your RNS'}
                        isSingleLine={true}
                        suffix={config.rns.suffix}
                        value={rns}
                        isDisabled={isDisabled}
                        onChange={handleSetRNS}
                    />
                    <div className="text-base flex flex-row gap-2.5 justify-start items-center">
                        <BiInfoCircle className="opacity-20" />
                        <span className="text-primary">An RNS is a unique domain to access your RSS3 service</span>
                    </div>
                    <div className="flex justify-center gap-x-3">
                        <Button
                            isDisabled={isLoading}
                            isOutlined={true}
                            color={COLORS.primary}
                            text={'Refresh'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            height={'h-8'}
                            onClick={handleRefresh}
                        />
                        {isLoading ? (
                            <Button
                                isOutlined={false}
                                color={COLORS.primary}
                                icon={'loading'}
                                fontSize={'text-base'}
                                width={'w-24'}
                                height={'h-8'}
                            />
                        ) : (
                            <Button
                                isDisabled={isDisabled}
                                isOutlined={false}
                                color={COLORS.primary}
                                text={'Check'}
                                fontSize={'text-base'}
                                width={'w-24'}
                                height={'h-8'}
                                onClick={handleCheck}
                            />
                        )}
                    </div>
                </div>
            </Modal>
            <Modal theme={'primary'} hidden={!isShowingConfirm} size={'sm'} closeEvent={handleCancel}>
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className={`mx-2 text-xl text-primary`}>Confirm you RNS</span>
                    </div>

                    <div className="flex justify-center">
                        <div className="inline px-12 pt-8 pb-12">
                            {`Your`}
                            <span className="mx-2 text-primary">RNS</span>
                            {`will be`}
                            <span className="mx-2 text-primary">{rns + config.rns.suffix}</span>
                            {`, is that right?`}
                        </div>
                    </div>

                    <div className="flex justify-center gap-x-3">
                        <Button
                            isDisabled={isLoading}
                            isOutlined={true}
                            color={COLORS.primary}
                            text={'Cancel'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            height={'h-8'}
                            onClick={handleCancel}
                        />
                        {isLoading ? (
                            <Button
                                isOutlined={false}
                                color={COLORS.primary}
                                icon={'loading'}
                                fontSize={'text-base'}
                                width={'w-24'}
                                height={'h-8'}
                            />
                        ) : (
                            <Button
                                isOutlined={false}
                                color={COLORS.primary}
                                text={'Confirm'}
                                fontSize={'text-base'}
                                width={'w-24'}
                                height={'h-8'}
                                onClick={handleConfirm}
                            />
                        )}
                    </div>
                </div>
            </Modal>
            <Modal theme={'primary'} hidden={!isShowingNotice} size={'sm'} closeEvent={handleOK}>
                <div className="flex flex-col justify-between w-full h-full">
                    <div className="flex justify-center flex-start">
                        <span className={`mx-2 text-xl text-primary`}>Notice</span>
                    </div>

                    <div className="flex justify-center">
                        <div className="inline px-12 pt-8 pb-12">{notice}</div>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            isOutlined={true}
                            color={COLORS.primary}
                            text={'OK'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            height={'h-8'}
                            onClick={handleOK}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
}
