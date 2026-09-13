/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030303',
          900: '#050505',
          850: '#090909',
          800: '#0D0D0D',
          750: '#111111',
          700: '#161616',
          600: '#1E1E1E',
          500: '#2A2A2A',
          400: '#3D3D3D'
        },
        crimson: {
          DEFAULT: '#E50914',
          glow: 'rgba(229, 9, 20, 0.45)',
          deep: '#780000',
          dark3: '#260000',
          dark2: '#1A0000',
          dark1: '#120000',
          subtle: 'rgba(229, 9, 20, 0.08)',
          border: 'rgba(229, 9, 20, 0.22)',
          'border-bright': 'rgba(229, 9, 20, 0.6)'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'crimson-glow': '0 0 30px -5px rgba(229, 9, 20, 0.35)',
        'crimson-glow-lg': '0 0 60px -10px rgba(229, 9, 20, 0.45)',
        'crimson-subtle': '0 0 20px -2px rgba(229, 9, 20, 0.15)',
        'inner-glow': 'inset 0 0 20px 0 rgba(229, 9, 20, 0.18)'
      },
      animation: {
        'pulse-glow': 'pulseGlow 5s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'orbit-slow': 'orbit 25s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.65', transform: 'scale(1.04)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
};
