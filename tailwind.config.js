/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'a1-orange': '#D35400',
        'a1-green': '#1E7A35',
        'a1-red': '#A80000',
      },
    },
  },
  plugins: [],
}
