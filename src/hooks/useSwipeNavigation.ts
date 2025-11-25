/**
 * @file useSwipeNavigation.ts
 * @description Hook para navegación por gestos de deslizamiento entre pantallas
 */

import { useRef, useCallback, useState, TouchEvent } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number;
  maxVerticalDistance?: number;
  preventScroll?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export interface SwipeIndicatorState {
  direction: 'left' | 'right' | null;
  nextTab: string | null;
  isVisible: boolean;
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
  maxVerticalDistance = 100,
  preventScroll = false
}: SwipeConfig) {
  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
      touchEnd.current = null;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.touches[0];
    if (touch) {
      const deltaY = Math.abs(touch.clientY - touchStart.current.y);
      
      // Si el movimiento vertical es muy grande, probablemente es scroll, no swipe horizontal
      if (deltaY > maxVerticalDistance && !preventScroll) {
        touchStart.current = null;
        return;
      }

      // Si preventScroll está habilitado, prevenir el scroll durante el swipe
      if (preventScroll) {
        const deltaX = Math.abs(touch.clientX - touchStart.current.x);
        if (deltaX > deltaY) {
          e.preventDefault();
        }
      }
    }
  }, [maxVerticalDistance, preventScroll]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    if (touch) {
      touchEnd.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      const deltaX = touchEnd.current.x - touchStart.current.x;
      const deltaY = Math.abs(touchEnd.current.y - touchStart.current.y);
      const deltaTime = touchEnd.current.time - touchStart.current.time;

      // Verificar si es un swipe válido
      const isHorizontalSwipe = Math.abs(deltaX) > minSwipeDistance;
      const isNotVerticalScroll = deltaY < maxVerticalDistance;
      const isNotTooSlow = deltaTime < 500; // Máximo 500ms para el gesto

      if (isHorizontalSwipe && isNotVerticalScroll && isNotTooSlow) {
        if (deltaX > 0 && onSwipeRight) {
          // Swipe hacia la derecha
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          // Swipe hacia la izquierda
          onSwipeLeft();
        }
      }
    }

    // Limpiar referencias
    touchStart.current = null;
    touchEnd.current = null;
  }, [minSwipeDistance, maxVerticalDistance, onSwipeLeft, onSwipeRight]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  };
}

// Hook específico para navegación entre tabs del footer
export function useFooterSwipeNavigation(tabs: string[], activeTab: string, onNavigate: (tab: string) => void) {
  const currentIndex = tabs.indexOf(activeTab);
  const [indicator, setIndicator] = useState<SwipeIndicatorState>({
    direction: null,
    nextTab: null,
    isVisible: false
  });

  const showIndicator = useCallback((direction: 'left' | 'right', nextTab: string) => {
    setIndicator({ direction, nextTab, isVisible: true });
    setTimeout(() => {
      setIndicator(prev => ({ ...prev, isVisible: false }));
    }, 300);
  }, []);

  const handleSwipeLeft = useCallback(() => {
    // Swipe izquierda = siguiente tab
    const nextIndex = (currentIndex + 1) % tabs.length;
    const nextTab = tabs[nextIndex];
    showIndicator('left', nextTab);
    setTimeout(() => onNavigate(nextTab), 150);
  }, [currentIndex, tabs, onNavigate, showIndicator]);

  const handleSwipeRight = useCallback(() => {
    // Swipe derecha = tab anterior
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    const prevTab = tabs[prevIndex];
    showIndicator('right', prevTab);
    setTimeout(() => onNavigate(prevTab), 150);
  }, [currentIndex, tabs, onNavigate, showIndicator]);

  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    minSwipeDistance: 75, // Un poco más de distancia para evitar activaciones accidentales
    maxVerticalDistance: 120,
    preventScroll: false // Permitir scroll vertical
  });

  return {
    ...swipeHandlers,
    indicator
  };
}
