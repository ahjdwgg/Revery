import { ethers } from 'ethers';
import { utils } from 'ethers/lib';
import axios from 'axios';

import config from './config';

type CNAME = 'resolver' | 'token';

let idNo = -1;

async function callRNSContract<T>(
    cname: CNAME,
    providerType: 'web3' | 'infura',
    method: string,
    ...args: any
): Promise<T> {
    let provider: ethers.providers.Web3Provider | ethers.providers.InfuraProvider;
    let signer; // TODO
    if (providerType === 'web3') {
        provider = new ethers.providers.Web3Provider((window as any).ethereum);
        signer = provider.getSigner();
    } else {
        if (idNo === -1) {
            const poolSize = config.infuraId.length;
            const idStart = Math.floor(Math.random() * poolSize);
            for (let i = 0; i < poolSize; i++) {
                if (await checkInfuraID(config.infuraId[(idStart + i) % poolSize])) {
                    idNo = (idStart + i) % poolSize;
                    break;
                }
            }
        }

        provider = new ethers.providers.InfuraProvider(config.rns.test ? 'ropsten' : 'homestead', {
            projectId: config.infuraId[idNo],
        });
    }

    const contract = await new ethers.Contract(
        getRNSContract(cname),
        config.rns.contract[cname],
        signer ? signer : provider,
    );
    return contract[method](...args);
}

async function checkInfuraID(id: string) {
    try {
        const res = await axios.post(`https://mainnet.infura.io/v3/${id}`, {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_accounts',
            params: [],
        });
        if (res.data) {
            return true;
        }
    } catch (e) {
        console.log(e);
    }
    return false;
}

function getRNSContract(cname: CNAME) {
    if (config.rns.test) {
        return config.rns.contractNetworks.ropsten[cname];
    } else {
        return config.rns.contractNetworks.mainnet[cname];
    }
}

// sha3HexAddress https://eips.ethereum.org/EIPS/eip-181
function sha3HexAddress(addr: string) {
    addr = '00' + addr.slice(2);
    const lookup = '3031323334353637383961626364656600000000000000000000000000000000';
    let res = '';
    for (let i = 40; i > 0; i--) {
        const bit = Number('0x' + addr.slice(i, i + 2)) & 0xf;
        res = lookup.slice(2 * bit, 2 * bit + 2) + res;
    }
    return utils.keccak256('0x' + res);
}

const addrCache: {
    [key: string]: string;
} = {};

const nameCache: {
    [key: string]: string;
} = {};

export default {
    // We have checked network and account in verifyRNS method in RNS.vue, so we don't need to check it here.
    async register(name: string) {
        return callRNSContract<ethers.providers.TransactionResponse>('token', 'web3', 'register', name);
    },
    async addr2Name(addr: string, isPureRNS: boolean = false) {
        if (addrCache[addr]) {
            return addrCache[addr];
        } else {
            try {
                const domainInfo = (await axios.get(`https://rss3.domains/address/${addr}`)).data;
                if (isPureRNS) {
                    return domainInfo.rnsName || '';
                } else {
                    if (domainInfo.rnsName) {
                        return domainInfo.rnsName.replace('.rss3', '');
                    } else if (domainInfo.ensName) {
                        return domainInfo.ensName;
                    } else {
                        return '';
                    }
                }
            } catch (e) {
                const reverseNode = '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2';
                const addrHex = sha3HexAddress(addr.toLowerCase());
                const node = utils.keccak256(
                    utils.defaultAbiCoder.encode(['bytes32', 'bytes32'], [reverseNode, addrHex]),
                );
                const name = (await callRNSContract<string>('resolver', 'infura', 'name', node))
                    .toLowerCase()
                    .replace(config.rns.suffix, '');
                if (name) {
                    addrCache[addr] = name;
                }
                return name;
            }
        }
    },
    async name2Addr(name: string) {
        let addr;
        try {
            addr = (await axios.get(`https://rss3.domains/name/${name}`)).data.address;
            return addr;
        } catch (e) {
            name = (name + config.rns.suffix).toLowerCase();
            if (nameCache[name]) {
                return nameCache[name];
            } else {
                const addr = await callRNSContract<string>('resolver', 'infura', 'addr', utils.namehash(name));
                if (parseInt(addr) !== 0) {
                    nameCache[name] = addr;
                }
                return addr;
            }
        }
    },
    async balanceOfPass3(addr: string) {
        await (window as any).ethereum?.enable();
        const balance = await callRNSContract<ethers.BigNumber>('token', 'infura', 'balanceOf', addr);
        return Number(ethers.utils.formatUnits(balance, 18));
    },
};
