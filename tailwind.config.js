/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            scale: {
                '150': '1.5',
            }
        }
    },
    mode: "jit",
    darkMode: "class",
    content: ["./**/*.tsx"],
    plugins: [
        require('daisyui'),
    ],
}