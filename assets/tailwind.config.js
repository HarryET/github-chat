const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './js/**/*.js',
    '../lib/*_web.ex',
    '../lib/*_web/**/*.*ex',
  ],
  theme: {
    extend: {
      colors: {
        brand: colors.purple
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
