import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bungee: ["var(--font-bungee)", "cursive"],
        rubik: ["var(--font-rubik)"],
      },
    },
  },
  plugins: [],
};
export default config;
