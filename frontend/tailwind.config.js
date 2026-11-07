/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#1A2B43",
          100: "#24344D",
          200: "#293950",
          300: "#394A64",
          400: "#8492A6",
          500: "#5A6B82",
          600: "#1A2B43",
          700: "#142238",
          800: "#101B2D",
          900: "#0B1220",
          950: "#080F1B",
        },
        cream: {
          DEFAULT: "#142238",
          sand: "#101B2D",
        },
        brand: {
          saffron: "#ff5f00",
          orange: "#F28C38",
          sky: "#55B9E8",
          teal: "#39B8A5",
          green: "#65B981",
          warning: "#F4C15D",
          coral: "#F17B65",
          muted: "#8492A6",
          navy: "#17263B",
        },
      },
      fontFamily: {
        display: [
          '"Space Grotesk"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 1px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.35)",
        "card-lg": "0 2px 4px rgba(0,0,0,0.3), 0 16px 40px rgba(0,0,0,0.45)",
        lift: "0 12px 32px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
