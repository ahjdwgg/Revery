import { GeneralAsset, GeneralAssetWithTags } from './types';
import config from './config';
import RSS3 from './rss3';
import { RSS3Account, RSS3Asset } from './rss3Types';
import { utils as RSS3Utils } from 'rss3';
import { AnyObject } from 'rss3/types/extend';
import { formatter } from './address';
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

const setTaggedOrder = (tagged: TypesWithTag, order?: number): void => {
    if (!tagged.tags) {
        tagged.tags = [];
    } else {
        // const orderPattern = /^pass:order:(-?\d+)$/i;
        const oldIndex = tagged.tags.findIndex((tag) => orderPattern.test(tag));
        if (oldIndex !== -1) {
            tagged.tags.splice(oldIndex, 1);
        }
    }
    if (order) {
        tagged.tags.push(`${config.tags.prefix}:order:${order}`);
    } else {
        tagged.tags.push(`${config.tags.prefix}:${config.tags.hiddenTag}`);
    }
};

function sortByOrderTag<T extends TypesWithTag>(taggeds: T[]): T[] {
    taggeds.sort((a, b) => {
        return getTaggedOrder(a) - getTaggedOrder(b);
    });
    return taggeds;
}

const setOrderTag = async (taggeds: TypesWithTag[]): Promise<TypesWithTag[]> => {
    await Promise.all(
        taggeds.map(async (tagged, index) => {
            setTaggedOrder(tagged, index);
        }),
    );
    return taggeds;
};

const setHiddenTag = async (taggeds: TypesWithTag[]): Promise<TypesWithTag[]> => {
    await Promise.all(
        taggeds.map(async (tagged) => {
            setTaggedOrder(tagged);
        }),
    );
    return taggeds;
};

const mergeAssetsTags = async (assetsInRSS3File: RSS3Asset[], assetsGrabbed: GeneralAsset[]) => {
    return await Promise.all(
        (assetsGrabbed || []).map(async (ag: GeneralAssetWithTags) => {
            const origType = ag.type;
            if (config.hideUnlistedAssets) {
                ag.type = 'Invalid'; // Using as a match mark
            }
            for (const airf of assetsInRSS3File) {
                let asset = RSS3Utils.id.parseAsset(airf);
                if (
                    asset.platform === ag.platform &&
                    asset.identity === ag.identity &&
                    asset.uniqueID === ag.uniqueID &&
                    asset.type === origType
                ) {
                    // Matched
                    ag.type = origType; // Recover type
                    // if (asset.tags) {
                    //     ag.tags = airf.tags;
                    // }
                    break;
                }
            }
            return ag;
        }),
    );
};

interface AssetsList {
    listed: GeneralAssetWithTags[];
    unlisted: GeneralAssetWithTags[];
}

async function initAssets() {
    const pageOwner = RSS3.getPageOwner();
    let assetList = await pageOwner.assets?.auto.getList(pageOwner.address);
    console.log(assetList);
    let taggedList = [];
    const passTags = (await pageOwner.files.get(pageOwner.address))._pass?.assets;
    taggedList = passTags ? passTags : [];
    const hidedList = taggedList.filter((asset: any) => asset.hasOwnProperty('hide'));

    const orderedList = taggedList
        .filter((asset: any) => !asset.hasOwnProperty('hide'))
        .sort((a: any, b: any) => a.order - b.order);

    console.log('total assets');
    console.log(assetList?.length);
    console.log('tagged assets');
    console.log(taggedList.length);
    console.log('hide is true assets');
    console.log(hidedList.length);
    console.log('has order number assets');
    console.log(orderedList.length);

    if (hidedList.length > 0) {
        assetList = assetList?.filter((asset) => !hidedList.includes(asset));
    }
    console.log('remove hided');
    console.log(assetList);
    if (orderedList.length > 0) {
        assetList = assetList?.filter((asset) => !orderedList.includes(asset));
    }
    console.log('listed unordered assets');
    console.log(assetList);

    const orderedAssetList = assetList?.concat(orderedList.map((asset: { id: string }) => asset.id));

    console.log('listed & ordered assets');
    console.log(orderedAssetList?.length);

    const parsedAssets = orderedAssetList?.map((asset) => RSS3Utils.id.parseAsset(asset));
    const nfts = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'NFT');
    const donations = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'Donation');
    const footprints = parsedAssets?.filter((asset) => asset.type.split('.')[1] === 'POAP');

    console.log('NFT');
    console.log(nfts);
    console.log('donations');
    console.log(donations);
    console.log('Footprints');
    console.log(footprints);

    return {
        nfts: nfts && nfts.length > 0 ? nfts : <AnyObject[]>[],
        donations: donations && donations.length > 0 ? donations : <AnyObject[]>[],
        footprints: footprints && footprints.length > 0 ? footprints : <AnyObject[]>[],
    };
}

async function loadAssets(parsedAssets: AnyObject[]) {
    const pageOwner = RSS3.getPageOwner();

    const assetIDList = parsedAssets.map((asset) =>
        RSS3Utils.id.getAsset(asset.platform, asset.identity, asset.type, asset.uniqueID),
    );
    const assetDetails =
        assetIDList.length !== 0
            ? (await pageOwner.assets?.getDetails({
                  persona: pageOwner.address,
                  assets: assetIDList,
                  full: true,
              })) || []
            : [];
    return assetDetails;
}

async function getOrderedAssets() {}
async function getAssetProfileWaitTillSuccess(address: string, type: string, delay: number = 500) {
    return new Promise<GeneralAsset[]>(async (resolve, reject) => {
        const tryReq = async () => {
            try {
                const assetProfileRes = await RSS3.getAssetProfile(address, type);
                if (assetProfileRes?.status) {
                    resolve(assetProfileRes?.assets || []);
                }
                return true;
            } catch (e) {
                reject(e);
            }
            return false;
        };

        if (!(await tryReq())) {
            let iv = setInterval(async () => {
                if (await tryReq()) {
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
    if (field && condition.find((item) => field.includes(item))) {
        return true;
    }
    return false;
}

async function initContent(timestamp: string = '', following: boolean = false) {
    const assetSet = new Set<string>();
    const profileSet = new Set<string>();
    let haveMore = true;
    const apiUser = await RSS3.getAPIUser();
    const pageOwner = await RSS3.getPageOwner();

    const items =
        (following
            ? await pageOwner.items?.getListByPersona({
                  persona: pageOwner.address,
                  linkID: 'following',
                  limit: 35,
                  tsp: timestamp,
              })
            : await pageOwner.items?.getListByPersona({
                  persona: pageOwner.address,
                  limit: 35,
                  tsp: timestamp,
              })) || [];

    haveMore = items.length === 35;

    profileSet.add(pageOwner.address);
    items.forEach((item) => {
        if (isAsset(item.target?.field)) {
            assetSet.add(item.target?.field.substring(7, item.target.field.length));
        }
        profileSet.add(item.id.split('-')[0]);
    });

    const details =
        assetSet.size !== 0
            ? (await pageOwner.assets?.getDetails({
                  persona: pageOwner.address,
                  assets: Array.from(assetSet),
                  full: true,
              })) || []
            : [];

    const profiles =
        profileSet.size !== 0 ? (await apiUser.persona?.profile.getList(Array.from(profileSet))) || [] : [];

    const listed: any[] = [];
    items.forEach((item) => {
        const profile = profiles.find((element: any) => element.persona === item.id.split('-')[0]);
        let temp: any = {
            ...item,
            avatar: profile?.avatar?.[0] || config.undefinedImageAlt,
            username: profile?.name || formatter(profile?.persona),
        };

        if (isAsset(item.target?.field)) {
            const asset = details.find(
                (asset) => asset.id === item.target?.field.substring(7, item.target.field.length),
            );

            if (asset) {
                let details;
                if (item.target?.field.includes('Gitcoin')) {
                    // handle Gitcoin record
                    details = {
                        name: asset.detail.grant.title,
                        description: asset.detail.grant.description,
                        image_url: asset.detail.grant.logo,
                        reference_url: asset.detail.grant.id
                            ? `https://gitcoin.co/grants/${asset.detail.grant.id}/${asset.detail.grant.slug}`
                            : 'https://gitcoin.co',
                    };
                } else {
                    // handle NFT and POAP
                    details = {
                        name: asset.detail.name,
                        description: asset.detail.description,
                        image_url:
                            asset.detail.image_preview_url ||
                            asset.detail.image_url ||
                            asset.detail.image_thumbnail_url ||
                            asset.detail.animation_url ||
                            asset.detail.animation_original_url,
                        reference_url: asset.detail.event_url,
                    };
                }
                listed.push({
                    ...temp,
                    details: details,
                });
            }
        } else {
            listed.push({ ...temp });
        }
    });
    console.log(listed);
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

const utils = {
    sortByOrderTag,
    setOrderTag,
    setHiddenTag,
    mergeAssetsTags,
    initAssets,
    loadAssets,
    initAccounts,
    extractEmbedFields,
    initContent,
};

export default utils;
