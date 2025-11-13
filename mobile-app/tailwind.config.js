// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./App.{js,jsx,ts,tsx}", 
//     "./app/**/*.{js,jsx,ts,tsx}", 
//     "./index.tsx"
//   ],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {
//       fontFamily: {
//         source: ['Fustat', 'serif'],
//       },
//       colors: {
//         jila: {
//           300: 'rgba(212, 146, 143)',
//           400: 'rgba(126, 6, 1)',
//         },
//         orange: {
//           300: 'rgba(243, 202, 173)',
//           400: 'rgba(232, 150, 91)',
//         },
//         yellow: {
//           400: 'rgba(239, 191, 106)',
//         },
//         cream: {
//           300: 'rgba(255, 251, 243)',
//         },
//         green: {
//           300: 'rgba(205, 230, 185)',
//           400: 'rgba(144, 190, 109)',
//         },
//         teal: {
//           300: 'rgba(189, 208, 226)',
//           400: 'rgba(87, 117, 144)',
//         },
//         error: {
//           200: 'rgba(251, 207, 207)',
//           300: 'rgba(255, 148, 148)',
//           400: 'rgba(227, 31, 31)',
//         },
//         type: {
//           400: 'rgba(54, 24, 24)',
//         },
//         white: {
//           400: 'rgba(255, 255, 255)',
//         },
//         gray: {
//           200: 'rgba(232, 232, 232)',
//           300: 'rgba(205, 205, 205)',
//           400: 'rgba(156, 156, 156)',
//         },
//       },
//     },
//   },
//   plugins: [
//     function({ addBase }) {
//       addBase({
//         '.page-title-text': {
//           '@apply font-source text-7xl font-bold leading-none': {},
//         },
//         '.components-text': {
//           '@apply font-source text-lg font-bold leading-none': {},
//         },
//         '.link-text': {
//           '@apply font-source text-lg font-bold leading-none': {},
//         },
//         '.body1-desktop-semi-text': {
//           '@apply font-source text-2xl font-semibold leading-none': {},
//         },
//         '.body1-desktop-bold-text': {
//           '@apply font-source text-2xl font-bold leading-none': {},
//         },
//       });
//     },
//   ],
// }



// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./App.{js,jsx,ts,tsx}",
//     "./app/**/*.{js,jsx,ts,tsx}",
//     "./components/**/*.{js,jsx,ts,tsx}",
//     "./index.{js,jsx,ts,tsx}",
//   ],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {
//       fontFamily: {
//         source: ["Fustat", "serif"],
//       },
//       colors: {
//         jila: {
//           300: "rgba(212, 146, 143, 1)",
//           400: "rgba(126, 6, 1, 1)",
//         },
//         orange: {
//           300: "rgba(243, 202, 173, 1)",
//           400: "rgba(232, 150, 91, 1)",
//         },
//         yellow: {
//           400: "rgba(239, 191, 106, 1)",
//         },
//         cream: {
//           300: "rgba(255, 251, 243, 1)",
//         },
//         green: {
//           300: "rgba(205, 230, 185, 1)",
//           400: "rgba(144, 190, 109, 1)",
//         },
//         teal: {
//           300: "rgba(189, 208, 226, 1)",
//           400: "rgba(87, 117, 144, 1)",
//         },
//         error: {
//           200: "rgba(251, 207, 207, 1)",
//           300: "rgba(255, 148, 148, 1)",
//           400: "rgba(227, 31, 31, 1)",
//         },
//         type: {
//           400: "rgba(54, 24, 24, 1)",
//         },
//         white: {
//           400: "rgba(255, 255, 255, 1)",
//         },
//         gray: {
//           200: "rgba(232, 232, 232, 1)",
//           300: "rgba(205, 205, 205, 1)",
//           400: "rgba(156, 156, 156, 1)",
//         },
//       },

//       fontSize: {
//         "page-title": 40, // text-page-title
//         "body1-desktop": 20, // text-body1-desktop
//         "body2-desktop": 16,
//         "link": 18,
//       },
//     },
//   },
//   plugins: [],
// };




/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./index.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        source: ["Fustat", "serif"],
      },
      colors: {
        jila: {
          300: "rgba(212,146,143)",
          400: "rgba(126,6,1)",
        },
        orange: {
          300: "rgba(243,202,173)",
          400: "rgba(232,150,91)",
        },
        yellow: {
          400: "rgba(239,191,106)",
        },
        cream: {
          300: "rgba(255,251,243)",
        },
        green: {
          300: "rgba(205,230,185)",
          400: "rgba(144,190,109)",
        },
        teal: {
          300: "rgba(189,208,226)",
          400: "rgba(87,117,144)",
        },
        error: {
          200: "rgba(251,207,207)",
          300: "rgba(255,148,148)",
          400: "rgba(227,31,31)",
        },
        type: {
          400: "rgba(54,24,24)",
        },
        white: {
          400: "rgba(255,255,255)",
        },
        gray: {
          200: "rgba(232,232,232)",
          300: "rgba(205,205,205)",
          400: "rgba(156,156,156)",
        },
      },
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
