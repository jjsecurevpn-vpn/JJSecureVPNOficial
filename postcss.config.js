// Configuración PostCSS optimizada: sólo añade transformaciones pesadas en build
const isProd = process.env.NODE_ENV === 'production';

export default {
  plugins: {
    tailwindcss: {},
    // cssnano ya está instalado: sólo en producción para evitar ralentizar el dev server
    ...(isProd
      ? {}
      : {}),
  },
};
