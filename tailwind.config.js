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
    flex: {
      post: '1 1 25%',
      1: '1'
    },
    minWidth: {
      'post': '300px'
    },
    minWidth: {
      'gridItem': '200px',
    },
    padding: {
      '1/12': '8.33%',
      '2/12': '16.67%',
      '3/12': '25%',
      '4/12': '33.33%',
      '5/12': '41.67%',
      '6/12': '50%',
      '7/12': '58.33%',
      '8/12': '66.67%',
      '9/12': '75%',
      '10/12': '83.33%',
      '11/12': '91.67%',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
    },
    extend: {
      
      gridTemplateColumns: {
        'footer': '200px minmax(900px, 1fr) 100px'
      },
      dropShadow: {
        'cool': '0px 0px 4px rgba(0, 0, 0, 0.25)',
        'active': '0px 0px 12px rgba(79, 70, 229, 0.6)'
      },
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    boxShadow: {
      'cool': '0px 0px 4px rgba(0, 0, 0, 0.25)',
      'active': '0px 0px 12px rgba(79, 70, 229, 0.6)'
    },
    zIndex: {
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      60: '60',
      70: '70',
      80: '80',
      90: '90',
      100: '100',
      110: '110',
      120: '120',
      130: '130',
      140: '140',
      150: '150',
    }

  },
  variants: {
    extend: {
      border: ['hover'],
      cursor: ['hover'],
      dropShadow: ['hover', 'active'],
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
