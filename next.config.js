/** @type {import('next').NextConfig} */
// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

module.exports = {
    reactStrictMode: true,
    images: {
        formats: ['image/avif', 'image/webp'],
    },
};
