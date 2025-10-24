/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-purple': '#7A1CA9',
        'dark-purple': '#5B21B6',
        'light-purple': '#A78BFA',
      },
    },
  },
  plugins: [],
}
