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
        'accent-yellow': '#ffecd0'
      },
      backgroundImage: {
        'comic_bg': "url('/public/static/images/comicbackground.svg)"
      },
    },
  },
  plugins: [
  ]
}