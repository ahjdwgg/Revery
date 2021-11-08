/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
        domains: ['i.imgur.com', 'rss3.mypinata.cloud', 'http.cat'],
        formats: ['image/avif', 'image/webp'],
    },
};
