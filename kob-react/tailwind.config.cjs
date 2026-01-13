/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'kob-primary': '#C5A059',
        'kob-dark': '#2D1E17',
        'kob-gold': '#D4AF37',
        'kob-light': '#F7F5F2',
      },
    },
  },
  plugins: [],
}
