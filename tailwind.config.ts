import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e6f5f1",
          100: "#b3e0d4",
          200: "#80ccb8",
          300: "#4db89b",
          400: "#26a880",
          500: "#00896a",
          600: "#007b5f",
          700: "#006a52",
          800: "#005a45",
          900: "#003d2f",
          950: "#002b21",
        },
        surface: {
          50: "#fafbfc",
          100: "#f4f6f8",
          200: "#e9ecf0",
          300: "#d3d8e0",
          400: "#b0b8c4",
        },
        ink: {
          900: "#1a1d23",
          800: "#2d3139",
          700: "#3d424d",
          600: "#545b69",
          500: "#6b7280",
          400: "#9ca3af",
          300: "#d1d5db",
        },
        accent: {
          amber: "#f59e0b",
          red: "#ef4444",
          blue: "#3b82f6",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
        sidebar:
          "4px 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      borderRadius: {
        card: "0.75rem",
      },
      spacing: {
        sidebar: "4.5rem",
        "sidebar-expanded": "16rem",
      },
    },
  },
  plugins: [],
};

export default config;
