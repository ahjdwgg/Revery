import hub from './hub';
import misskey from './misskey';
import twitter from './twitter';

interface ContentInfo {
    title: string;
    pre_content: string;
    timestamp: number;
    txHash: string;
    link: string;
}

export interface Content {
    id: string;
    identity: string;
    platform: string;
    type: string;
    info: ContentInfo;
    accessible?: boolean;
}

export interface PlatformSettings {
    accountStyle: string;
    availableFields: string[];
    prefix: string;
    suffix: string;

    getContent?: (address: string, untilTimeStamp?: number) => Promise<Content[]>;
    getAccountLink?: (account: string) => string;
}

const Providers: { [key: string]: PlatformSettings } = {
    Hub: hub,
    Misskey: misskey,
    Twitter: twitter,
};

export default Providers;
