/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uci-blue': '#005596',
        'uci-gold': '#FFD700',
        'gold': '#D4AF37',
        'silver': '#C0C0C0',
        'bronze': '#CD7F32',
      },
    },
  },
  plugins: [],
}