export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — match CSS variables in index.css
        bg:      '#292524',
        surface: '#1e1e1e',
        'surface-raised': '#2a2a2a',
        accent:  '#fbbf24',
        'accent-hover': '#05b88b',
        teal:    '#05b88b',
        muted:   '#a0a0a0',

        // Grays used throughout the app
        stone: {
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        special: ["'Special Elite'", 'cursive'],
      },
    },
  },
  plugins: [],
};
