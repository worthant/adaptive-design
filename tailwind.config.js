/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,svg}", "./src/**/*.{html,js,svg}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'hit',
    'miss',
  ]
};


