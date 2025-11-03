/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./00_index_rebuilt.html', './00_main_rebuilt.js'],
  theme: {
    fontFamily: {
      sans: ['Hanken Grotesk', 'Hanken', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      display: ['Montserrat', 'Hanken Grotesk', 'Hanken', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
    extend: {
      colors: {
        'hb-bg': 'var(--hb-color-body)',
        'hb-surface': 'var(--hb-color-surface)',
        'hb-primary': 'var(--hb-color-primary)',
        'hb-accent': 'var(--hb-color-accent)',
        'hb-accent-alt': 'var(--hb-color-accent-alt)',
        'hb-text': 'var(--hb-color-text)',
      },
      spacing: {
        'fluid-1': 'var(--hb-space-1)',
        'fluid-2': 'var(--hb-space-2)',
        'fluid-3': 'var(--hb-space-3)',
        'fluid-4': 'var(--hb-space-4)',
        'fluid-5': 'var(--hb-space-5)',
        'fluid-6': 'var(--hb-space-6)',
        'fluid-7': 'var(--hb-space-7)',
        'fluid-8': 'var(--hb-space-8)',
        'fluid-9': 'var(--hb-space-9)',
        'fluid-10': 'var(--hb-space-10)',
        'fluid-11': 'var(--hb-space-11)',
        'fluid-12': 'var(--hb-space-12)',
      },
      borderRadius: {
        'hb-xs': 'var(--hb-radius-xs)',
        'hb-sm': 'var(--hb-radius-sm)',
        'hb-md': 'var(--hb-radius-md)',
        'hb-lg': 'var(--hb-radius-lg)',
        'hb-xl': 'var(--hb-radius-xl)',
        'hb-pill': 'var(--hb-radius-pill)',
      },
      boxShadow: {
        'hb-soft': 'var(--hb-shadow-soft)',
        'hb-glass': 'var(--hb-shadow-glass)',
        'hb-glow': 'var(--hb-shadow-glow)',
      },
      backgroundImage: {
        'hb-hero': 'var(--hb-gradient-hero)',
        'hb-panel': 'var(--hb-gradient-panel)',
        'hb-footer': 'var(--hb-gradient-footer)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
      });
    },
  ],
};
