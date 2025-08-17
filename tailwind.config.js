/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Paths to your JS and TSX files
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
        '2xl': '1536px',
      },
      colors: {
        "primary-1": "#FFD54F",
        "primary-2": "#6CB4EE",
        "primary-fade": "#FFFBF0",
        "primary-4": "#FFF3CD",
        "primary-5": "#FFC107",

        "green-1": "#008000",

        "dark-1": "#282828",
        "dark-2": "#353535",
        "dark-3": "#D1D5DB",

        "gray-1": "#EEEEEE",
        "gray-2": "#282828",
        "gray-3": "#4f4f4f",
        "gray-4": "#f8f8f8",
        "gray-5": "#828282",
        "gray-6": "#333333",
        "gray-7": "#f5f5f5",

        "bd-1": "border border-red-400",
        "bd-2": "border-2 border-red-400",
      },
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [
    // Any plugins you want to use
  ],
};
