/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        sm: "450px",
      },
      colors: {
        primary: "#7C5DFA",
        secondary: "#252945",
        color: {
          1: "#dfe3fa",
          2: "#888eb0",
          3: "#7e87c3",
        },
        label: {
          1: {
            back: "#f3fdfa",
            front: "#34d69f",
            dark: "#33d69f",
          },
          2: {
            back: "#fff9f0",
            front: "#ff8f00",
            dark: "#ff8f00",
          },
          3: {
            back: "#f4f4f5",
            dark: "#dfe3fa",
          },
        },
        "primary-light": "#9277FF",
        "dark-bg": "#141625",
        "light-bg": "#F8F8F8",
        "card-light": "#fff",
        "card-dark": "#1E2139",
      },
    },
  },
  plugins: [],
};
