/** @type {import('tailwindcss').Config} */
export default {
  // Escanear sólo tipos de archivo relevantes y excluir tests / scripts para acelerar y evitar falsos positivos
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '!./src/**/__tests__/**',
    '!./src/**/*.spec.{js,ts,jsx,tsx}',
  '!./src/**/*.test.{js,ts,jsx,tsx}',
  '!./src/_archive_unused/**'
  ],
  // Safelist para clases generadas dinámicamente (ej: por map o condicionales) que podrían no aparecer como literales
  safelist: [
    // patrones de gradientes y animaciones usadas via concatenación
    {
      pattern: /(bg|text)-(primary|purple)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover','active']
    },
  ],
  theme: {
    extend: {
      // Breakpoints personalizados para dispositivos Android
      screens: {
        'xs': '280px',      // Dispositivos muy pequeños
        'sm': '360px',      // Dispositivos pequeños estándar  
        'md': '450px',      // Dispositivos medianos
        'lg': '500px',      // Dispositivos grandes
        'xl': '600px',      // Tablets pequeñas
      },
      colors: {
        primary: {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
        },
  // Tokens directos usados repetidamente en código para sustituir hex duplicados
  brand: '#6d4aff',
  surface: '#23232f',
  'surface-border': '#2a2a35',
  // Línea/bordes ligeramente más claros recurrentes en inputs y contenedores
  'surface-line': '#3a3a46',
  'neutral-text': '#b3b3ba',
  'neutral-mid': '#8b8b94',
  'neutral-faint': '#6d6d76',
  success: '#00b96b',
  'success-strong': '#008f51',
  danger: '#ef4444',
  'brand-alt': '#5c3dd8',
  'brand-accent': '#b49dff',
  'neutral-strong': '#e6e6eb',
  'neutral-muted': '#7a7a85',
  warn: '#f59e0b',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
  // Animaciones eliminadas por no uso para reducir CSS
      },
      keyframes: {
  // Keyframes removidos
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0,0,0,0.35)',
        elevated: '0 4px 12px rgba(0,0,0,0.35)',
        innerBrand: '0 2px 4px rgba(0,0,0,0.2)'
      },
      fontSize: {
        'body-lg': ['14px',{ lineHeight:'18px', fontWeight:'400'}],
        'body': ['13px',{ lineHeight:'17px', fontWeight:'400'}],
        'body-sm': ['11px',{ lineHeight:'14px', fontWeight:'400'}],
  'caption': ['12px',{ lineHeight:'16px', fontWeight:'400'}],
        'btn': ['13px',{ lineHeight:'17px', fontWeight:'600'}],
        'btn-sm': ['11px',{ lineHeight:'14px', fontWeight:'500'}],
        'h4': ['16px',{ lineHeight:'20px', fontWeight:'600'}],
        'h3': ['18px',{ lineHeight:'22px', fontWeight:'600'}],
        'h2': ['20px',{ lineHeight:'24px', fontWeight:'600'}],
        'h1': ['22px',{ lineHeight:'26px', fontWeight:'700'}],
        'price': ['20px',{ lineHeight:'24px', fontWeight:'700'}]
      }
    },
  },
  corePlugins: {
    // Desactivar lo que no se detectó en el código (ajustable si se requiere luego)
    preflight: true,
    float: false,
    clear: false,
    isolation: false,
    accentColor: false,
    caretColor: false,
    placeholderOpacity: true, // placeholders quizá necesarios
    tableLayout: false,
    caption: false,
    resize: false,
    listStyleType: false,
    listStylePosition: false,
    scrollBehavior: false, // usamos utilidades custom
    overscrollBehavior: false,
    touchAction: false,
    stroke: false,
    fill: false,
    // Mantener objectFit/objectPosition porque se usa object-cover
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.no-select': {
          '-webkit-user-select': 'none !important',
          '-moz-user-select': 'none !important',
          '-ms-user-select': 'none !important',
          'user-select': 'none !important',
          '-webkit-touch-callout': 'none !important',
          '-webkit-tap-highlight-color': 'transparent !important',
        },
        '.allow-select': {
          '-webkit-user-select': 'text !important',
          '-moz-user-select': 'text !important',
          '-ms-user-select': 'text !important',
          'user-select': 'text !important',
          '-webkit-touch-callout': 'default !important',
        },
        '.no-drag': {
          '-webkit-user-drag': 'none !important',
          '-khtml-user-drag': 'none !important',
          '-moz-user-drag': 'none !important',
          '-o-user-drag': 'none !important',
          'user-drag': 'none !important',
        },
        '.scrollbar-none': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
        '.scrollbar-none::-webkit-scrollbar': {
          'display': 'none',
        },
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
        },
        '.scroll-touch': {
          '-webkit-overflow-scrolling': 'touch',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
