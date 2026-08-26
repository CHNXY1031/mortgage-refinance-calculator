import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#071A2B",
        ocean: "#0C2D48",
        emerald: "#18B981",
        ivory: "#F5F2E9",
        slateink: "#34485A",
      },
      boxShadow: {
        float: "0 28px 70px -34px rgba(7, 26, 43, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
