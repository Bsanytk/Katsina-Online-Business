/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // 1. COLORS
      colors: {
        "kob-primary": "#C5A059",
        "kob-primary-light": "#D9BA7A",
        "kob-primary-dark": "#8B6F47",
        "kob-dark": "#2D1E17",
        "kob-gold": "#D4AF37",
        "kob-light": "#F7F5F2",
        "kob-success": "#10B981",
        "kob-success-light": "#D1FAE5",
        "kob-warning": "#F59E0B",
        "kob-warning-light": "#FEF3C7",
        "kob-error": "#EF4444",
        "kob-error-light": "#FEE2E2",
        "kob-info": "#3B82F6",
        "kob-info-light": "#DBEAFE",
        "kob-delivery": "#16a34a",
        "kob-neutral-50": "#FAFAF9",
        "kob-neutral-100": "#F5F5F4",
        "kob-neutral-200": "#E7E5E4",
        "kob-neutral-300": "#D6D3D1",
        "kob-neutral-400": "#A29D97",
        "kob-neutral-500": "#78716F",
        "kob-neutral-600": "#57534E",
        "kob-neutral-700": "#44403C",
        "kob-neutral-800": "#292420",
        "kob-neutral-900": "#1C1917",
      },

      // 2. MOBILE SAFE AREAS & SPACING (Fixed Syntax)
      padding: {
        safe: "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },
      height: {
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
      // Merged all spacing here to avoid duplication errors
      spacing: {
        safe: "env(safe-area-inset-bottom)",

        xs: "0.2rem",
        sm: "0.4rem",
        md: "0.8rem",
        lg: "1.2rem",
        xl: "1.6rem",
        "2xl": "2.4rem",
        "3xl": "3.2rem",
      },
      // 3. TYPOGRAPHY
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: ["Menlo", "Monaco", "Courier New", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.75px" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.5px" }],
        base: ["0.95rem", { lineHeight: "1.4rem", letterSpacing: "0px" }],
        lg: ["1.05rem", { lineHeight: "1.75rem", letterSpacing: "-0.25px" }],
        xl: ["1.15rem", { lineHeight: "1.75rem", letterSpacing: "-0.25px" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.5px" }],
        "3xl": [
          "1.875rem",
          { lineHeight: "2.25rem", letterSpacing: "-0.75px" },
        ],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-1px" }],
        "5xl": ["3rem", { lineHeight: "1", letterSpacing: "-1.25px" }],
      },
      fontWeight: {
        hairline: "100",
        thin: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },

      // 4. EFFECTS & ANIMATIONS
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.12)",
      },
      keyframes: {
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { maxHeight: "0", opacity: "0" },
          "100%": { maxHeight: "500px", opacity: "1" },
        },
        "pulse-subtle": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.9" },
        },
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 300ms ease-out",
        "slide-down": "slide-down 200ms ease-out",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
      },
      maxWidth: {
        container: "1200px",
        mobile: "95%",
      },
    },
  },
  plugins: [],
};
