/**
 * @file Footer.tsx
 * @description Footer de navegación principal - EXCLUSIVO PARA ANDROID
 *
 * IMPORTANTE: Este componente está diseñado y optimizado exclusivamente para:
 * - Dispositivos Android
 * - Interfaces táctiles móviles
 * - APIs nativas de Android
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getNavigationBarHeight } from "../utils/deviceUtils";
import { applyBrowserTheme } from "../utils/metaUtils";
import { colors } from "../constants/theme";
import { getFooterTabs } from "../constants/navigationConfig";
import { FooterTabButton } from "./ui/FooterTabButton";
import { ResponsiveBox } from "./ui";
import { useResponsive } from "../hooks/useResponsive";
import { useResponsiveScale } from "../hooks/useResponsiveScale";
import { useTranslations } from "../context/LanguageContext";

interface FooterProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  isHidden?: boolean;
}

export function Footer({ activeTab = "home", onNavigate, isHidden }: FooterProps) {
  // Hooks responsivos y traducciones
  const { isXSmall, isSmall } = useResponsive();
  const { scale } = useResponsiveScale({ type: 'component' });
  const t = useTranslations();
  
  // Obtener la altura de la barra de navegación de Android
  const navigationBarHeight = getNavigationBarHeight();
  
  // Obtener los tabs con traducciones
  const footerTabs = getFooterTabs(t);
  
  // Configurar el color de la barra de navegación cuando el componente se monte
  useEffect(() => {
    return applyBrowserTheme(
      colors.background.secondary,
      'black-translucent'
    );
  }, []);
  
  const handleTabClick = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  // Si está oculto, no renderizar nada
  if (isHidden) {
    return null;
  }

  // Referencia para medir el footer real renderizado
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  // Medir después del render para exponer la variable CSS global
  useLayoutEffect(() => {
    if (isHidden) return;
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const height = rect.height;
      if (height && height !== measuredHeight) {
        setMeasuredHeight(height);
        document.documentElement.style.setProperty('--app-footer-height', `${height}px`);
      }
    }
  }, [isHidden, activeTab, isXSmall, isSmall, navigationBarHeight, measuredHeight]);

  // Limpieza si el footer se oculta
  useEffect(() => {
    if (isHidden) {
      document.documentElement.style.removeProperty('--app-footer-height');
    }
  }, [isHidden]);

  return (
    <ResponsiveBox
      position="fixed"
      style={{
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1001
      }}
      ref={containerRef}
    >
      {/* Footer con sistema de diseño reutilizable */}
      <ResponsiveBox
        style={{
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
            // Altura base (tabs) + zona segura inferior
          minHeight: `calc(${scale(isXSmall ? 56 : isSmall ? 60 : 64)}px + ${navigationBarHeight}px)`,
          paddingBottom: `${navigationBarHeight}px`,
          borderTopWidth: "1px",
          borderTopStyle: "solid"
        }}
      >
        {/* Barra de navegación principal */}
        <ResponsiveBox
          display="flex"
          gap={{ xs: isXSmall ? 1 : 2, sm: 3, md: 4 }}
          px={{ xs: isXSmall ? 4 : 6, sm: 8, md: 8, lg: 8 }}
          pb={{ xs: isXSmall ? 4 : 6, sm: 8, md: 8 }}
          pt={{ xs: isXSmall ? 2 : 4, sm: 4, md: 4 }}
        >
          {footerTabs.map((item) => (
            <FooterTabButton
              key={item.id}
              item={item}
              isActive={activeTab === item.id}
              onClick={() => handleTabClick(item.id)}
            />
          ))}
        </ResponsiveBox>
      </ResponsiveBox>
    </ResponsiveBox>
  );
}