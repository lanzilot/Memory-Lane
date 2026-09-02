/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        felt: "#123B36",
        feltPanel: "#1B4F47",
        feltLine: "#2E655C",
        coral: "#FF6F59",
        coralDark: "#E0553F",
        butter: "#FFD166",
        cream: "#F7F3E9",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
