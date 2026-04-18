import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: false, // Lock to light mode — dark mode handled per-section manually
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        primary:   "#0B1F3A",
        "primary-light": "#112847",
        "primary-dark":  "#071528",
        accent:    "#00C96B",
        "accent-dim":    "rgba(0,201,107,0.12)",
        "accent-glow":   "rgba(0,201,107,0.35)",

        // Surfaces
        surface:   "#FFFFFF",
        "surface-subtle": "#F8FAFC",
        "surface-border": "#EEF2F7",

        // Text
        foreground: "#0B1F3A",
        muted:      "#64748B",
        "muted-light": "#94A3B8",

        // Status
        success: "#00C96B",
        warning: "#F59E0B",
        danger:  "#EF4444",
        info:    "#3B82F6",
      },
      fontFamily: {
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
        mono:  ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card:   "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-md": "0 4px 16px 0 rgba(0,0,0,0.08)",
        "card-lg": "0 8px 32px 0 rgba(0,0,0,0.12)",
        "glow-sm":  "0 0 16px rgba(0,201,107,0.25)",
        "glow-md":  "0 0 32px rgba(0,201,107,0.35)",
        "glow-lg":  "0 0 60px rgba(0,201,107,0.45)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      backgroundImage: {
        "dot-pattern":
          "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "green-glow":
          "radial-gradient(ellipse at center, rgba(0,201,107,0.15) 0%, transparent 70%)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,201,107,0.1) 0%, transparent 60%)",
      },
      backgroundSize: {
        "dot-sm":  "20px 20px",
        "dot-md":  "30px 30px",
        "grid-md": "40px 40px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 16px rgba(0,201,107,0.25)" },
          "50%":       { boxShadow: "0 0 40px rgba(0,201,107,0.55)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to:   { transform: "translateX(0)",    opacity: "1" },
        },
      },
      animation: {
        "fade-up":       "fade-up 0.5s ease forwards",
        "fade-in":       "fade-in 0.3s ease forwards",
        "pulse-glow":    "pulse_glow 2s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.3s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
