/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Richer, saturated sage for mobile visibility
        sage: {
          DEFAULT: '#8A9C7A',
          light: '#A4B496',
          dark: '#728466',
          accent: '#5F704F',
        },
        yellow: {
          mellow: '#D6C27A',
          'mellow-rich': '#D6C27A',
          'mellow-light': '#E8D898',
          'mellow-dark': '#B8A34A',
        },
        lilac: {
          DEFAULT: '#A999C2',
          light: '#C4BAD8',
          dark: '#9C8AB8',
          accent: '#7A6A9B',
        },
        cream: {
          DEFAULT: '#FAF8F3',
          warm: '#F4EFE6',
        },
        gold: {
          light: '#D8C89B',
          DEFAULT: '#C4B07A',
          accent: '#B09A60',
        },
        text: {
          primary: '#181818',
          heading: '#181818',
          body: '#2A2A2A',
          small: '#3A3A3A',
          secondary: '#2A2A2A',
          light: '#3A3A3A',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(138, 156, 122, 0.18)',
        medium: '0 8px 40px rgba(138, 156, 122, 0.22)',
        luxury: '0 16px 64px rgba(138, 156, 122, 0.25)',
        card: '0 2px 12px rgba(24, 24, 24, 0.08)',
        'card-hover': '0 8px 32px rgba(24, 24, 24, 0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
