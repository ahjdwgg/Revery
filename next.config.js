/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
        domains: ['i.imgur.com', 'rss3.mypinata.cloud', 'http.cat', 'c.gitcoin.co', 'assets.poap.xyz', 'pbs.twimg.com'],
        formats: ['image/avif', 'image/webp'],
    },
};
