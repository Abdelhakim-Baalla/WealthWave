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
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0ea5e9", // sky-500
          dark: "#0369a1", // sky-700
          light: "#38bdf8", // sky-400
          accent: "#22c55e", // green-500
        },
        surface: {
          DEFAULT: "#0b1220",
          card: "#111827",
          muted: "#1f2937",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        xl: "14px",
      },
    },
  },
  plugins: [],
};
