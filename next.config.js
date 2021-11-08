/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
        domains: ['i.imgur.com', 'rss3.mypinata.cloud'],
        formats: ['image/avif', 'image/webp'],
    },
};
