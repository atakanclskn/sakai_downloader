/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        defaultBg: 'hsl(var(--background))',
        defaultFg: 'hsl(var(--foreground))',
        securityBg: 'hsl(var(--security-bg))',
        securityFg: 'hsl(var(--security-fg))',
        accentBg: 'hsl(var(--accent))',
        accentFg: 'hsl(var(--accent-foreground))',
        border: 'hsl(var(--border) / <alpha-value>)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, hsla(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, hsla(var(--foreground) / 0.05) 1px, transparent 1px)'
      }
    },
  },
  plugins: [],
}
