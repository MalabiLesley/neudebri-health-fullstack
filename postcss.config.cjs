module.exports = {
  plugins: {
    tailwindcss: {
      content: [
        './client/index.html',
        './client/src/**/*.{js,jsx,ts,tsx}',
      ],
    },
    autoprefixer: {},
  },
};
