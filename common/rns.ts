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
            index = cache.findIndex((record) => record.rnsName === aon + config.rns.suffix);
        }
    }
    if (index !== -1) {
        return cache[index];
    } else {
        return null;
    }
};

export default {
    async addr2Name(addr: string, isPureRNS: boolean = false) {
        const cachedValue = searchInCache(addr, 'address');
        let domainInfo: RSS3Domains | null = null;
        if (cachedValue) {
            domainInfo = cachedValue;
        } else {
            domainInfo = <RSS3Domains>(
                await axios.get(`/address/${addr}`, {
                    baseURL: 'https://rss3.domains',
                })
            ).data;
            cache.push(domainInfo);
        }
        if (isPureRNS) {
            return domainInfo.rnsName.replace(config.rns.suffix, '') || '';
        } else {
            return domainInfo.rnsName.replace(config.rns.suffix, '') || domainInfo.ensName || '';
        }
    },
    async name2Addr(name: string) {
        const cachedValue = searchInCache(name, 'name');
        let domainInfo: RSS3Domains | null = null;
        if (cachedValue) {
            domainInfo = cachedValue;
        } else {
            domainInfo = <RSS3Domains>(
                await axios.get(`/name/${name}`, {
                    baseURL: 'https://rss3.domains',
                })
            ).data;
            cache.push(domainInfo);
        }
        return domainInfo.address || '';
    },
};
