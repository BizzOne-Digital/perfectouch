/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0057FF',
          'blue-dark': '#003ACC',
          'blue-light': '#3B82F6',
          black: '#0A0A0F',
          'dark': '#0F1117',
          silver: '#C0C8D8',
          chrome: '#E8EDF5',
          accent: '#00AAFF'
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-right': 'slideRight 0.5s ease forwards'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 10px #0057FF44' },
          '100%': { boxShadow: '0 0 30px #0057FFaa, 0 0 60px #0057FF44' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      }
    }
  },
  plugins: []
}
