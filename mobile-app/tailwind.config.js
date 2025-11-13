const colors = require("./colors").default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./index.tsx", 
    "./components/**/*.{js,ts,jsx,tsx}", 
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        source: ['Fustat', 'serif'],
      },
      colors
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        '.page-title-text': {
          '@apply font-source text-7xl font-bold leading-none': {},
        },
        '.components-text': {
          '@apply font-source text-lg font-bold leading-none': {},
        },
        '.link-text': {
          '@apply font-source text-lg font-bold leading-none': {},
        },
        '.body1-desktop-semi-text': {
          '@apply font-source text-2xl font-semibold leading-none': {},
        },
        '.body1-desktop-bold-text': {
          '@apply font-source text-2xl font-bold leading-none': {},
        },
      });
    },
  ],
}