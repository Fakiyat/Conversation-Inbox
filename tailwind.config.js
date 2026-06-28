/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Light theme surfaces
        surface: {
          base: "#f0f4f8",
          raised: "#ffffff",
          overlay: "#e8eef5",
          border: "#d1dbe8",
          card: "#ffffff",
        },
        accent: {
          blue: "#2563eb",
          "blue-light": "#dbeafe",
          "blue-mid": "#93c5fd",
        },
        // Priority colour system — glossy tints for light theme
        priority: {
          // Urgent: Standard Tailwind Red
          urgent: "#dc2626", // red-600 (Text/Icons)
          "urgent-bg": "#fef2f2", // red-50 (Background)
          "urgent-border": "#ef4444", // red-500 (Softened Border)
          "urgent-glow": "#fee2e2", // red-100 (Hover/Glow)

          // High: Standard Tailwind Amber
          high: "#d97706", // amber-600 (Text/Icons)
          "high-bg": "#fffbeb", // amber-50 (Background)
          "high-border": "#fbbf24", // amber-400 (Softened Border)
          "high-glow": "#fef3c7", // amber-100 (Hover/Glow)

          // Normal: Standard Tailwind Slate (Premium SaaS Default)
          normal: "#64748b", // slate-500 (Text/Icons)
          "normal-bg": "#f8fafc", // slate-50 (Background)
          "normal-border": "#cbd5e1", // slate-300 (Softened Border)
          "normal-glow": "#f1f5f9", // slate-100 (Hover/Glow)
        },
        resolved: {
          DEFAULT: "#16a34a",
          bg: "#f0fdf4",
          border: "#86efac",
          glow: "#dcfce7",
        },
        active: {
          DEFAULT: "#2563eb",
          bg: "#eff6ff",
          border: "#93c5fd",
        },
        text: {
          primary: "#0f172a",
          secondary: "#475569",
          muted: "#94a3b8",
          placeholder: "#cbd5e1",
        },
        success: "#16a34a",
        "success-bg": "#f0fdf4",
        error: "#dc2626",
        "error-bg": "#fef2f2",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)",
        "card-selected": "0 0 0 2px #2563eb, 0 4px 12px 0 rgba(37,99,235,0.12)",
        urgent: "0 0 0 1px #fca5a5, 0 2px 8px 0 rgba(220,38,38,0.12)",
        high: "0 0 0 1px #fcd34d, 0 2px 8px 0 rgba(217,119,6,0.10)",
        normal: "0 0 0 1px #93c5fd, 0 2px 6px 0 rgba(37,99,235,0.08)",
        resolved: "0 0 0 1px #86efac, 0 2px 6px 0 rgba(22,163,74,0.08)",
        toast: "0 8px 24px rgba(0,0,0,0.12)",
        panel: "2px 0 8px rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.18s ease-out",
        "slide-in": "slideIn 0.64s ease-out",
        "toast-in": "toastIn 450ms cubic-bezier(0.22,1,0.36,1)",
        "toast-out": "toastOut 350ms cubic-bezier(0.4,0,1,1)",
        "skeleton-pulse": "skeletonPulse 1.6s ease-in-out infinite",
        "bounce-in": "bounceIn 0.25s ease-out",
      },
      keyframes: {
        toastIn: {
          "0%": {
            transform: "translateY(calc(-100% - 30px))",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },

        toastOut: {
          "0%": {
            transform: "translateY(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(calc(-100% - 30px))",
            opacity: "1",
          },
        },

        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        skeletonPulse: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.9" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "60%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
