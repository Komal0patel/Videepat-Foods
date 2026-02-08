/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f4f7f0',
                    100: '#e3ecdb',
                    200: '#c5dcb3',
                    300: '#9ec482',
                    400: '#79a855',
                    500: '#5c8d37',
                    600: '#467029',
                    700: '#385823',
                    800: '#2f4620',
                    900: '#273a1d',
                    950: '#131f0d',
                },
            },
        },
    },
    plugins: [],
}
