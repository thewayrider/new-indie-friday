/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The "Cool Grey-ish Newsprint" background
        dossier: '#e2e8f0', 
        // Replacing SaaS Mint with a more serious Signal White or Red
        accent: '#ffffff',
        investigation: '#e11d48', // A sharp, investigative red for small accents
      },
     fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        fraunces: ['Fraunces', 'serif'],
        spectral: ['Spectral', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}