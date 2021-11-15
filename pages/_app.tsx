import '../styles/globals.css';
import '../styles/animation.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
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
