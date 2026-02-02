import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f8ff",
          100: "#e0edff",
          200: "#bcd6ff",
          300: "#8ab7ff",
          400: "#5b96fb",
          500: "#3976e6",
          600: "#2b5dc0",
          700: "#254c99",
          800: "#243f79",
          900: "#1f345f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
