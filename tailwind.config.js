/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern:
        /^(from|via|to)-(sky|blue|slate|indigo|orange|pink|purple)-(200|300|400|500|600|700|800|900|950)$/,
    },
  ],
  plugins: [],
};
