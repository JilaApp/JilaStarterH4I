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
//   ],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./App.{js,jsx,ts,tsx}",
//     "./app/**/*.{js,jsx,ts,tsx}",
//     "./components/**/*.{js,jsx,ts,tsx}",
//   ],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {
//       colors: {
//         jila: {
//           300: '#D4928F',
//           400: '#7E0601',
//         },
//         orange: {
//           300: '#F3CAAD',
//           400: '#E8965B',
//         },
//         yellow: {
//           400: '#EFBF6A',
//         },
//         cream: {
//           300: '#FFFBEF',
//         },
//         green: {
//           300: '#CDE6B9',
//           400: '#90BE6D',
//         },
//         teal: {
//           300: '#BDD0E2',
//           400: '#577590',
//         },
//         error: {
//           200: '#FBCFCF',
//           300: '#FF9494',
//           400: '#E31F1F',
//         },
//         type: {
//           400: '#361818',
//         },
//         white: '#FFFFFF',
//         gray: {
//           200: '#E8E8E8',
//           300: '#CDCDCD',
//           400: '#9C9C9C',
//         },
//       },
//     },
//   },
//   plugins: [],
// };



// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./App.{js,jsx,ts,tsx}",
//     "./app/**/*.{js,jsx,ts,tsx}",
//     "./components/**/*.{js,jsx,ts,tsx}",
//   ],
//   presets: [require("nativewind/preset")],
//   theme: {
//     extend: {
//       fontFamily: {
//         source: ["Fustat", "serif"],
//       },
//       fontSize: {
//         "page-title": 32, // roughly text-4xl
//         "body1-desktop-semi": 20,
//         "body1-desktop-bold": 20,
//       },
//       colors: {
//         jila: { 300: "#D4928F", 400: "#7E0601" },
//         orange: { 300: "#F3CAAD", 400: "#E8965B" },
//         yellow: { 400: "#EFBF6A" },
//         cream: { 300: "#FFFBEF" },
//         green: { 300: "#CDE6B9", 400: "#90BE6D" },
//         teal: { 300: "#BDD0E2", 400: "#577590" },
//         error: { 200: "#FBCFCF", 300: "#FF9494", 400: "#E31F1F" },
//         type: { 400: "#361818" },
//         white: "#FFFFFF",
//         gray: { 200: "#E8E8E8", 300: "#CDCDCD", 400: "#9C9C9C" },
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
          300: "rgba(212, 146, 143)",
          400: "rgba(126, 6, 1)",
        },
        orange: {
          300: "rgba(243, 202, 173)",
          400: "rgba(232, 150, 91)",
        },
        yellow: {
          400: "rgba(239, 191, 106)",
        },
        cream: {
          300: "rgba(255, 251, 243)",
        },
        green: {
          300: "rgba(205, 230, 185)",
          400: "rgba(144, 190, 109)",
        },
        teal: {
          300: "rgba(189, 208, 226)",
          400: "rgba(87, 117, 144)",
        },
        error: {
          200: "rgba(251, 207, 207)",
          300: "rgba(255, 148, 148)",
          400: "rgba(227, 31, 31)",
        },
        type: {
          400: "rgba(54, 24, 24)",
        },
        white: {
          400: "rgba(255, 255, 255)",
        },
        gray: {
          200: "rgba(232, 232, 232)",
          300: "rgba(205, 205, 205)",
          400: "rgba(156, 156, 156)",
        },
      },

      // ✅ Define reusable text styles here
      fontSize: {
        "page-title": 40, // adjust to your preferred scale
        "body1-desktop": 20,
      },
    },
  },
  plugins: [],
};
