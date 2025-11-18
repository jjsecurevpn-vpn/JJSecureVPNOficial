// Declaraciones globales para propiedades nativas no tipadas
// Añadido para evitar errores TS en App.tsx relacionados con WebView APIs

export {};

declare global {
  interface Window {
    DtOpenWebview?: { execute: (url: string) => void };
    DtStartWebViewActivity?: { execute: (url: string) => void };
  }

  // Permitir importaciones de CSS/otros assets sin tipos dedicados
}

// Declaración modular separada para CSS (fuera de declare global)
declare module '*.css';
