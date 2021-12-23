import {
    CustomField_PassAssets,
    DonationDetailByGrant,
    GeneralAssetWithTags,
    GitcoinResponse,
    ItemDetails,
    NFT,
    NFTResponse,
    POAP,
    POAPResponse,
} from './types';
import config from './config';
import RSS3 from './rss3';
import { utils as RSS3Utils } from 'rss3';
import { AnyObject } from 'rss3/types/extend';
import { formatter } from './address';
import { FILTER_TAGS } from '../components/filter/FilterTag';

const orderPattern = new RegExp(`^${config.tags.prefix}:order:(-?\\d+)$`, 'i');

type TypesWithTag = RSS3Account | GeneralAssetWithTags;

const getTaggedOrder = (tagged: TypesWithTag): number => {
    if (!tagged.tags) {
        return -1;
    }
    // const orderPattern = /^pass:order:(-?\d+)$/i;
    for (const tag of tagged.tags) {
        if (orderPattern.test(tag)) {
            return parseInt(orderPattern.exec(tag)?.[1] || '-1');
        }
    }
    return -1;
};

function sortByOrderTag<T extends TypesWithTag>(taggeds: T[]): T[] {
    taggeds.sort((a, b) => {
        return getTaggedOrder(a) - getTaggedOrder(b);
    });
    return taggeds;
}

async function initAssets() {
    const pageOwner = RSS3.getPageOwner();
    const apiUser = RSS3.getAPIUser();

    let assetList = await apiUser.persona.assets.auto.getList(pageOwner.address);

    // @ts-ignore // WHATS YOUR PROBLEM!!!!!!!
    const passTags = pageOwner.file?.['_pass']?.assets;
    const taggedList: CustomField_PassAssets[] = passTags || [];
    const validTaggedList = taggedList.filter((tagged) => assetList.includes(tagged.id));

    const hiddenList = validTaggedList
        .filter((asset: any) => asset.hasOwnProperty('hide'))
        .map((asset: { id: string }) => asset.id);

    const orderedList = validTaggedList
        .filter((asset: any) => !asset.hasOwnProperty('hide'))
        .sort((a: any, b: any) => a.order - b.order)
        .map((asset: { id: string }) => asset.id);

    if (hiddenList.length > 0) {
        assetList = assetList?.filter((asset) => hiddenList.indexOf(asset) < 0);
    }
    if (orderedList.length > 0) {
        assetList = assetList?.filter((asset) => orderedList.indexOf(asset) < 0);
    }
    const orderedAssetList = assetList?.concat(orderedList);

    const parsedAssets = orderedAssetList?.map((asset) => RSS3Utils.id.parseAsset(asset));
    const nfts = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'NFT');
    const donations = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'Donation');
    const footprints = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'POAP');

    return {
        nfts: nfts && nfts.length > 0 ? nfts : <AnyObject[]>[],
        donations: donations && donations.length > 0 ? donations : <AnyObject[]>[],
        footprints: footprints && footprints.length > 0 ? footprints : <AnyObject[]>[],
    };
}

async function loadAssets(parsedAssets: AnyObject[]) {
    const apiUser = RSS3.getAPIUser();

    const assetIDList = parsedAssets.map((asset) =>
        RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
    );
    return assetIDList.length !== 0
        ? (await apiUser.persona.assets.getDetails({
              assets: assetIDList,
              full: true,
          })) || []
        : [];
}

async function getAssetsTillSuccess(assetSet: Set<string>, delay: number = 1500, count: number = 5) {
    const apiUser = RSS3.getAPIUser();
    return new Promise<(NFTResponse | GitcoinResponse | POAPResponse)[]>(async (resolve, reject) => {
        const tryReq = async () => {
            try {
                const details = (await apiUser.persona.assets.getDetails({
                    assets: Array.from(assetSet),
                    full: true,
                })) as (NFTResponse | GitcoinResponse | POAPResponse)[];
                if (details) {
                    resolve(details);
                    return true;
                }
            } catch (e) {
                reject(e);
            }
            return false;
        };

        if (!(await tryReq())) {
            let iv = setInterval(async () => {
                count--;
                if (count < 0) {
                    resolve([]);
                    clearInterval(iv);
                } else if (await tryReq()) {
                    clearInterval(iv);
                }
            }, delay);
        }
    });
}

async function initAccounts() {
    const listed: RSS3Account[] = [];
    const unlisted: RSS3Account[] = [];

    const pageOwner = RSS3.getPageOwner();
    const allAccounts = (await pageOwner.profile?.accounts) || [];
    for (const account of allAccounts) {
        if (account.tags?.includes(`${config.tags.prefix}:${config.tags.hiddenTag}`)) {
            unlisted.push(account);
        } else {
            listed.push(account);
        }
    }

    return {
        listed: utils.sortByOrderTag(listed),
        unlisted,
    };
}

function isAsset(field: string | undefined): boolean {
    const condition = ['NFT', 'POAP', 'Gitcoin'];
    return !!(field && condition.find((item) => field.includes(item)));
}

const filterTagSQLMap = new Map([
    [FILTER_TAGS.nft, 'NFT'],
    [FILTER_TAGS.donation, 'Gitcoin'],
    [FILTER_TAGS.footprint, 'POAP'],
    [FILTER_TAGS.content, 'Twitter,Mirror.XYZ,Misskey'],
]);

const allFilterTagQueryString = 'NFT,Gitcoin,POAP,Twitter,Mirror.XYZ,Misskey';

async function initContent(timestamp: string = '', following: boolean = false, filters?: { key: any; value: any }[]) {
    const assetSet = new Set<string>();
    const profileSet = new Set<string>();
    const apiUser = await RSS3.getAPIUser();
    const pageOwner = await RSS3.getPageOwner();

    let items: any = [];

    let fieldLikeParam = allFilterTagQueryString;

    let result: any = [];

    filters?.forEach((tag) => {
        fieldLikeParam = fieldLikeParam.replace(filterTagSQLMap.get(FILTER_TAGS.content)!, '');

        if (tag.value && tag.key != FILTER_TAGS.content) {
            fieldLikeParam.split(',').forEach((i) => {
                if (i == filterTagSQLMap.get(tag.key)) {
                    result.push(i);
                }
            });
        }

        if (tag.value && tag.key == FILTER_TAGS.content) {
            result.push(filterTagSQLMap.get(FILTER_TAGS.content));
        }
    });

    fieldLikeParam = result.join(',') || '';

    if (filters && following) {
        if (fieldLikeParam != '') {
            items =
                (await apiUser.persona.items.getListByPersona({
                    persona: pageOwner.address,
                    linkID: 'following',
                    limit: config.splitPageLimits.contents,
                    tsp: timestamp,
                    fieldLike: fieldLikeParam,
                })) || [];
        }
    } else if (!following) {
        items =
            (await apiUser.persona.items.getListByPersona({
                persona: pageOwner.address,
                limit: config.splitPageLimits.contents,
                tsp: timestamp,
            })) || [];
    }

    const haveMore = items.length === config.splitPageLimits.contents;

    profileSet.add(pageOwner.address);
    items.forEach((item: any) => {
        if ('target' in item) {
            // Is auto item
            if (isAsset(item.target.field)) {
                assetSet.add(item.target.field.substring(7, item.target.field.length));
            }
        }
        profileSet.add(item.id.split('-')[0]);
    });

    const [details, profiles] = await Promise.all([
        assetSet.size !== 0 ? getAssetsTillSuccess(assetSet) : [],
        profileSet.size !== 0
            ? apiUser.persona?.profile.getList(Array.from(profileSet))?.then((res) => res || []) || []
            : [],
    ]);

    const listed: ItemDetails[] = [];

    items.forEach((item: any) => {
        const profile = profiles.find((element: any) => element.persona === item.id.split('-')[0]);
        let ItemDetails: ItemDetails = {
            item: item,
            avatar: profile?.avatar?.[0] || config.undefinedImageAlt,
            name: profile?.name || formatter(profile?.persona) || '',
        };

        if ('target' in item) {
            // Is auto item
            if (isAsset(item.target.field)) {
                let assetDetails: {
                    name?: string;
                    description?: string | null;
                    image_url?: string | null;
                } = {
                    image_url: config.undefinedImageAlt,
                };

                const asset = details.find(
                    (asset) => asset.id === item.target?.field.substring(7, item.target.field.length),
                );

                if (asset) {
                    if (item.target.field.includes('Gitcoin')) {
                        // handle Gitcoin record
                        let DonationDetails = asset.detail as DonationDetailByGrant;
                        assetDetails = {
                            name: DonationDetails.grant.title,
                            description: DonationDetails.grant.description,
                            image_url: DonationDetails.grant.logo,
                        };
                    } else if (item.target.field.includes('NFT')) {
                        // handle NFT
                        let NFTDetails = asset.detail as NFT;
                        assetDetails = {
                            name: NFTDetails.name,
                            description: NFTDetails.description,
                            image_url:
                                NFTDetails.image_preview_url ||
                                NFTDetails.image_url ||
                                NFTDetails.image_thumbnail_url ||
                                NFTDetails.animation_url ||
                                NFTDetails.animation_original_url,
                        };
                    } else {
                        // handle POAP
                        let POAPDetails = asset.detail as POAP;
                        assetDetails = {
                            name: POAPDetails.name,
                            description: POAPDetails.description,
                            image_url: POAPDetails.image_url,
                        };
                    }
                }

                ItemDetails.details = assetDetails;
            }
        }

        listed.push(ItemDetails);
    });

    return {
        listed: listed,
        haveMore: haveMore,
    };
}

function extractEmbedFields(raw: string, fieldsEmbed: string[]) {
    const fieldPattern = /<([A-Z]+?)#(.+?)>/gi;
    const fields = raw.match(fieldPattern) || [];
    const extracted = raw.replace(fieldPattern, '');
    const fieldsMatch: {
        [key: string]: string;
    } = {};

    for (const field of fields) {
        const splits = fieldPattern.exec(field) || [];
        if (fieldsEmbed.includes(splits[1])) {
            fieldsMatch[splits[1]] = splits[2];
        }
    }

    return {
        extracted,
        fieldsMatch,
    };
}

function fixURLSchemas(url: string) {
    let fixedUrl = url;
    if (url.startsWith('ipfs://')) {
        fixedUrl = url.replace('ipfs://', config.ipfs.download.endpoint + '/');
    }
    return fixedUrl;
}

function setStorage(key: string, value: string) {
    if (value) {
        localStorage.setItem(key, value);
    } else {
        localStorage.removeItem(key);
    }
}

function getStorage(key: string): string | null {
    return localStorage.getItem(key);
}

function strMapToObj(strMap: any) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

function objToStrMap(obj: any) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

const toExternalAccountDetails = (platform: string, identity: string) => {
    switch (platform) {
        case 'EVM+':
            window.open(`https://etherscan.io/address/${identity}`, '_blank');
            break;
        case 'Twitter':
            window.open(`https://twitter.com/${identity}`, '_blank');
            break;
        case 'Misskey':
            const [username, instance] = identity.split('@');
            window.open(`https://${instance}/@${username}`, '_blank');
            break;
    }
};

const utils = {
    sortByOrderTag,
    initAssets,
    loadAssets,
    initAccounts,
    extractEmbedFields,
    initContent,
    fixURLSchemas,
    setStorage,
    getStorage,
    strMapToObj,
    objToStrMap,
    toExternalAccountDetails,
};

export default utils;
