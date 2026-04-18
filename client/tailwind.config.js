/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        fun: ['Fredoka One', 'Nunito', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'float':       'float 3s ease-in-out infinite',
        'float-slow':  'float 4.5s ease-in-out infinite',
        'bounce-slow': 'bounce 1.5s infinite',
        'pulse-fast':  'pulse 0.8s infinite',
        'countdown':   'countdown 1s ease-in-out',
        'shimmer':     'shimmer 2s linear infinite',
        'wiggle':      'wiggle 0.6s ease-in-out infinite',
        'pop-in':      'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        countdown: {
          '0%':   { transform: 'scale(0.3)', opacity: '0' },
          '50%':  { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg) scale(1.05)' },
          '50%':      { transform: 'rotate(4deg) scale(1.05)' },
        },
        popIn: {
          '0%':   { transform: 'scale(0.5)', opacity: '0' },
          '70%':  { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168,85,247,0.5)',
        'glow-cyan':   '0 0 20px rgba(6,182,212,0.5)',
        'glow-yellow': '0 0 20px rgba(250,204,21,0.5)',
        'glow-green':  '0 0 20px rgba(34,197,94,0.5)',
        'glow-pink':   '0 0 20px rgba(236,72,153,0.5)',
      },
    },
  },
  plugins: [],
}
