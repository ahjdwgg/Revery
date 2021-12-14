import axios from 'axios';

import config from './config';

interface RSS3Domains {
    address: string;
    rnsName: string;
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
        return domainInfo.rnsName || domainInfo.ensName || '';
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

const RNS = {
    addr2Name,
    name2Addr,
    tryName,
};

export default RNS;
