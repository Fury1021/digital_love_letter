import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        love: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48", // Rose #E11D48
          700: "#be123c", // Red #BE123C
          800: "#9f1239",
          900: "#881337",
          950: "#4c0519",
        },
        romantic: {
          pink: "#F9A8D4",
          lightPink: "#FCE7F3",
          rose: "#E11D48",
          red: "#BE123C",
          dark: "#111111",
          cream: "#FFFDF9",
          parchment: "#FDFBF7",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        dancing: ["var(--font-dancing)", "cursive"],
        caveat: ["var(--font-caveat)", "cursive"],
        "great-vibes": ["var(--font-great-vibes)", "cursive"],
        pacifico: ["var(--font-pacifico)", "cursive"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'paper-lg': '0 10px 30px -5px rgba(225, 29, 72, 0.08), 0 8px 16px -6px rgba(0, 0, 0, 0.04)',
        'envelope': '0 20px 40px -15px rgba(190, 18, 60, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-3deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
