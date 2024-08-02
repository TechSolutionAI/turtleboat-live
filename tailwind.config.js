/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'Inter': ['"Inter"'],
        'ObelixPro': ['ObelixPro'],
      },
      colors: {
        'secondary-gray': '#E0E2E7',
        'secondary-gray-1': '#F7F7F9',
        'secondary-gray-2': '#F7F7F9',
        'secondary-gray-3': '#9ca1ad',
        'secondary-gray-4': '#6F727A',
        'primary-black': '#232325',
        'primary-blue': '#2E65F3',
        'secondary-red': '#F32D2D',
        'tertiary-red': '#CE0000',
        'secondary-red-1': '#FFDBDB',
        'secondary-green': '#249F5D',
        'tertiary-green': '#DCFBEA',
        'tertiary-blue': '#DCECFB',
        'secondary-green': '#249F5D',
        'accent-yellow': '#ffecd0',
        'arti-1': "#DEE3F3",
        'arti-2': "#E0D8E9",
        'arti-3': "#DFEFEF",
        'arti-4': "#F6DCF8",
        'eval-red': '#F39A9A',
        'eval-sel-red': '#EB5757',
        'eval-red-2': '#EDAC9A',
        'eval-sel-red-2': '#EB7B57',
        'eval-orange': '#F1BE92',
        'eval-sel-orange': '#F2994A',
        'eval-yellow': '#F1DB94',
        'eval-sel-yellow': '#F2C94C',
        'eval-green': '#A3DEC1',
        'eval-sel-green': '#6FCF97',
        'eval-green-2': '#77CAA0',
        'eval-sel-green-2': '#27AE60',
        'active-btn-border': '#515151',
      },
      backgroundImage: {
        'comic_bg': "url('/static/images/comicbackground.svg')",
        'active_btn': "url('/static/images/toolbox/active_btn_bg.png')",
      },
      boxShadow: {
        'custom-md': '0 6px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
  ]
}
