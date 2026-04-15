import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f8fa",
          100: "#eef1f6",
          200: "#d5dce6",
          300: "#aeb8c8",
          400: "#7d8aa0",
          500: "#5c677a",
          600: "#3f4756",
          700: "#2b313c",
          800: "#1a1e26",
          900: "#0f1218",
        },
        accent: {
          DEFAULT: "#e85d4c",
          hover: "#d14a3a",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "\"Segoe UI\"",
          "\"PingFang SC\"",
          "\"Hiragino Sans GB\"",
          "\"Microsoft YaHei\"",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
