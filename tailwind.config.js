export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — match CSS variables in index.css.
        // Prefixed with `app-` to avoid collision with Tailwind's built-in
        // color scales (e.g. teal-50..950) when used as `bg-app-*`.
        'app-bg':              '#292524',
        'app-surface':         '#1e1e1e',
        'app-surface-raised':  '#2a2a2a',
        'app-accent':          '#fbbf24',
        'app-accent-hover':    '#05b88b',
        'app-muted':           '#a0a0a0',

        // Teal: expose a minimal DEFAULT + hover pair while preserving
        // Tailwind's default teal-50..950 scale via `extend`.
        teal: {
          DEFAULT: '#05b88b',
          hover:   '#04a07a',
        },

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
