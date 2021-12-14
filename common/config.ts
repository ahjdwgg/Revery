const { PAGE_ENV } = process.env;

interface ProductsDefine {
    schema: string;
    baseDomain: string;
    subDomainMode: boolean;
}

const productsList: {
    [key: string]: ProductsDefine;
} = {
    RSS3Bio: {
        schema: 'https://',
        baseDomain: 'rss3.bio',
        subDomainMode: true,
    },
};

const config = {
    hubEndpoint: 'https://node-beta.rss3.dev',
    undefinedImageAlt: 'https://rss3.mypinata.cloud/ipfs/QmVFq9qimnudPcs6QkQv8ZVEsvwD3aqETHWtS5yXgdbYY5',
    hideUnlistedAssets: false,
    tags: {
        prefix: 'pass',
        hiddenTag: 'hidden',
    },
    productsList,
    fieldMaxLength: 280,
    walletConnectOptions: {
        rpc: {
            1: 'https://cloudflare-eth.com',
        },
        bridge: 'https://walletconnect-relay.rss3.dev',
    },
    contentRequestLimit: 5,
    rns: {
        suffix: '.rss3',
        serviceUrl: 'https://rss3.domains',
    },
};

export default config;
