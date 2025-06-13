import type { Config } from "tailwindcss"
const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'var(--font-geist-sans)',
        ],
        mono: [
          'var(--font-geist-mono)',
        ],
      },
      colors: {
        // 무무 마스코트 색상 팔레트
        mumu: {
          cream: '#F5F1E8',      // 무무 배경색 (메인)
          'cream-dark': '#E8E1D3', // 약간 진한 크림
          'cream-light': '#FDFBF7', // 밝은 크림
          brown: '#D4A574',       // 무무 갈색
          'brown-dark': '#B8956A', // 진한 갈색
          'brown-light': '#E6C798', // 밝은 갈색
          accent: '#F4E4BC',      // 액센트 크림
          warm: '#F9F5F0',        // 따뜻한 베이지
          soft: '#F7F3ED',        // 부드러운 베이지
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        mint: {
          50: '#f3faf8',
          100: '#d7f7ed',
          200: '#b0f0db',
          300: '#7de2c6',
          400: '#44d1ae',
          500: '#15b89c',
          600: '#0e9b81',
          700: '#0c7c66',
          800: '#0c5f50',
          900: '#094940',
        },
        lavender: {
          50: '#f8f7fc',
          100: '#ebe7fa',
          200: '#d6ccf6',
          300: '#b7a5ea',
          400: '#9a7fd8',
          500: '#7e5fdc',
          600: '#6849b7',
          700: '#4e3688',
          800: '#38245a',
          900: '#271a35',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "mumu-bounce": {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        "mumu-float": {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-5px) rotate(1deg)' }
        },
        "mumu-reading": {
          '0%, 100%': { transform: 'translateY(0px)' },
          '25%': { transform: 'translateY(-3px)' },
          '75%': { transform: 'translateY(-1px)' }
        },
        "mumu-thinking": {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.05) rotate(2deg)' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "mumu-bounce": "mumu-bounce 2s ease-in-out infinite",
        "mumu-float": "mumu-float 3s ease-in-out infinite",
        "mumu-reading": "mumu-reading 4s ease-in-out infinite",
        "mumu-thinking": "mumu-thinking 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
