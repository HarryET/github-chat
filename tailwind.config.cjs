const mona = '"Mona Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        "sans": mona,
        "mona": mona,
        "hubot": `"Hubot Sans",${mona}`,
        "mono": "'JetBrains Mono', monospace"
      },
      colors: {
        // 600
        brand: { '50': '#FAF7F9', '100': '#F2EAEF', '200': '#E2D1DC', '300': '#D2B8C9', '400': '#C39FB6', '500': '#B386A3', '600': '#A36D90', '700': '#845373', '800': '#623E55', '900': '#402837' },
        green: "#73A580",
        amber: "#F4D35E",
        red: "#CF4D6F",
      }
    },
  },
  plugins: [],
}
