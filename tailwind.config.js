// tailwind.config.js
// Design tokens: a restrained, neutral enterprise palette with the brand blue used sparingly.
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Matter ships with the project (public/font).
        sans: ["Matter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Matter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        // Cool neutral scale (text, borders, surfaces)
        ink: {
          DEFAULT: "#0F172A",
          900: "#0B1220",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F1F5F9",
          50: "#F8FAFC",
        },
        // Brand blue (from the Prospect Intel mark)
        signal: {
          DEFAULT: "#0A7CC2",
          700: "#07669F",
          600: "#0971B2",
          100: "#D9EAF6",
          50: "#EEF6FB",
        },
        canvas: "#F6F7F9",
        line: "#E5E8EC",
        grade: {
          a: "#047857",
          b: "#4D7C0F",
          c: "#B45309",
          d: "#C2410C",
          f: "#DC2626",
          na: "#94A3B8",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04)",
        lift: "0 4px 12px -2px rgba(15,23,42,0.10), 0 1px 3px rgba(15,23,42,0.06)",
        pop: "0 12px 32px -8px rgba(15,23,42,0.22), 0 2px 8px rgba(15,23,42,0.08)",
      },
      keyframes: {
        splashSpin: { to: { transform: "rotate(360deg)" } },
        splashGlow: {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.95", transform: "scale(1.14)" },
        },
        splashLogo: {
          from: { opacity: "0", transform: "scale(0.8) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        splashRise: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        splashChip: {
          "0%, 100%": { opacity: "0.28", transform: "translateY(0) scale(0.96)" },
          "40%": { opacity: "1", transform: "translateY(-4px) scale(1)" },
        },
        splashBar: {
          from: { transform: "translateX(-120%)" },
          to: { transform: "translateX(330%)" },
        },
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        "rise-in": {
          from: { opacity: 0, transform: "translateY(4px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "splash-spin": "splashSpin 2.4s linear infinite",
        "splash-glow": "splashGlow 2.6s ease-in-out infinite",
        "splash-logo": "splashLogo 700ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "splash-rise": "splashRise 650ms ease-out both",
        "splash-chip": "splashChip 1.9s ease-in-out infinite both",
        "splash-bar": "splashBar 1.5s ease-in-out infinite",
        "fade-in": "fade-in 120ms ease-out",
        "rise-in": "rise-in 140ms ease-out",
        "slide-in-right": "slide-in-right 200ms ease-out",
        "slide-up": "slide-up 200ms ease-out",
      },
    },
  },
  plugins: [],
};
