export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif'],
        comic: ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
        // add more here
      },
    },
  },
  plugins: [],
};