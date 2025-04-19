/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-geist-sans)"],
          mono: ["var(--font-geist-mono)"],
        },
        colors: {
          mint: {
            50:  '#f3faf8',
            100: '#d7f7ed',
            200: '#b0f0db',
            300: '#7de2c6',
            400: '#44d1ae',
            500: '#15b89c',
            600: '#0e9b81',
            700: '#0c7c66',
            800: '#0c5f50',
            900: '#094940',
          },
          lavender: {
            50:  '#f8f7fc',
            100: '#ebe7fa',
            200: '#d6ccf6',
            300: '#b7a5ea',
            400: '#9a7fd8',
            500: '#7e5fdc',
            600: '#6849b7',
            700: '#4e3688',
            800: '#38245a',
            900: '#241336',
          },
        },
        typography: {
          DEFAULT: {
            css: {
              maxWidth: "100%",
            },
          },
        },
      },
    },
    plugins: [],
  };