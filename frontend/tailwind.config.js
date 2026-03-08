/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0a0a0f',
        bgSecondary: '#111118',
        bgCard: '#16161e',
        accentPrimary: '#e50914',
        accentHover: '#c2070f',
        accentSecondary: '#f5a623',
        textPrimary: '#f0f0f5',
        textSecondary: '#9999b3',
        textMuted: '#55556a',
        borderLayer: 'rgba(255,255,255,0.07)',
        glass: 'rgba(255,255,255,0.04)',
      },
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      transitionDuration: {
        '250': '250ms',
      },
      boxShadow: {
        glow: '0 4px 20px rgba(229,9,20,0.4)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.5)',
        modal: '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in': 'fadeInPage 0.4s ease',
        'slide-in': 'heroSlideIn 0.8s ease',
        'drop-in': 'dropIn 0.2s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-fast': 'pulse 0.5s infinite alternate',
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeInPage: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroSlideIn: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        dropIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}
