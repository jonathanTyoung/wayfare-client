/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wayfare-bg': '#f9f5eb',
        'wayfare-bg-alt': '#fafaf9',
        'wayfare-text': '#3e2f1c',
        'wayfare-text-secondary': '#2f3e46',
        'wayfare-muted': '#78716c',
        'accent-teal': '#14b8a6',
        'accent-yellow': '#fbbf24',
        'accent-yellow-dark': '#f59e0b',
      },
    },
  },
  plugins: [],
}
