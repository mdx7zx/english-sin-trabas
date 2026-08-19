import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#12251f",
        forest: "#153f34",
        moss: "#2c6e5b",
        mint: "#c9f2df",
        lime: "#dff26d",
        cream: "#f7f8f1",
        coral: "#ff8a67",
        sky: "#99dbea",
      },
      boxShadow: {
        card: "0 18px 45px rgba(21, 63, 52, 0.08)",
        float: "0 14px 32px rgba(21, 63, 52, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
