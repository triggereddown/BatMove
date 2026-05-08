/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: 'rgb(var(--bg-primary) / <alpha-value>)',
        bgSecondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
        bgCard: 'rgb(var(--bg-card) / <alpha-value>)',
        bgCardHover: 'rgb(var(--bg-card-hover) / <alpha-value>)',
        accentPrimary: 'rgb(var(--accent-primary) / <alpha-value>)',
        accentHover: 'rgb(var(--accent-primary) / <alpha-value>)',
        accentSecondary: 'rgb(var(--accent-secondary) / <alpha-value>)',
        textPrimary: 'rgb(var(--text-primary) / <alpha-value>)',
        textSecondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        textMuted: 'rgb(var(--text-muted) / <alpha-value>)',
        borderLayer: 'var(--border)',
        borderStrong: 'var(--border-strong)',
        glass: 'var(--glass)',
        glassStrong: 'var(--glass-strong)',
        navbarBg: 'var(--navbar-bg)',
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
        glow: 'var(--shadow-glow)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow)',
        modal: 'var(--shadow)',
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
