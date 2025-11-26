/**
 * Utilidades para obtener información del dispositivo y calcular safe areas
 * Especialmente útil para Android donde necesitamos respetar las barras del sistema
 */

import { useState, useEffect, type CSSProperties } from "react";

// Interfaces para las APIs nativas disponibles
declare global {
  interface Window {
    DtGetStatusBarHeight?: {
      execute: () => number;
    };
    DtGetNavigationBarHeight?: {
      execute: () => number;
    };
    DtSetNavigationBarColor?: {
      execute: (color: string) => void;
    };
  }
}

/**
 * Obtiene la altura de la barra de estado del dispositivo
 * @returns Altura en píxeles de la barra de estado
 */
export const getStatusBarHeight = (): number => {
  try {
    if (
      window.DtGetStatusBarHeight &&
      typeof window.DtGetStatusBarHeight.execute === "function"
    ) {
      return window.DtGetStatusBarHeight.execute();
    }
  } catch {
    // Error obteniendo altura de la barra de estado
  }

  // Fallback: altura típica en Android
  return 24;
};

/**
 * Obtiene la altura de la barra de navegación del dispositivo
 * @returns Altura en píxeles de la barra de navegación
 */
export const getNavigationBarHeight = (): number => {
  try {
    if (
      window.DtGetNavigationBarHeight &&
      typeof window.DtGetNavigationBarHeight.execute === "function"
    ) {
      return window.DtGetNavigationBarHeight.execute();
    }
  } catch {
    // Error obteniendo altura de la barra de navegación
  }

  // Fallback: altura típica en Android
  return 48;
};

/**
 * Establece el color de la barra de navegación del dispositivo (Android)
 * @param color - Color en formato hexadecimal o token de tema
 */
export const setNavigationBarColor = (color: string): void => {
  try {
    if (
      window.DtSetNavigationBarColor &&
      typeof window.DtSetNavigationBarColor.execute === "function"
    ) {
      window.DtSetNavigationBarColor.execute(color);
    }
  } catch {
    // Error configurando color de la barra de navegación
    // Esto es normal en entornos web o cuando la API no está disponible
  }
};

/**
 * Calcula la altura total ocupada por las barras del sistema
 * @returns Objeto con las alturas individuales y total
 */
export const getSystemBarsHeight = () => {
  const statusBarHeight = getStatusBarHeight();
  const navigationBarHeight = getNavigationBarHeight();

  return {
    statusBar: statusBarHeight,
    navigationBar: navigationBarHeight,
    total: statusBarHeight + navigationBarHeight,
  };
};

/**
 * Calcula la altura disponible para contenido descontando las barras del sistema
 * @returns Altura disponible en píxeles
 */
export const getAvailableHeight = (): number => {
  const viewportHeight = window.innerHeight;
  const systemBars = getSystemBarsHeight();

  return Math.max(viewportHeight - systemBars.total, 300); // Mínimo 300px
};

/**
 * Calcula el porcentaje de altura disponible para modales
 * @param percentage - Porcentaje deseado (por defecto 85%)
 * @returns Altura calculada en píxeles
 */
export const getModalMaxHeight = (percentage: number = 85): number => {
  const availableHeight = getAvailableHeight();
  return Math.floor((availableHeight * percentage) / 100);
};

/**
 * Genera las clases CSS dinámicas para altura máxima de modales
 * @param percentage - Porcentaje deseado (por defecto 85%)
 * @returns String con el estilo CSS inline
 */
export const getModalHeightStyle = (
  percentage: number = 85
): CSSProperties => {
  const maxHeight = getModalMaxHeight(percentage);

  return {
    maxHeight: `${maxHeight}px`,
    height: "auto",
  };
};

/**
 * Hook personalizado para obtener información de safe areas en tiempo real
 * Se actualiza cuando cambia el tamaño de la ventana
 */
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState(() => getSystemBarsHeight());
  const [availableHeight, setAvailableHeight] = useState(() =>
    getAvailableHeight()
  );

  useEffect(() => {
    const updateSafeArea = () => {
      setSafeArea(getSystemBarsHeight());
      setAvailableHeight(getAvailableHeight());
    };

    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener("resize", updateSafeArea);
    window.addEventListener("orientationchange", updateSafeArea);

    return () => {
      window.removeEventListener("resize", updateSafeArea);
      window.removeEventListener("orientationchange", updateSafeArea);
    };
  }, []);

  return {
    statusBarHeight: safeArea.statusBar,
    navigationBarHeight: safeArea.navigationBar,
    totalSystemBarsHeight: safeArea.total,
    availableHeight,
    getModalHeight: (percentage: number = 85) => getModalMaxHeight(percentage),
    getModalStyle: (percentage: number = 85) => getModalHeightStyle(percentage),
  };
};

/**
 * Información del dispositivo para debugging
 */
export const getDeviceInfo = () => {
  const systemBars = getSystemBarsHeight();
  const availableHeight = getAvailableHeight();

  return {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    systemBars,
    availableHeight,
    modalHeights: {
      "80%": getModalMaxHeight(80),
      "85%": getModalMaxHeight(85),
      "90%": getModalMaxHeight(90),
    },
    apis: {
      hasStatusBarAPI: !!(
        window.DtGetStatusBarHeight && window.DtGetStatusBarHeight.execute
      ),
      hasNavigationBarAPI: !!(
        window.DtGetNavigationBarHeight &&
        window.DtGetNavigationBarHeight.execute
      ),
    },
  };
};
