import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN: string = 'https://4394a5cae4034481b7e6602d7a5640c7@sentry.rss3.dev/4';

Sentry.init({
    dsn: SENTRY_DSN,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 0.2,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
});
