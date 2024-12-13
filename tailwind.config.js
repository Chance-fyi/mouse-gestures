/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {}
  },
  mode: "jit",
  darkMode: "class",
  content: ["./src/**/*.tsx"],
  plugins: [
    require("daisyui"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwind-scrollbar")
  ]
}
