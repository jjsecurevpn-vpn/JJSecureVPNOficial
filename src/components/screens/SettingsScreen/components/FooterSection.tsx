/**
 * @file FooterSection.tsx
 * @description Sección de footer con términos y condiciones
 */

import React, { useEffect, useRef } from "react";
import { Text, ResponsiveBox } from "../../../ui";
import { colors } from "../../../../constants/theme";
import { useResponsive } from "../../../../hooks/useResponsive";
import { useResponsiveScale } from "../../../../hooks/useResponsiveScale";
import { useTranslations } from "../../../../context/LanguageContext";
import { FooterSectionProps } from "../types";
import { useDevCreditIntegrity } from "../../../../utils/devCreditIntegrity";
import { openExternal } from "../utils/openExternal";
import { useFooterMarginTop, useFooterHorizontalPadding } from "../utils/layout";

export const FooterSection: React.FC<FooterSectionProps> = ({ 
  navigationBarHeight 
}) => {
  const { isXSmall } = useResponsive();
  const { scale } = useResponsiveScale({ type: 'component' });
  const t = useTranslations();
  const footerRef = useRef<HTMLDivElement>(null);
  const footerMarginTop = useFooterMarginTop();
  const footerHorizontal = useFooterHorizontalPadding();

  // Inicia sistema de integridad del crédito
  useDevCreditIntegrity();

  // Función para insertar el crédito directamente si no está presente
  useEffect(() => {
    const insertCreditDirect = () => {
      if (!footerRef.current) return;
      
      const container = footerRef.current;
      const existingCredit = container.querySelector('#dev-credit-signature');
      
      if (!existingCredit) {
        // Crear el elemento de crédito directamente
        const creditText = ['Dev', ': ', '@JH', 'Services', ' - ', 'Todos', ' ', 'los', ' ', 'derechos', ' ', 'reservados'].join('');
        const creditElement = document.createElement('div');
        creditElement.id = 'dev-credit-signature';
        creditElement.textContent = creditText;
        
        // Aplicar estilos responsive
        const vw = window.innerWidth;
        const baseSize = vw <= 320 ? 8 : vw <= 360 ? 9 : 10;
        
        Object.assign(creditElement.style, {
          fontSize: `${baseSize}px`,
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: `${Math.max(baseSize * 3.2, 24)}px`,
          padding: `${Math.max(baseSize * 0.8, 6)}px ${Math.max(baseSize * 1.2, 8)}px`,
          fontWeight: '300',
          lineHeight: '1.2',
          letterSpacing: vw <= 320 ? '0px' : '0.25px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
          userSelect: 'text',
          visibility: 'visible',
          opacity: '0.85',
          position: 'relative',
          zIndex: '10'
        });
        
        // Si la pantalla es muy pequeña, aplicar ellipsis
        if (vw <= 320) {
          creditElement.style.whiteSpace = 'nowrap';
          creditElement.style.overflow = 'hidden';
          creditElement.style.textOverflow = 'ellipsis';
        }
        
        // Limpiar el contenedor e insertar el crédito
        container.innerHTML = '';
        container.appendChild(creditElement);
        
        console.log('[INTEGRIDAD] Crédito de desarrollador insertado desde React en SettingsScreen');
      }
    };

    // Insertar inmediatamente
    insertCreditDirect();
    
    // También insertar después de un pequeño delay por si el DOM no está listo
    const timer = setTimeout(insertCreditDirect, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ResponsiveBox
      style={{
        marginTop: footerMarginTop,
        paddingLeft: footerHorizontal,
        paddingRight: footerHorizontal,
        paddingBottom: navigationBarHeight + scale(28)
      }}
    >
      {/* Enlaces planos sin card */}
      <ResponsiveBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={{ xs: 10, sm: 12, md: 14 }}
        style={{ fontSize: scale(10), marginBottom: scale(10), flexWrap: 'wrap', textAlign: 'center' }}
      >
        <button
          onClick={() => openExternal("https://shop.jhservices.com.ar/terminos")}
          style={{
            color: colors.brand.primary,
            background: 'transparent',
            border: 'none',
            padding: 0,
            textDecoration: 'underline',
            fontWeight: 300,
            fontSize: scale(10),
            cursor: 'pointer',
            outline: 'none',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          onFocus={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onBlur={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          {t.settings.termsAndConditions}
        </button>
        <Text variant="bodySmall" color="disabled" as="span" style={{ fontSize: scale(10) }}>•</Text>
        <button
          onClick={() => openExternal("https://shop.jhservices.com.ar/privacidad")}
          style={{
            color: colors.brand.primary,
            background: 'transparent',
            border: 'none',
            padding: 0,
            textDecoration: 'underline',
            fontWeight: 300,
            fontSize: scale(10),
            cursor: 'pointer',
            outline: 'none',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          onFocus={(e) => { e.currentTarget.style.opacity = '0.7'; }}
          onBlur={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          {t.settings.privacyPolicy}
        </button>
      </ResponsiveBox>

      {/* Contenedor de crédito sin fondo ni borde extra */}
      <ResponsiveBox
        ref={footerRef}
        className="text-center"
        data-settings-footer-section
        style={{
          minHeight: isXSmall ? scale(32) : scale(40),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${scale(6)}px ${scale(8)}px`,
          position: 'relative'
        }}
      >
        {/* Fallback inicial: el sistema de integridad lo reemplazará si es necesario */}
        <span
          id="dev-credit-fallback"
          style={{
            fontSize: scale(10),
            fontWeight: 300,
            opacity: 0.8,
            letterSpacing: '0.25px'
          }}
        >
          Dev: @JHServices - Todos los derechos reservados
        </span>
      </ResponsiveBox>
    </ResponsiveBox>
  );
};
