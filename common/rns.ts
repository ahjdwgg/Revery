import axios from 'axios';

import config from './config';
import { ethers } from 'ethers';

interface RSS3Domains {
    address: string;
    rnsName: string;
    dasName: string;
    ensName: string;
}

const cache: RSS3Domains[] = [];

const searchInCache = (aon: string, type: 'address' | 'name') => {
    let index = -1;
    if (type === 'address') {
        index = cache.findIndex((record) => record.address === aon);
    } else {
        if (aon.endsWith('.eth')) {
            index = cache.findIndex((record) => record.ensName === aon);
        } else if (aon.endsWith('.bit')) {
            index = cache.findIndex((record) => record.dasName === aon);
        } else {
            index = cache.findIndex((record) => record.rnsName === aon);
        }
    }
    if (index !== -1) {
        return cache[index];
    } else {
        return null;
    }
};

const addr2Name = async (addr: string, isPureRNS: boolean = false) => {
    const cachedValue = searchInCache(addr, 'address');
    let domainInfo: RSS3Domains | null = null;
    if (cachedValue) {
        domainInfo = cachedValue;
    } else {
        domainInfo = <RSS3Domains>(
            await axios.get(`/address/${addr}`, {
                baseURL: config.rns.serviceUrl,
            })
        ).data;
        cache.push(domainInfo);
    }
    if (isPureRNS) {
        return domainInfo.rnsName || '';
    } else {
        return domainInfo.rnsName || domainInfo.dasName || domainInfo.ensName || '';
    }
};

const name2Addr = async (name: string) => {
    const cachedValue = searchInCache(name, 'name');
    let domainInfo: RSS3Domains | null = null;
    if (cachedValue) {
        domainInfo = cachedValue;
    } else {
        domainInfo = <RSS3Domains>(
            await axios.get(`/name/${name}`, {
                baseURL: config.rns.serviceUrl,
            })
        ).data;
        cache.push(domainInfo);
    }
    return domainInfo.address || '';
};

const tryName = async (address: string, isPureRNS?: boolean) => {
    return (await addr2Name(address, isPureRNS)) || address;
};

// Interact with Ethereum Smart Contract part
// Metamask required

type CNAME = 'resolver' | 'token';

function isMetamaskEnabled() {
    return typeof (window as any).ethereum !== 'undefined';
}
async function isSpecifyNetwork() {
    if (isMetamaskEnabled()) {
        const metamaskEthereum = (window as any).ethereum;
        // this.rss3 object exists, don't necessarily mean the account is connected
        await metamaskEthereum.request({
            method: 'eth_requestAccounts',
        });
        const chain: string | null = await metamaskEthereum.request({ method: 'eth_chainId' });
        return config.rns.smartContract.networkID === chain;
    } else {
        return false;
    }
}
function getRNSContract(cname: CNAME) {
    return config.rns.smartContract.contractAddress[cname];
}
async function callRNSContract<T>(cname: CNAME, method: string, ...args: any): Promise<T> {
    let provider: ethers.providers.Web3Provider | ethers.providers.InfuraProvider;
    let signer; // TODO
    provider = new ethers.providers.Web3Provider((window as any).ethereum);
    signer = provider.getSigner();

    const contract = await new ethers.Contract(
        getRNSContract(cname),
        config.rns.smartContract.contract[cname],
        signer ? signer : provider,
    );
    return contract[method](...args);
}

const RNS = {
    addr2Name,
    name2Addr,
    tryName,
    isMetamaskEnabled,
    isSpecifyNetwork,
    async registerRNS(name: string) {
        await (window as any).ethereum?.request({
            method: 'eth_requestAccounts',
        });
        return callRNSContract<ethers.providers.TransactionResponse>('token', 'register', name);
    },
    async balanceOfPASS(addr: string) {
        await (window as any).ethereum?.request({
            method: 'eth_requestAccounts',
        });
        const balance = await callRNSContract<ethers.BigNumber>('token', 'balanceOf', addr);
        return Number(ethers.utils.formatUnits(balance, 18));
    },
};

export default RNS;
