/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      colors: {
        'cyber-green': '#00ff00',
        'matrix-green': '#008f11',
        'neon-green': '#39ff14',
      },
      animation: {
        'matrix-fall': 'matrix-fall linear infinite',
        'neon-glow': 'neon-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'matrix-fall': {
          '0%': {
            transform: 'translateY(-100vh)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(100vh)',
            opacity: '0'
          }
        },
        'neon-glow': {
          '0%': {
            textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00'
          },
          '100%': {
            textShadow: '0 0 2px #00ff00, 0 0 5px #00ff00, 0 0 8px #00ff00'
          }
        }
      }
    },
  },
  plugins: [],
}
