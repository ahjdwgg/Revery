import { RSS3Account, RSS3Asset } from 'rss3-next/types/rss3';
import config from './config';

const orderPattern = new RegExp(`^${config.tags.prefix}:order:(-?\d+)$`, 'i');

type TypesWithTag = RSS3Account | RSS3Asset;

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

const setTaggedOrder = (tagged: TypesWithTag, order: number): void => {
    if (!tagged.tags) {
        tagged.tags = [];
    } else {
        // const orderPattern = /^pass:order:(-?\d+)$/i;
        const oldIndex = tagged.tags.findIndex((tag) => orderPattern.test(tag));
        if (oldIndex !== -1) {
            tagged.tags.splice(oldIndex, 1);
        }
    }
    tagged.tags.push(`pass:order:${order}`);
};

const sortByOrderTag = (taggeds: TypesWithTag[]): TypesWithTag[] => {
    taggeds.sort((a, b) => {
        return getTaggedOrder(a) - getTaggedOrder(b);
    });
    return taggeds;
};

const setOrderTag = async (taggeds: TypesWithTag[]): Promise<TypesWithTag[]> => {
    await Promise.all(
        taggeds.map(async (tagged, index) => {
            setTaggedOrder(tagged, index);
        }),
    );
    return taggeds;
};

export default {
    sortByOrderTag,
    setOrderTag,
};
