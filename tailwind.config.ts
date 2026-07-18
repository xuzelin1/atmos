import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // atoms.dev 实际主色调：黑色系
        brand: {
          50: "#f6f6f6",
          100: "#e8e8e8",
          200: "#d4d4d4",
          300: "#a8a8a8",
          400: "#787878",
          500: "#525252",
          600: "#3a3a3a",
          700: "#262626",
          800: "#171717",
          900: "#0c0c0c",
          950: "#000000",
        },
        // 强调色（用于 accent / CTA 高亮）
        accent: {
          DEFAULT: "#0c0c0c",
          foreground: "#ffffff",
        },
        surface: {
          DEFAULT: "#ffffff",
          secondary: "#f6f6f6",
          elevated: "#ffffff",
          overlay: "#f0f0f0",
        },
        muted: {
          DEFAULT: "#868e96",
          foreground: "#adb5bd",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        hero: ["3.5rem", { lineHeight: "1.1", fontWeight: "700" }],
        "hero-md": ["4.5rem", { lineHeight: "1.1", fontWeight: "700" }],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.06), 0 1px 3px 0 rgba(0,0,0,0.04)",
        "card-lg":
          "0 4px 24px 0 rgba(0,0,0,0.06), 0 1px 4px 0 rgba(0,0,0,0.03)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scroll-x": "scrollX 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scrollX: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;