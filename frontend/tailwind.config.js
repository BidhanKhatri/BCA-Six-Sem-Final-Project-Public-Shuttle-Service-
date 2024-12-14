/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-black': '0px 0px 8px 8px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

