/** @type {import('tailwindcss').Config} */
const { colors } = require("./colors");

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./index.tsx",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        source: ["Fustat", "serif"],
      },
      colors,
      fontSize: {
        "page-title": "2.5rem", // ~40px
        "body1-desktop": "1.25rem", // ~20px
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ".page-title-text": {
          fontFamily: "Fustat, serif",
          fontSize: "2.5rem",
          fontWeight: "700",
          lineHeight: "1",
        },
        ".components-text": {
          fontFamily: "Fustat, serif",
          fontSize: "1.125rem",
          fontWeight: "700",
          lineHeight: "1",
        },
        ".link-text": {
          fontFamily: "Fustat, serif",
          fontSize: "1.125rem",
          fontWeight: "700",
          lineHeight: "1",
        },
        ".body1-desktop-semi-text": {
          fontFamily: "Fustat, serif",
          fontSize: "1.25rem",
          fontWeight: "600",
          lineHeight: "1",
        },
        ".body1-desktop-bold-text": {
          fontFamily: "Fustat, serif",
          fontSize: "1.25rem",
          fontWeight: "700",
          lineHeight: "1",
        },
      });
    },
  ],
};
