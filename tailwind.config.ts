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
        // ── Core palette: "Parchment & Electric" ──
        cream:   "#F4F0E8",
        "cream-dim": "#EAE5D8",
        "cream-border": "#D8D0BE",
        ink:     "#131010",
        "ink-light": "#2C2826",
        "ink-muted": "#7A7068",
        "ink-faint": "#B0A898",

        // Accents
        violet:  "#7C3AED",
        "violet-light": "#9F67FF",
        "violet-dim":   "rgba(124,58,237,0.12)",
        coral:   "#FF4433",
        "coral-dim":    "rgba(255,68,51,0.12)",
        lime:    "#C8FF3E",
        "lime-dim":     "rgba(200,255,62,0.12)",

        // Dark surfaces (for dark sections)
        onyx:    "#111010",
        "onyx-card": "#1C1A18",
        "onyx-border": "#2E2A26",
        "onyx-muted": "#6B6460",

        // Alias: keep existing tokens so old code doesn't break
        primary:   "#131010",
        "primary-light": "#2C2826",
        "primary-dark":  "#111010",
        accent:    "#C8FF3E",
        "accent-dim":    "rgba(200,255,62,0.12)",
        "accent-glow":   "rgba(200,255,62,0.35)",

        surface:   "#F4F0E8",
        "surface-subtle": "#EAE5D8",
        "surface-border": "#D8D0BE",

        foreground: "#131010",
        muted:      "#7A7068",
        "muted-light": "#B0A898",

        success: "#22C55E",
        warning: "#F59E0B",
        danger:  "#EF4444",
        info:    "#3B82F6",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        mono:    ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        "8xl": ["5.5rem",   { lineHeight: "1" }],
        "9xl": ["7rem",     { lineHeight: "1" }],
        "10xl":["8.5rem",   { lineHeight: "1" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        card:     "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        "card-md": "0 4px 16px 0 rgba(0,0,0,0.08)",
        "card-lg": "0 8px 32px 0 rgba(0,0,0,0.12)",
        "glow-sm":  "0 0 20px rgba(200,255,62,0.20)",
        "glow-md":  "0 0 40px rgba(200,255,62,0.30)",
        "glow-lg":  "0 0 70px rgba(200,255,62,0.40)",
        "violet-glow": "0 0 30px rgba(124,58,237,0.25)",
        "coral-glow":  "0 0 30px rgba(255,68,51,0.25)",
        "inner-glow":  "inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      backgroundImage: {
        "dot-cream":   "radial-gradient(circle, rgba(19,16,16,0.06) 1px, transparent 1px)",
        "dot-onyx":    "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        "grid-cream":  "linear-gradient(rgba(19,16,16,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(19,16,16,0.03) 1px, transparent 1px)",
        "grid-onyx":   "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "lime-glow":   "radial-gradient(ellipse at center, rgba(200,255,62,0.15) 0%, transparent 70%)",
        "violet-glow": "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)",
        "hero-gradient": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(200,255,62,0.12) 0%, transparent 60%)",
      },
      backgroundSize: {
        "dot-sm":  "20px 20px",
        "dot-md":  "28px 28px",
        "grid-md": "40px 40px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(200,255,62,0.20)" },
          "50%":       { boxShadow: "0 0 50px rgba(200,255,62,0.50)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to:   { transform: "translateX(0)",    opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up":       "fade-up 0.6s ease forwards",
        "fade-in":       "fade-in 0.3s ease forwards",
        "pulse-glow":    "pulse_glow 2.5s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.3s ease forwards",
        "marquee":       "marquee 28s linear infinite",
        "spin-slow":     "spin-slow 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
