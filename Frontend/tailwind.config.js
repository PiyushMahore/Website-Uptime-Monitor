/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'radial-gradient(ellipse at top, rgba(91, 99, 211, 0.08), transparent 40%)',
      }
    }
  },
  plugins: [],
}