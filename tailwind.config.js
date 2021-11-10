module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: '#0072ff',
                account: {
                    DEFAULT: '#40D22F',
                    bg: '#F6FFF5',
                },
                nft: {
                    DEFAULT: '#7553ff',
                    bg: '#f7f5ff',
                },
                donation: {
                    DEFAULT: '#11BC92',
                    bg: '#F0FFFA',
                },
                footprint: {
                    DEFAULT: '#FFB426',
                    bg: '#FFF9F0',
                },
            },
            opacity: {
                5: '.05', //link button bg; disabled save button bg
                10: '.1', //input stroke
                40: '.4', //primary button stroke; account outline stroke; privacy footer
                50: '.5', //comment and timestamp text; divider line
                70: '.7', //nft title, edit button text
            },
            borderRadius: {
                DEFAULT: '5px',
            },
            width: {
                '4/11': '36.36363636%',
                '7/11': '63.63636364%',
            },
            height: {
                md: '1.6rem',
            },
            padding: {
                sm: '0.2rem',
            },
            minWidth: {
                '1/4': '25%',
            },
            backgroundImage: (theme) => ({
                EVM: 'url(/chains/evm.png)',
                BSC: 'url(/chains/BSC.png)',
                Ethereum: 'url(/chains/Ethereum.png)',
                Polygon: 'url(/chains/Polygon.png)',
                Ronin: 'url(/chains/Ronin.png)',
                Misskey: 'url(/chains/Misskey.png)',
                Twitter: 'url(/chains/Twitter.png)',
            }),
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio')],
};