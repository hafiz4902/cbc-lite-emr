// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = { // Perhatikan 'module.exports' untuk Tailwind v3 (jika tidak menggunakan type: module di package.json)
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ini sangat penting! Memindai semua file di src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
