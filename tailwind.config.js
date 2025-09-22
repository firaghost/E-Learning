/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ethiopia-green': '#078930',
        'ethiopia-yellow': '#FCDD09',
        'ethiopia-red': '#DA121A',
        ethiopia: {
          green: '#078930',
          yellow: '#FCDD09',
          red: '#DA121A',
        },
      },
    },
  },
  plugins: [],
}