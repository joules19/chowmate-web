/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Paths to your JS and TSX files
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
        '2xl': '1536px',
      },
      colors: {
        // Legacy colors (keep for backward compatibility)
        "primary-1": "#FFD54F",
        "primary-2": "#6CB4EE", 
        "primary-fade": "#FFFBF0",
        "primary-4": "#FFF3CD",
        "primary-5": "#FFC107",
        "green-1": "#008000",
        "dark-1": "#282828",
        "dark-2": "#353535",
        "dark-3": "#D1D5DB",
        "gray-1": "#EEEEEE",
        "gray-2": "#282828",
        "gray-3": "#4f4f4f",
        "gray-4": "#f8f8f8",
        "gray-5": "#828282",
        "gray-6": "#333333",
        "gray-7": "#f5f5f5",

        // Chowmate Brand Color System
        primary: {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fde68a',
          400: '#fcd34d',
          500: '#FFC107', // Your brand yellow-gold
          600: '#f59e0b',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
          950: '#78350f',
        },
        
        // Chowmate Background System
        background: {
          primary: '#FFFCF4',    // Your warm cream background
          secondary: '#ffffff',  // Pure white cards (elevated)
          tertiary: '#faf9f5',   // Subtle sections
          accent: '#f5f3eb',     // Hover states
        },

        // Chowmate Surface System
        surface: {
          0: '#ffffff',        // Pure white (highest elevation)
          50: '#FFFCF4',       // Your brand background
          100: '#faf9f5',      // Subtle elevation
          200: '#f5f3eb',      // Medium elevation
          300: '#f0ede1',      // Strong elevation
        },

        // Modern Text Hierarchy
        text: {
          primary: '#0f172a',    // Main headings (slate-900)
          secondary: '#475569',  // Body text (slate-600)
          tertiary: '#94a3b8',   // Captions (slate-400)
          quaternary: '#cbd5e1', // Disabled text (slate-300)
          inverse: '#ffffff',    // White text
        },

        // Modern Semantic Colors
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Main success
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },

        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Main warning
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },

        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Main danger
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },

        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main info
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        // Modern Border System
        border: {
          light: '#f1f5f9',
          default: '#e2e8f0',
          medium: '#cbd5e1',
          strong: '#94a3b8',
        },

        // Chowmate Admin Panel
        sidebar: {
          bg: '#ffffff',         // White sidebar for contrast
          border: '#f0ede1',     // Warm border
          hover: '#FFFCF4',      // Your brand background on hover
          active: '#faf9f5',     // Subtle active state
        },

        // Chowmate Brand Integration
        brand: {
          background: '#FFFCF4', // Your exact background
          yellow: '#FFC107',     // Your exact yellow
          cream: {
            50: '#fffef9',
            100: '#FFFCF4',      // Your brand background
            200: '#faf9f5',
            300: '#f5f3eb',
            400: '#f0ede1',
            500: '#ebe7d7',
          }
        },
      },
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      
      // Modern Shadow System
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'focus': '0 0 0 3px rgba(249, 115, 22, 0.1)', // Primary focus ring
      },

      // Modern Border Radius
      borderRadius: {
        'soft': '6px',
        'card': '8px',
        'button': '6px',
        'input': '6px',
      },

      // Enhanced Spacing for Admin Layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    // Any plugins you want to use
  ],
};
