import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),

    // Gera relatório de peso visual
    visualizer({
      filename: './dist/report.html',
      open: false, // No abrir automáticamente para builds automatizados
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
  ],

  build: {
    target: 'es2015', // Compatível com Android 6+ y webviews modernas
    minify: 'esbuild', // Más rápido y eficiente que terser
    cssCodeSplit: true, // Dividir CSS para mejor caching
    sourcemap: false, // Remove mapa de código no build final (mais leve)
    chunkSizeWarningLimit: 600, // Reducir límite para mantener chunks pequeños
    rollupOptions: {
      output: {
        // Estrategia refinada de chunking para mejor caché sin lazy
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('lucide-react')) return 'icons-vendor';
            if (id.includes('react-simple-maps') || id.includes('d3-')) return 'maps-vendor';
          }
          if (id.includes('src/components/MapLatAmVPN')) return 'map-core';
          if (id.includes('src/components/modals')) return 'modals';
          return undefined; // fallback a chunking default
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Optimizaciones adicionales para reducir el tamaño
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: false,
        // Eliminar código muerto más agresivamente
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none', // Remueve comentarios legales para reducir tamaño
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    // Configuraciones adicionales para mejor tree-shaking
    treeShaking: true,
    pure: ['console.log', 'console.warn'], // Marcar funciones como "pure" para eliminación
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'], // Pre-bundlea todas las dependencias críticas
    // Excluir dependencias que no necesitan optimización
    exclude: ['@types/*']
  },

  // Configuración adicional para análisis de rendimiento
  define: {
    // Eliminar variables de desarrollo en producción
    __DEV__: false,
    'process.env.NODE_ENV': JSON.stringify('production')
  },
});
