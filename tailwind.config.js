/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./views/*.ejs",
    "./app.js",
    "./models/**/*.js",
    "./config/**/*.js",
    "./public/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
