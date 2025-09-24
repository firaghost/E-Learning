/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium Ethiopian Heritage - Sophisticated Palette
        'ethiopia-emerald': '#059669',
        'ethiopia-gold': '#D97706',
        'ethiopia-crimson': '#DC2626',
        'ethiopia-sapphire': '#1E40AF',
        'ethiopia-royal': '#6B21A8',
        
        // Legacy support
        'ethiopia-green': '#059669',
        'ethiopia-yellow': '#D97706',
        'ethiopia-red': '#DC2626',
        
        // Sophisticated Secondary Colors
        'terra-bronze': '#92400E',
        'honey-amber': '#F59E0B',
        'sage-forest': '#065F46',
        'clay-terracotta': '#B45309',
        'coffee-dark': '#451A03',
        'coffee-medium': '#78350F',
        'coffee-light': '#A16207',
        
        // Premium Neutrals
        obsidian: '#0F172A',
        charcoal: '#1E293B',
        slate: '#334155',
        ash: '#64748B',
        pearl: '#E2E8F0',
        cloud: '#F8FAFC',
        snow: '#FFFFFF',
        
        // Dark Mode Premium
        'dark-obsidian': '#020617',
        'dark-charcoal': '#0F172A',
        'dark-slate': '#1E293B',
        'dark-ash': '#334155',
        
        // Semantic Colors - Enhanced
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        
        // Organized color system
        ethiopia: {
          emerald: '#00A651',
          gold: '#F4B942',
          crimson: '#E63946',
          sapphire: '#2E86AB',
          // Legacy
          green: '#00A651',
          yellow: '#F4B942',
          red: '#E63946',
        },
        
        secondary: {
          terra: '#8B4513',
          honey: '#FFC947',
          sage: '#87A96B',
          clay: '#D2691E',
        }
      },
      
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'accent': ['Dancing Script', 'cursive'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2.25rem', { lineHeight: '1.25' }],
        'h3': ['1.875rem', { lineHeight: '1.3' }],
        'h4': ['1.5rem', { lineHeight: '1.35' }],
        'h5': ['1.25rem', { lineHeight: '1.4' }],
        'h6': ['1.125rem', { lineHeight: '1.45' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 20px rgba(0, 0, 0, 0.12)',
        'ethiopia': '0 4px 12px rgba(0, 166, 81, 0.3)',
        'ethiopia-hover': '0 8px 20px rgba(0, 166, 81, 0.4)',
        'gold': '0 4px 12px rgba(244, 185, 66, 0.3)',
      },
      
      backgroundImage: {
        'gradient-ethiopia': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
        'pattern-habesha': `
          radial-gradient(circle at 25% 25%, rgba(5, 150, 105, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(217, 119, 6, 0.08) 0%, transparent 50%),
          linear-gradient(45deg, transparent 48%, rgba(5, 150, 105, 0.02) 49%, rgba(5, 150, 105, 0.02) 51%, transparent 52%)
        `,
        'pattern-cross': `
          linear-gradient(45deg, transparent 40%, rgba(5, 150, 105, 0.03) 40%, rgba(5, 150, 105, 0.03) 60%, transparent 60%),
          linear-gradient(-45deg, transparent 40%, rgba(217, 119, 6, 0.03) 40%, rgba(217, 119, 6, 0.03) 60%, transparent 60%)
        `,
        'pattern-geometric': `
          polygon(50% 0%, 0% 100%, 100% 100%)
        `,
        'pattern-diamond': `
          conic-gradient(from 45deg at 50% 50%, rgba(5, 150, 105, 0.1) 0deg, transparent 90deg, rgba(217, 119, 6, 0.1) 180deg, transparent 270deg)
        `,
      },
      
      backgroundSize: {
        'pattern-habesha': '60px 60px',
        'pattern-cross': '20px 20px',
      },
      
      animation: {
        'gentle-bounce': 'gentle-bounce 0.6s ease-in-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-in-up 0.6s ease-out',
        'coffee-bounce': 'coffee-bounce 1.4s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      
      keyframes: {
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 166, 81, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 166, 81, 0.8)' },
        },
        'slide-in-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'coffee-bounce': {
          '0%, 80%, 100%': { transform: 'scale(0.8)' },
          '40%': { transform: 'scale(1.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      }
    },
  },
  plugins: [],
}