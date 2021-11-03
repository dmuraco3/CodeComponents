module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      dropShadow: {
        'cool': '0px 0px 4px rgba(0, 0, 0, 0.25)',
      },
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    }
  },
  variants: {
    extend: {
      border: ['hover'],
      cursor: ['hover'],
    },
  },
  plugins: [],
}
