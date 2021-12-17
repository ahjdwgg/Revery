module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0072ff',
                    bg: '#F2F8FF',
                    asset: '#FAFAFA',
                },
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
                secondary: {
                    DEFAULT: '#0072ff',
                    bg: '#F4F7F8',
                },
                metamask: {
                    text: '#944300',
                    bg: '#fff4eb',
                },
                filter: {
                    DEFAULT: '#F2F2F2',
                },
                error: '#D75F5F',
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
                half: '50%',
            },
            width: {
                '4/11': '36.36363636%',
                '7/11': '63.63636364%',
                160: '40rem',
            },
            height: {
                md: '1.6rem',
                modal: '60vh',
            },
            padding: {
                sm: '0.2rem',
                0.2: '0.05rem',
                0.8: '0.2rem',
            },
            minWidth: {
                '1/4': '25%',
            },
            boxShadow: {
                DEFAULT: '0px 4px 6px -2px rgba(0, 0, 0, 0.02), 0px 10px 15px -3px rgba(0, 0, 0, 0.04)',
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
            cursor: {
                move: 'move',
                grab: 'grab',
            },
            keyframes: {
                'fade-in': {
                    '0%': {
                        opacity: '0',
                    },
                    '100%': {
                        opacity: '1',
                    },
                },
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(15px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-in',
                'fade-in-up': 'fade-in-up 0.35s ease-in',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/line-clamp')],
};
