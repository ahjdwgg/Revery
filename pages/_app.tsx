import '../styles/globals.css';
import '../styles/animation.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import RSS3 from '../common/rss3';

function MyApp({ Component, pageProps }: AppProps) {
    const init = async () => {
        await RSS3.reconnect();
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://fonts.googleapis.com/css?family=Open+Sans:400,500,600,700"
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
