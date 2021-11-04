module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'editor': '#1E1E1E',
    }),
    screens: {
      xs: '500px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',

    },
    minWidth: {
      'gridItem': '200px',
    },
    extend: {
      gridTemplateColumns: {
        'footer': '200px minmax(900px, 1fr) 100px'
      },
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
