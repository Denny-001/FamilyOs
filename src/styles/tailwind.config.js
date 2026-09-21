/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          container: '#B9F6CA',
          onPrimary: '#FFFFFF',
          onContainer: '#003300',
        },
        secondary: {
          DEFAULT: '#4E5B4E',
          container: '#D1E8D1',
          onSecondary: '#FFFFFF',
          onContainer: '#0F1F0F',
        },
        tertiary: {
          DEFAULT: '#00695C',
          container: '#B2DFDB',
          onTertiary: '#FFFFFF',
          onContainer: '#00251E',
        },
        error: {
          DEFAULT: '#C62828',
          container: '#FFCDD2',
          onError: '#FFFFFF',
          onContainer: '#410002',
        },
        surface: {
          dim: '#DEDEDE',
          DEFAULT: '#FDFDFD',
          bright: '#FFFFFF',
          containerLowest: '#FFFFFF',
          containerLow: '#F5F5F5',
          container: '#EEEEEE',
          containerHigh: '#E0E0E0',
          containerHighest: '#D6D6D6',
        },
        onSurface: {
          DEFAULT: '#1A1C1A',
          variant: '#444844',
        },
        outline: {
          DEFAULT: '#747774',
          variant: '#C4C7C4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};