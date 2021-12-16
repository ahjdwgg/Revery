import { ChangeEvent, useEffect, useState } from 'react';
import Modal from './Modal';
import Button from '../buttons/Button';
import { COLORS } from '../buttons/variables';
import Input from '../inputs/Input';
import { BiInfoCircle, BiErrorCircle } from 'react-icons/bi';
import RSS3 from '../../common/rss3';
import { useRouter } from 'next/router';

export type ModalColorStyle = 'account' | 'nft' | 'donation' | 'footprint' | 'primary';
type LoadingTypes = 'any' | 'WalletConnect' | 'Metamask' | null;

interface ModalConnectProps {
    hidden: boolean;
    closeEvent: () => void;
}
type InputEventType = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
export default function ModalRNS({ hidden, closeEvent }: ModalConnectProps) {
    const router = useRouter();
    const [isEdited, setIsEdited] = useState(false);
    const [rns, setRns] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState('');

    const reloadPage = () => {
        router.reload();
    };

    const handleSetRNS = (event: InputEventType) => {
        setRns(event.target.value);
    };

    const handleDiscard = () => {
        setIsEdited(false);
        back();
    };

    const handleSave = async () => {
        if (isEdited) {
            if (rns.length < 5) {
                setErrorMsg('An RNS must have at least 5 characters');
            } else if (rns.length > 15) {
                setErrorMsg('An RNS must have at least 5 characters');
            }

            try {
                setIsEdited(false);
            } catch (e) {
                console.log(e);
                setErrorMsg('Failed to claim your RNS.');
            }
        } else {
            setErrorMsg('Nothing changed.');
        }
    };
    const back = () => {
        router.back();
    };
    useEffect(() => {}, []);

    return (
        <Modal hidden={hidden} closeEvent={closeEvent} theme={'primary'} size="md" title={'Claim Your RNS'}>
            <div className="flex flex-col my-8 gap-y-6 mx-14">
                <div className="text-base text-error h-5">
                    {errorMsg !== '' && (
                        <div className="flex flex-row gap-2.5 justify-start items-center">
                            <BiErrorCircle />
                            <span className="text-primary">{errorMsg}</span>
                        </div>
                    )}
                </div>

                <Input
                    placeholder={'Input Your RNS'}
                    isSingleLine={true}
                    suffix={'.rss3'}
                    value={rns}
                    onChange={handleSetRNS}
                />
                <div className="text-base flex flex-row gap-2.5 justify-start items-center">
                    <BiInfoCircle className="opacity-20" />
                    <span className="text-primary">An RNS is a unique domain to access your RSS3 service</span>
                </div>
                <div className="flex justify-center gap-x-3">
                    <Button
                        isOutlined={true}
                        color={'primary'}
                        text={'Discard'}
                        fontSize={'text-base'}
                        width={'w-24'}
                        onClick={() => handleDiscard()}
                    />
                    {isEdited ? (
                        <Button isDisabled={true} color={COLORS.primary} text={'Save'} width={'w-24'} />
                    ) : (
                        <Button
                            isOutlined={false}
                            color={COLORS.primary}
                            text={'Save'}
                            fontSize={'text-base'}
                            width={'w-24'}
                            onClick={() => handleSave()}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
}
