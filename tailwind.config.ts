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
        brand: {
          primary: "#FF6BEB",
          "primary-deep": "#E04BC4",
          secondary: "#4ECDC4",
          "secondary-deep": "#3DB8B0",
          yellow: "#FFE66D",
          mint: "#A8E6CF",
          lavender: "#C3B1E1",
          coral: "#F78888",
          text: "#2D3748",
          surface: "#FAFAFA",
        },
        accent: {
          DEFAULT: "#FF6BEB",
          hover: "#E04BC4",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "PingFang SC",
          "Hiragino Sans GB",
          "Microsoft YaHei",
          "sans-serif",
        ],
        /** Slightly round / friendly fallbacks without loading Google Fonts at build. */
        heading: [
          "Segoe UI",
          "system-ui",
          "-apple-system",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "1.15" }],
      },
    },
  },
  plugins: [],
};

export default config;
