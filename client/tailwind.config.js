/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A5276",
        secondary: "#2E86C1",
        teal: "#0E6655",
        accent: "#D4AC0D",
        warning: "#E67E22",
        danger: "#A93226",
      },
      fontFamily: {
        primary: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
