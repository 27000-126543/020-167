/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        carbon: "#1C1C1E",
        emerald: {
          DEFAULT: "#0A8F6C",
          light: "#E8F5EF",
          dark: "#076B51",
        },
        amber: {
          DEFAULT: "#E8913A",
          light: "#FEF3E8",
        },
        warm: {
          DEFAULT: "#FAFAF8",
          50: "#FEFEFE",
          100: "#F7F7F5",
          200: "#F2F2F0",
          300: "#E5E5E3",
          400: "#D1D1CF",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"DM Mono"', '"Roboto Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
