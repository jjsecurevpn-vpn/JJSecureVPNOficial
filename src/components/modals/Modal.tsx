/**
 * @file Modal.tsx
 * @description Modal liviano optimizado para Android móvil estilo Proton VPN
 * @colors Sistema completo de Proton VPN con palette de dark theme
 */

import React, { useState, useLayoutEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { useAndroidBackButton } from "../../hooks/useAndroidBackButton";
import { useSafeArea } from "../../utils/deviceUtils";
import {
  MODAL_ANIMATION_MS,
  MODAL_Z_CONTAINER,
  MODAL_Z_OVERLAY,
  DEFAULT_MODAL_HEIGHT_PERCENT,
  DEFAULT_MODAL_MAX_HEIGHT_VH,
  DEFAULT_MODAL_MIN_HEIGHT,
  MODAL_SIDE_PADDING,
  MODAL_VERTICAL_SAFE_PADDING,
  runAfterAnimation,
} from "./modalConstants";

// Tipo más flexible para aceptar tanto íconos de Lucide como personalizados
type IconComponent = React.ComponentType<{
  className?: string;
  width?: number;
  height?: number;
}>;

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  allowClose?: boolean;
  title?: string | React.ReactNode;
  icon?: IconComponent;
  headerAction?: React.ReactNode;
  disableScroll?: boolean;
  /** Personalizar porcentaje de alto (default 85) usado por getModalStyle */
  heightPercent?: number;
  /** Desactivar animación (útil para pruebas o montajes rápidos) */
  disableAnimation?: boolean;
  /** Duración de animación ms (solo override puntual) */
  animationDurationMs?: number;
}

export function Modal({
  children,
  onClose,
  allowClose = true,
  title,
  icon: Icon,
  headerAction,
  disableScroll = false,
  heightPercent = DEFAULT_MODAL_HEIGHT_PERCENT,
  disableAnimation = false,
  animationDurationMs = MODAL_ANIMATION_MS,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isClosingRef = useRef(false);
  const { getModalStyle, statusBarHeight, navigationBarHeight } = useSafeArea();

  const handleClose = useCallback(() => {
    if (!allowClose) return;
    if (disableAnimation) {
      onClose();
      return;
    }
    // Evitar múltiples triggers
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsVisible(false);
    runAfterAnimation(() => {
      onClose();
    }, animationDurationMs);
  }, [allowClose, onClose, disableAnimation, animationDurationMs]);

  useAndroidBackButton({
    isActive: true,
    onBackPressed: handleClose,
  });

  useLayoutEffect(() => {
    if (disableAnimation) {
      setIsVisible(true);
      return;
    }
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [disableAnimation]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && allowClose) {
        handleClose();
      }
    },
    [allowClose, handleClose]
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 ${disableAnimation ? '' : 'transition-opacity'} touch-manipulation ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: MODAL_Z_OVERLAY, transitionDuration: disableAnimation ? undefined : `${animationDurationMs}ms` }}
        onClick={handleBackdropClick}
      />
      {/* Container */}
      <div
        className={`fixed inset-0 flex items-end xs:items-center justify-center pointer-events-none touch-manipulation`}
        style={{
          zIndex: MODAL_Z_CONTAINER,
          paddingTop: `${statusBarHeight + MODAL_VERTICAL_SAFE_PADDING}px`,
          paddingBottom: `${navigationBarHeight + MODAL_VERTICAL_SAFE_PADDING}px`,
          paddingLeft: `${MODAL_SIDE_PADDING}px`,
          paddingRight: `${MODAL_SIDE_PADDING}px`
        }}
      >
        <div
            role="dialog"
            aria-modal={true}
            aria-label={typeof title === 'string' ? title : undefined}
            className={`w-full rounded-t-2xl xs:rounded-2xl panel-base-lg flex flex-col pointer-events-auto overflow-hidden ${disableAnimation ? '' : 'transition-transform'} xs:max-w-md ${
              isVisible ? 'translate-y-0' : 'translate-y-full xs:translate-y-4'
            }`}
            style={{
              ...getModalStyle(heightPercent),
              maxWidth: 'min(90vw, 440px)',
              minHeight: `${DEFAULT_MODAL_MIN_HEIGHT}px`,
              maxHeight: `${DEFAULT_MODAL_MAX_HEIGHT_VH}vh`,
              transitionDuration: disableAnimation ? undefined : `${animationDurationMs}ms`
            }}
        >
          {(title || Icon) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {Icon && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand/20 text-brand">
                    <Icon className="w-5 h-5" width={20} height={20} />
                  </div>
                )}
                {title && (
                  <div className="min-w-0 flex-1">
                    {typeof title === 'string' ? (
                      <h2 className="truncate text-white font-semibold text-[20px] leading-[26px] tracking-[-0.1px] font-sans">
                        {title}
                      </h2>
                    ) : (
                      <div>{title}</div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
                {allowClose && (
                  <button
                    onClick={handleClose}
                    aria-label="Cerrar modal"
                    className="icon-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}
          {!title && !Icon && allowClose && (
            <button
              onClick={handleClose}
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 z-10 icon-btn bg-surface/70 border border-surface-border/70"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div
            className={`flex-1 min-h-0 hide-scrollbar bg-surface ${disableScroll ? '' : 'overflow-y-auto'}`}
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y'
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}