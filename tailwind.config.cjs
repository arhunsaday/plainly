/**
 * Two scales only: a neutral ramp for surfaces and text, and the brand accent.
 * Everything in the UI is composed from these, so the popup, the options page
 * and the on-page toast cannot drift apart.
 */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#F7F7F8",
          100: "#EDEDEF",
          200: "#DEDEE2",
          300: "#C2C2C9",
          400: "#8E8E99",
          500: "#6B6B76",
          600: "#4E4E58",
          700: "#3A3A43",
          800: "#26262C",
          900: "#1B1B20",
          950: "#16161A",
        },
        accent: {
          50: "#EEF0FF",
          100: "#E0E3FF",
          300: "#A9AFFF",
          400: "#8189FA",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,22,26,.05), 0 1px 3px rgba(22,22,26,.06)",
        pop: "0 10px 30px rgba(22,22,26,.12), 0 2px 8px rgba(22,22,26,.08)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
