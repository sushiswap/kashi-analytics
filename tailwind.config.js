const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins"],
      },
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
        16: "repeat(16, minmax(0, 1fr))",
      },
      skeletonScreen: {
        DEFAULT: {
          baseColor: colors.gray[200],
          movingColor: `linear-gradient(to right, transparent 0%, ${colors.gray[100]} 50%, transparent 100%)`,
          duration: "2s",
          timing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
        },
      },
    },
  },
  plugins: [require("@gradin/tailwindcss-skeleton-screen")],
};
