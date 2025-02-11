module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto", // Alinea Prettier con los finales de línea del sistema
      },
    ],
    "linebreak-style": ["off"], // Desactiva la regla de ESLint para linebreaks
  },
};
