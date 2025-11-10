/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-background': '#0B0F1A',
        'brand-primary': '#8E2DE2',
        'brand-secondary': '#00D4FF',
        'brand-text': '#E0E0FF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 15px 5px rgba(142, 45, 226, 0.4)',
        'glow-secondary': '0 0 15px 5px rgba(0, 212, 255, 0.4)',
      }
    },
  },
  plugins: [],
}
