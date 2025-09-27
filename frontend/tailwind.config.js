/** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {
         fontFamily: {
           'mono': ['Share Tech Mono', 'monospace'],
         },
         colors: {
           'cyber-green': {
             300: '#00ff88',
             400: '#00ff00',
             500: '#00cc00',
           },
         },
         animation: {
           'pulse-slow': 'pulse 3s ease-in-out infinite',
         },
         boxShadow: {
           'cyber': '0 0 20px #00ff00',
           'cyber-lg': '0 0 40px #00ff00',
         },
       },
     },
     plugins: [],
   }