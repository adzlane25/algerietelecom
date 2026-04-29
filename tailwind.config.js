/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eeff',
          100: '#d1dfff',
          200: '#a3beff',
          300: '#759eff',
          400: '#477dff',
          500: '#4361ee',
          600: '#364ec4',
          700: '#283a9b',
          800: '#1b2772',
          900: '#0d1349',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#4361ee',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.05)',
        hover: '0 4px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}