module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: '#0072ff',
                nft: {
                    DEFAULT: '#7553ff',
                    bg: '#f7f5ff'
                },
                donation: {
                    DEFAULT: '#11BC92',
                    bg: '#F0FFFA'
                },
                footprint: {
                    DEFAULT: '#FFBB39',
                    bg: '#FFF9F0'
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
                DEFAULT: '5px'
            },
            minWidth: {
                '1/4': '25%',
            }

        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
    ],
};