/* eslint-disable import/no-anonymous-default-export */
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import RSS3 from 'rss3';
import axios from 'axios';
import AsyncLock from 'async-lock';
import { RecommendationGroupsResponse, RecommendationUsersResponse } from './types';
import config from './config';
import rns from './rns';
import Events from './events';

export interface RSS3DetailPersona {
    file: RSS3Index | null;
    address: string;
    name: string;
    profile: RSS3Profile | null;
    followers: string[];
    followings: string[];
    isReady: boolean;
}

export interface RSS3SDKPersona {
    persona: RSS3;
}

export const EMPTY_RSS3_DP: RSS3DetailPersona = {
    file: null,
    address: '',
    name: '',
    profile: null,
    followers: [],
    followings: [],
    isReady: false,
};

const RSS3PageOwner: RSS3DetailPersona = Object.create(EMPTY_RSS3_DP);
let RSS3LoginUser: RSS3FullPersona = Object.create(EMPTY_RSS3_DP);
const RSS3APIUser: RSS3SDKPersona = {
    persona: new RSS3({
        endpoint: config.hubEndpoint,
    }),
};
let walletConnectProvider: WalletConnectProvider;
let ethersProvider: ethers.providers.Web3Provider | null;
const lock = new AsyncLock();

export type IRSS3 = RSS3;

export type RSS3FullPersona = RSS3SDKPersona & RSS3DetailPersona;

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

async function initUser(user: RSS3DetailPersona | RSS3FullPersona, skipSignSync: boolean = false) {
    const RSS3APIPersona = apiPersona();
    user.isReady = false;
    await lock.acquire('InitializingUser', async () => {
        if ('persona' in user && !user.address) {
            // Fix address
            user.address = user.persona.account.address;
        }
        if (user.name && !user.address) {
            user.address = await rns.name2Addr(user.name);
        }
        if (user.address && !user.name) {
            user.name = await rns.addr2Name(user.address);
        }
        user.file = (await RSS3APIPersona.files.get(user.address)) as RSS3Index;
        if ('persona' in user) {
            // Sync persona
            user.persona.files.set(user.file);
            if (!skipSignSync) {
                await user.persona.files.sync();
            }
        }
        user.profile = user.file.profile || {};
        user.followers = await RSS3APIPersona.backlinks.getList(user.address, 'following');
        user.followings = await RSS3APIPersona.links.getList(user.address, 'following');
        user.isReady = true;
    });
}

function apiPersona(): RSS3 {
    return RSS3APIUser.persona;
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

function checkIsFollowing(address: string = RSS3PageOwner.address) {
    const followList = RSS3LoginUser.followings;
    if (followList?.includes(address)) {
        return true;
    } else {
        return false;
    }
}

async function follow(address: string = RSS3PageOwner.address) {
    if (!checkIsFollowing(address)) {
        if (address === RSS3PageOwner.address) RSS3PageOwner.followers.push(RSS3LoginUser.address);
        RSS3LoginUser.followings.push(address);
        await RSS3LoginUser.persona?.links.post('following', address);
    }
}

async function unfollow(address: string = RSS3PageOwner.address) {
    if (checkIsFollowing(address)) {
        if (address === RSS3PageOwner.address)
            RSS3PageOwner.followers.splice(RSS3PageOwner.followers.indexOf(RSS3LoginUser.address), 1);
        RSS3LoginUser.followings.splice(RSS3LoginUser.followings.indexOf(address), 1);
        await RSS3LoginUser.persona?.links.delete('following', address);
    }
}

function checkIsLoginUser(address: string = RSS3PageOwner.address) {
    if (address === RSS3LoginUser.address) {
        return true;
    } else {
        return false;
    }
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
    getAPIUser: (): RSS3SDKPersona => {
        return {
            persona: apiPersona(),
        };
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
        RSS3LoginUser.file = (await apiPersona().files.get(RSS3LoginUser.address, true)) as RSS3Index;
        RSS3LoginUser.profile = RSS3LoginUser.file.profile || {};
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
        RSS3PageOwner.file = (await apiPersona().files.get(RSS3PageOwner.address, true)) as RSS3Index;
        RSS3PageOwner.profile = RSS3PageOwner.file.profile || {};
        dispatchEvent(Events.pageOwnerReady, RSS3PageOwner);
        return RSS3PageOwner;
    },
    isNowOwner: () => {
        return isValidRSS3() && RSS3LoginUser.address === RSS3PageOwner.address;
    },
    isValidRSS3,
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

    checkIsFollowing,
    follow,
    unfollow,
    checkIsLoginUser,
};
