// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Jost", "sans-serif"],  // Jost becomes the default Tailwind font
      },
    },
  },
  plugins: [],
};
