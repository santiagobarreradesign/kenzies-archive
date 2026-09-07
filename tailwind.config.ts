import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

// Medusa ships a CJS preset.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const uiPreset = require('@medusajs/ui-preset') as Config

/**
 * Newer @medusajs/ui-preset builds emptied the button gradient component map,
 * but @medusajs/ui Button still applies `after:button-*-gradient`. Without these
 * utilities the buttons look flat instead of matching Medusa UI / Figma.
 */
const medusaButtonGradients = plugin(({ addBase, addComponents }) => {
  addBase({
    ':root': {
      '--button-danger-gradient-from': 'rgba(255, 255, 255, 1)',
      '--button-danger-gradient-to': 'rgba(255, 255, 255, 0)',
      '--button-danger-pressed-gradient-from': 'rgba(255, 255, 255, 1)',
      '--button-danger-pressed-gradient-to': 'rgba(255, 255, 255, 0)',
      '--button-danger-hover-gradient-from': 'rgba(255, 255, 255, 1)',
      '--button-danger-hover-gradient-to': 'rgba(255, 255, 255, 0)',
      '--button-neutral-gradient-from': 'rgba(9, 9, 11, 0)',
      '--button-neutral-gradient-to': 'rgba(9, 9, 11, 1)',
      '--button-neutral-hover-gradient-from': 'rgba(9, 9, 11, 0)',
      '--button-neutral-hover-gradient-to': 'rgba(9, 9, 11, 1)',
      '--button-neutral-pressed-gradient-from': 'rgba(9, 9, 11, 0)',
      '--button-neutral-pressed-gradient-to': 'rgba(9, 9, 11, 1)',
      '--button-inverted-gradient-from': 'rgba(255, 255, 255, 1)',
      '--button-inverted-gradient-to': 'rgba(255, 255, 255, 0)',
      '--button-inverted-pressed-gradient-from': 'rgba(255, 255, 255, 1)',
      '--button-inverted-pressed-gradient-to': 'rgba(255, 255, 255, 0)',
      '--button-inverted-hover-gradient-from': 'rgba(255, 255, 255, 1)',
      '--button-inverted-hover-gradient-to': 'rgba(255, 255, 255, 0)',
    },
  })

  addComponents({
    '.button-danger-gradient': {
      backgroundImage: 'linear-gradient(180deg, var(--button-danger-gradient-from), var(--button-danger-gradient-to))',
      opacity: '0.16',
    },
    '.button-danger-pressed-gradient': {
      backgroundImage:
        'linear-gradient(180deg, var(--button-danger-pressed-gradient-from), var(--button-danger-pressed-gradient-to))',
      opacity: '0.16',
    },
    '.button-danger-hover-gradient': {
      backgroundImage:
        'linear-gradient(180deg, var(--button-danger-hover-gradient-from), var(--button-danger-hover-gradient-to))',
      opacity: '0.16',
    },
    '.button-neutral-gradient': {
      backgroundImage: 'linear-gradient(180deg, var(--button-neutral-gradient-from), var(--button-neutral-gradient-to))',
      opacity: '0.03',
    },
    '.button-neutral-hover-gradient': {
      backgroundImage:
        'linear-gradient(180deg, var(--button-neutral-hover-gradient-from), var(--button-neutral-hover-gradient-to))',
      opacity: '0.03',
    },
    '.button-neutral-pressed-gradient': {
      backgroundImage:
        'linear-gradient(180deg, var(--button-neutral-pressed-gradient-from), var(--button-neutral-pressed-gradient-to))',
      opacity: '0.03',
    },
    '.button-inverted-gradient': {
      backgroundImage:
        'linear-gradient(180deg, var(--button-inverted-gradient-from), var(--button-inverted-gradient-to))',
      opacity: '0.16',
    },
    '.button-inverted-pressed-gradient': {
      backgroundImage:
        'linear-gradient(180deg, var(--button-inverted-pressed-gradient-from), var(--button-inverted-pressed-gradient-to))',
      opacity: '0.16',
    },
    '.button-inverted-hover-gradient': {
      backgroundImage:
        'linear-gradient(180deg, var(--button-inverted-hover-gradient-from), var(--button-inverted-hover-gradient-to))',
      opacity: '0.16',
    },
  })
})

const config: Config = {
  // Prevent OS dark mode from swapping Medusa CSS variables to dark tokens.
  darkMode: 'class',
  presets: [uiPreset],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-serif)', 'Georgia', 'serif'],
        hand: ['var(--font-hand)', 'cursive'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: 'var(--paper)',
        'paper-warm': 'var(--paper-warm)',
        ink: 'var(--ink)',
        'postal-red': 'var(--postal-red)',
      },
      boxShadow: {
        paper: 'var(--shadow-paper)',
        stamp: 'var(--shadow-hover)',
        border: 'var(--shadow-border)',
        'border-hover': 'var(--shadow-border-hover)',
      },
    },
  },
  plugins: [medusaButtonGradients],
}

export default config
