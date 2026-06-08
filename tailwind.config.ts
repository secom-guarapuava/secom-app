import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0F2A47", 500: "#16385C", 600: "#16385C", 700: "#0F2A47", 800: "#0A1E36", 900: "#0A1623" },
        brand: { DEFAULT: "#E2622F", 400: "#F0743C", 500: "#E2622F", 600: "#C9521F", 50: "#FBEBE2" },
        soft: "#F2F4F7",
        ink: "#1B2733",
        muted: "#6B7888",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: {
        card: "0 1px 2px rgba(15,42,71,.04), 0 6px 18px rgba(15,42,71,.06)",
        cardhover: "0 2px 4px rgba(15,42,71,.06), 0 12px 28px rgba(15,42,71,.10)",
        float: "0 10px 26px rgba(226,98,47,.40)",
        nav: "0 -2px 24px rgba(15,42,71,.07)",
        navy: "0 12px 28px rgba(15,42,71,.30)",
      },
      backgroundImage: {
        "brand-grad": "linear-gradient(135deg,#F0743C 0%,#E2622F 55%,#C9521F 100%)",
        "navy-grad": "linear-gradient(160deg,#1B4570 0%,#0F2A47 58%,#0A2138 100%)",
        "navy-soft": "linear-gradient(160deg,#16385C 0%,#0F2A47 100%)",
        "shell-grad": "linear-gradient(180deg,#F6F8FB 0%,#EEF2F7 100%)",
      },
      keyframes: {
        pulseLive: {
          "0%": { boxShadow: "0 0 0 0 rgba(16,185,129,.5)" },
          "70%": { boxShadow: "0 0 0 8px rgba(16,185,129,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0)" },
        },
        equalize: {
          "0%,100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        recPulse: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".45", transform: "scale(.82)" },
        },
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        pulseLive: "pulseLive 1.4s infinite",
        equalize: "equalize 1s ease-in-out infinite",
        recPulse: "recPulse 1s ease-in-out infinite",
        floatIn: "floatIn .35s ease both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
