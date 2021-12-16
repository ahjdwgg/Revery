/* eslint-disable import/no-anonymous-default-export */
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import RSS3, { utils as RSS3Utils } from 'rss3';
import axios from 'axios';
import {
    GitcoinResponse,
    GeneralAsset,
    NFTResponse,
    POAPResponse,
    RecommendationGroupsResponse,
    RecommendationGroups,
    RecommendationUsersResponse,
} from './types';
import config from './config';
import rns from './rns';
import Events from './events';
import Items from 'rss3/dist/items/index';
import Assets from 'rss3/dist/assets/index';
export const EMPTY_RSS3_DP: RSS3DetailPersona = {
    files: null,
    persona: null,
    address: '',
    name: '',
    profile: null,
    followers: [],
    followings: [],
    items: null,
    assets: null,
    isReady: false,
};

let RSS3PageOwner: RSS3DetailPersona = Object.create(EMPTY_RSS3_DP);
let RSS3LoginUser: RSS3DetailPersona = Object.create(EMPTY_RSS3_DP);
let assetsProfileCache: Map<string, IAssetProfile> = new Map();
let walletConnectProvider: WalletConnectProvider;
let ethersProvider: ethers.providers.Web3Provider | null;

export type IRSS3 = RSS3;

export interface IAssetProfile {
    assets: GeneralAsset[];
    status?: boolean;
}

export interface RSS3DetailPersona {
    files: any;
    persona: RSS3 | null;
    address: string;
    name: string;
    profile: RSS3Profile | null;
    followers: string[];
    followings: string[];
    items: Items | null;
    assets: Assets | null;
    isReady: boolean;
}

function setStorage(key: string, value: string) {
    if (value) {
        localStorage.setItem(key, value);
    } else {
        localStorage.removeItem(key);
    }
}
function getStorage(key: string): string {
    return localStorage.getItem(key) || '';
}

const KeyNames = {
    ConnectMethod: 'CONNECT_METHOD',
    ConnectAddress: 'CONNECT_ADDRESS',
    MetaMask: 'MetaMask',
    WalletConnect: 'WalletConnect',
};

async function wcConn(skipSignSync: boolean = false) {
    // WalletConnect Connect
    walletConnectProvider = new WalletConnectProvider(config.walletConnectOptions);

    //  Enable session (triggers QR Code modal)
    let session;
    try {
        session = await walletConnectProvider.enable();
    } catch (e) {}
    if (!session) {
        return null;
    }

    ethersProvider = new ethers.providers.Web3Provider(walletConnectProvider);

    if (!ethersProvider) {
        return null;
    }

    // Subscribe to session disconnection
    walletConnectProvider.on('disconnect', (code: number, reason: string) => {
        console.log(code, reason);
        disconnect();
    });

    let address = getStorage(KeyNames.ConnectAddress);
    if (!address) {
        address = await ethersProvider.getSigner().getAddress();
    }

    RSS3LoginUser.persona = new RSS3({
        endpoint: config.hubEndpoint,
        address: address,
        agentSign: true,
        sign: async (data: string) => {
            alert('Ready to sign... You may need to prepare your wallet.');
            return (
                (await ethersProvider?.send('personal_sign', [
                    ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data)),
                    address.toLowerCase(),
                ])) || ''
            );
        },
    });
    await initUser(RSS3LoginUser, skipSignSync);

    return RSS3LoginUser;
}

async function mmConn(skipSignSync: boolean = false) {
    // MetaMask Connect
    if (!(window as any).ethereum) {
        return null;
    }

    const metamaskEthereum = (window as any).ethereum;
    ethersProvider = new ethers.providers.Web3Provider(metamaskEthereum);

    let address = getStorage(KeyNames.ConnectAddress);
    if (!address) {
        const accounts = await metamaskEthereum.request({
            method: 'eth_requestAccounts',
        });
        address = ethers.utils.getAddress(accounts[0]);
    }

    RSS3LoginUser.persona = new RSS3({
        endpoint: config.hubEndpoint,
        address: address,
        agentSign: true,
        sign: async (data: string) => (await ethersProvider?.getSigner().signMessage(data)) || '',
    });
    await initUser(RSS3LoginUser, skipSignSync);

    return RSS3LoginUser;
}

function saveConnect(method: string) {
    if (isValidRSS3()) {
        setStorage(KeyNames.ConnectMethod, method);
        setStorage(KeyNames.ConnectAddress, RSS3LoginUser.address);
    }
}

async function reconnect() {
    if (isValidRSS3()) {
        return true;
    }
    const lastConnect = getStorage(KeyNames.ConnectMethod);
    const address = getStorage(KeyNames.ConnectAddress);
    if (address) {
        switch (lastConnect) {
            case KeyNames.WalletConnect:
                ethersProvider = null;
                RSS3LoginUser.persona = new RSS3({
                    endpoint: config.hubEndpoint,
                    address: address,
                    agentSign: true,
                    sign: async (data: string) => {
                        if (!ethersProvider) {
                            walletConnectProvider = new WalletConnectProvider(config.walletConnectOptions);
                            let session;
                            try {
                                session = await walletConnectProvider.enable();
                            } catch (e) {}
                            if (!session) {
                                return '';
                            }
                            ethersProvider = new ethers.providers.Web3Provider(walletConnectProvider);
                            if (!ethersProvider) {
                                return '';
                            }
                            walletConnectProvider.on('disconnect', (code: number, reason: string) => {
                                console.log(code, reason);
                                disconnect();
                            });
                        }
                        alert('Ready to sign... You may need to prepare your wallet.');
                        return (
                            (await ethersProvider?.send('personal_sign', [
                                ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data)),
                                address.toLowerCase(),
                            ])) || ''
                        );
                    },
                });
                break;
            case KeyNames.MetaMask:
                ethersProvider = null;
                RSS3LoginUser.persona = new RSS3({
                    endpoint: config.hubEndpoint,
                    address: address,
                    agentSign: true,
                    sign: async (data: string) => {
                        if (!ethersProvider) {
                            const metamaskEthereum = (window as any).ethereum;
                            ethersProvider = new ethers.providers.Web3Provider(metamaskEthereum);
                            await metamaskEthereum.request({
                                method: 'eth_requestAccounts',
                            });
                        }
                        return (await ethersProvider?.getSigner().signMessage(data)) || '';
                    },
                });
                break;
        }
        await initUser(RSS3LoginUser, true);
    } else if (!isValidRSS3()) {
        switch (lastConnect) {
            case KeyNames.WalletConnect:
                await wcConn(true);
                break;
            case KeyNames.MetaMask:
                await mmConn(true);
                break;
            default:
                setStorage(KeyNames.ConnectMethod, ''); // logout
                break;
        }
        return isValidRSS3();
    }
    return true;
}

async function initUser(user: RSS3DetailPersona, skipSignSync: boolean = false) {
    user.isReady = false;
    if (user.persona) {
        if (!user.address) {
            user.address = user.persona.account.address;
        }
        user.persona.files.set(await user.persona.files.get(user.address));
        if (!skipSignSync) {
            await user.persona.files.sync();
        }
    }
    if (user.name && !user.address) {
        user.address = await rns.name2Addr(user.name);
    }
    if (user.address && !user.name) {
        user.name = await rns.addr2Name(user.address);
    }
    const RSS3APIPersona = apiPersona();
    user.profile = await RSS3APIPersona.profile.get(user.address);
    user.followers = await RSS3APIPersona.backlinks.getList(user.address, 'following');
    user.followings = await RSS3APIPersona.links.getList(user.address, 'following');
    user.items = await RSS3APIPersona.items;
    user.assets = await RSS3APIPersona.assets;
    user.files = await RSS3APIPersona.files;
    user.isReady = true;
}

function apiPersona(): RSS3 {
    return (
        RSS3LoginUser.persona ||
        new RSS3({
            endpoint: config.hubEndpoint,
        })
    );
}

function isValidRSS3() {
    return !!RSS3LoginUser.persona;
}

async function disconnect() {
    RSS3LoginUser = Object.create(EMPTY_RSS3_DP);
    ethersProvider = null;
    if (walletConnectProvider) {
        await walletConnectProvider.disconnect();
    }
    setStorage(KeyNames.ConnectMethod, '');
    setStorage(KeyNames.ConnectAddress, '');
}

function dispatchEvent(event: string, detail: any) {
    const evt = new CustomEvent(event, {
        detail,
        bubbles: true,
        composed: true,
    });
    document.dispatchEvent(evt);
}

async function getRecommendGroups() {
    try {
        const res: RecommendationGroupsResponse = (
            await axios.get('/recommendation/types', {
                baseURL: config.recommendations.endpoint,
            })
        ).data;
        return res.data;
    } catch (e) {
        console.log(e);
    }
    return [];
}

async function getRecommendGroupMembers(type: string) {
    try {
        const res: RecommendationUsersResponse = (
            await axios.get('/recommendation/list', {
                baseURL: config.recommendations.endpoint,
                params: {
                    type,
                    limit: config.recommendations.userLimit,
                },
            })
        ).data;
        return <RSS3Index[]>res.response.filter((member) => member !== null); // What's wrong with you dude?
    } catch (e) {
        console.log(e);
    }
    return [];
}

export default {
    connect: {
        walletConnect: async () => {
            if (await wcConn()) {
                saveConnect(KeyNames.WalletConnect);
                dispatchEvent(Events.connect, RSS3LoginUser);
                return RSS3LoginUser;
            } else {
                return null;
            }
        },
        metamask: async () => {
            if (await mmConn()) {
                saveConnect(KeyNames.MetaMask);
                dispatchEvent(Events.connect, RSS3LoginUser);
                return RSS3LoginUser;
            } else {
                return null;
            }
        },
    },
    disconnect: async () => {
        await disconnect();
        dispatchEvent(Events.disconnect, RSS3LoginUser);
    },
    reconnect: async () => {
        const res = await reconnect();
        dispatchEvent(Events.connect, RSS3LoginUser);
        return res;
    },
    getAPIUser: (): RSS3DetailPersona => {
        const user = Object.create(EMPTY_RSS3_DP);
        user.persona = apiPersona();
        return user;
    },
    getLoginUser: () => {
        return RSS3LoginUser;
    },
    ensureLoginUser: async () => {
        return new Promise((resolve, reject) => {
            if (!isValidRSS3()) {
                reject(new Error('Not logged in'));
            } else {
                if (RSS3LoginUser.isReady) {
                    resolve(RSS3LoginUser);
                } else {
                    addEventListener(Events.connect, () => {
                        resolve(RSS3LoginUser);
                    });
                }
            }
        });
    },
    reloadLoginUser: async () => {
        await initUser(RSS3LoginUser);
        dispatchEvent(Events.connect, RSS3LoginUser);
        return RSS3LoginUser;
    },
    setPageOwner: async (addrOrName: string) => {
        let isReloadRequired = false;
        if (addrOrName.startsWith('0x') && addrOrName.length === 42) {
            if (RSS3PageOwner.address !== addrOrName) {
                isReloadRequired = true;
                RSS3PageOwner.address = addrOrName;
                RSS3PageOwner.name = '';
            }
        } else {
            if (RSS3PageOwner.name !== addrOrName) {
                isReloadRequired = true;
                RSS3PageOwner.name = addrOrName;
                RSS3PageOwner.address = '';
            }
        }
        if (isReloadRequired) {
            await initUser(RSS3PageOwner);
        }
        dispatchEvent(Events.pageOwnerReady, RSS3PageOwner);
        return RSS3PageOwner;
    },
    getPageOwner: () => {
        return RSS3PageOwner;
    },
    reloadPageOwner: async () => {
        await initUser(RSS3PageOwner);
        dispatchEvent(Events.pageOwnerReady, RSS3PageOwner);
        return RSS3PageOwner;
    },
    isNowOwner: () => {
        return isValidRSS3() && RSS3LoginUser.address === RSS3PageOwner.address;
    },
    isValidRSS3,

    getAssetProfile: async (address: string, type: string, refresh: boolean = false) => {
        if (assetsProfileCache.has(address + type) && !refresh) {
            return <IAssetProfile>assetsProfileCache.get(address + type);
        } else {
            let data: IAssetProfile | null = null;
            try {
                const autoAssets = (await RSS3PageOwner.assets?.auto.getList(address))?.map((asset) =>
                    RSS3Utils.id.parseAsset(asset),
                );
                data = <IAssetProfile>{ assets: autoAssets, status: autoAssets };
                assetsProfileCache.set(address + type, data);
            } catch (error) {
                data = null;
            }
            return data;
        }
    },
    getNFTDetails: async (address: string, platform: string, identity: string, id: string, type: string) => {
        let data: NFTResponse | null = null;
        try {
            const res = await axios.get(`/assets/details`, {
                baseURL: config.hubEndpoint,
                params: {
                    personaID: address,
                    platform: 'EVM+',
                    id,
                    identity,
                    type,
                },
            });
            if (res && res.data) {
                data = <NFTResponse>res.data;
            }
        } catch (error) {
            data = null;
        }
        return data;
    },
    getGitcoinDonation: async (address: string, platform: string, identity: string, id: string) => {
        let data: GitcoinResponse | null = null;
        try {
            const res = await axios.get(`/assets/details`, {
                baseURL: config.hubEndpoint,
                params: {
                    personaID: address,
                    platform: 'EVM+',
                    id: id,
                    identity: identity,
                    type: 'Gitcoin-Donation',
                },
            });
            if (res && res.data) {
                data = <GitcoinResponse>res.data;
            }
        } catch (error) {
            data = null;
        }
        return data;
    },
    getFootprintDetail: async (address: string, platform: string, identity: string, id: string) => {
        let data: POAPResponse | null = null;
        try {
            const res = await axios.get(`/assets/details`, {
                baseURL: config.hubEndpoint,
                params: {
                    personaID: address,
                    platform: 'EVM+',
                    id: id,
                    identity: identity,
                    type: 'xDai-POAP',
                },
            });
            if (res && res.data) {
                data = <POAPResponse>res.data;
            }
        } catch (error) {
            data = null;
        }
        return data;
    },

    buildProductBaseURL: (product: string, address: string, name?: string) => {
        if (product in config.productsList) {
            const p = config.productsList[product];
            if (p.subDomainMode) {
                if (name) {
                    const fixedName = name.endsWith(config.rns.suffix) ? name.replace(config.rns.suffix, '') : name;
                    return `${p.schema}${fixedName}.${p.baseDomain}`;
                } else {
                    return `${p.schema}${p.baseDomain}/${address}`;
                }
            } else {
                return `${p.schema}${p.baseDomain}/${name || address}`;
            }
        }
        return '';
    },

    getRecommendGroups,
    getRecommendGroupMembers,
};
