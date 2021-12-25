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
                <title>Revery</title>
                <link
                    rel="stylesheet"
                    type="text/css"
                    href="https://fonts.googleapis.com/css?family=Open+Sans:400,500,600,700"
                />
                <meta name="viewport" content="width=1024, initial-scale=1.0" />
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-9R6MPJZKWL"></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-9R6MPJZKWL');
                        `,
                    }}
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
