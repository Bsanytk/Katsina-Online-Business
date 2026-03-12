/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // KOB Primary Palette
        'kob-primary': '#C5A059',
        'kob-primary-light': '#D9BA7A',
        'kob-primary-dark': '#8B6F47',
        'kob-dark': '#2D1E17',
        'kob-gold': '#D4AF37',
        'kob-light': '#F7F5F2',
        // Semantic Colors
        'kob-success': '#10B981',
        'kob-success-light': '#D1FAE5',
        'kob-warning': '#F59E0B',
        'kob-warning-light': '#FEF3C7',
        'kob-error': '#EF4444',
        'kob-error-light': '#FEE2E2',
        'kob-info': '#3B82F6',
        'kob-info-light': '#DBEAFE',
        // ADDED: Delivery Specific
        'kob-delivery': '#16a34a', 
        // Neutral Palette
        'kob-neutral-50': '#FAFAF9',
        'kob-neutral-100': '#F5F5F4',
        'kob-neutral-200': '#E7E5E4',
        'kob-neutral-300': '#D6D3D1',
        'kob-neutral-400': '#A29D97',
        'kob-neutral-500': '#78716F',
        'kob-neutral-600': '#57534E',
        'kob-neutral-700': '#44403C',
        'kob-neutral-800': '#292420',
        'kob-neutral-900': '#1C1917',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.75px' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.5px' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0px' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.25px' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.25px' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.5px' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.75px' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-1px' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-1.25px' }],
      },
      fontWeight: {
        hairline: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '500ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      maxWidth: {
        container: '1100px',
      },
      gap: {
        'gutter': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-in-from-bottom': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-out-to-bottom': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(16px)', opacity: '0' },
        },
        'slide-down': {
          '0%': { maxHeight: '0', opacity: '0' },
          '100%': { maxHeight: '500px', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        // ADDED: For the Delivery Badge
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out',
        'fade-out': 'fade-out 300ms ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 300ms ease-out',
        'slide-in-from-top': 'slide-in-from-top 300ms ease-out',
        'slide-out-to-bottom': 'slide-out-to-bottom 300ms ease-out',
        'slide-down': 'slide-down 200ms ease-out',
        'scale-in': 'scale-in 200ms ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

