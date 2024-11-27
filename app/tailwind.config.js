// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: '#root', // This ensures Tailwind doesn't conflict with MUI
  theme: {
    extend: {},
  },
  corePlugins: {
    // Disable Preflight as it can conflict with MUI
    preflight: false,
  },
};

