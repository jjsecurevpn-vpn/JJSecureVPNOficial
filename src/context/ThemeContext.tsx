import React, { createContext, useContext, useEffect } from 'react';

// Colores púrpura fijos para la aplicación
const purpleColors = {
  50: '250 245 255',
  100: '243 232 255',
  200: '233 213 255',
  300: '196 181 253',
  400: '167 139 250',
  500: '139 92 246',
  600: '124 58 237',
  700: '109 40 217',
  800: '91 33 182',
  900: '76 29 149',
};

interface ThemeContextType {
  // Mantenemos una interfaz mínima por compatibilidad
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const applyPurpleColors = () => {
    const root = document.documentElement;
    Object.entries(purpleColors).forEach(([shade, value]) => {
      root.style.setProperty(`--primary-${shade}`, value);
    });
  };

  useEffect(() => {
    // Aplicar colores púrpura al inicializar
    applyPurpleColors();
  }, []);

  return (
    <ThemeContext.Provider value={{ isReady: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
