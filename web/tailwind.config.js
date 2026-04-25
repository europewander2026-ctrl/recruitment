/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        primary: '#0d5fb7',
        darkBlue: '#002366',
        lightBg: '#f8fafc',
        accent: '#090927',
        successGreen: '#10b981',
        accentBlue: '#3b82f6',
        urgentRed: '#ef4444',
        matrixGreen: '#00ff41',
        success: '#10b981',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'float': '0 20px 40px -5px rgba(13, 95, 183, 0.2)',
        'glow': '0 0 20px rgba(13, 95, 183, 0.3)',
        'matrix': '0 0 15px rgba(0, 255, 65, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scan-vertical': 'scanVertical 3s linear infinite',
        'spin-slow': 'spin 15s linear infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scanVertical: {
          '0%': { top: '-100%' },
          '100%': { top: '100%' },
        },
        scan: {
          '0%, 100%': { transform: 'scaleX(0)', opacity: 0 },
          '50%': { transform: 'scaleX(1)', opacity: 1 },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
