interface UseBottomSheetGesturesProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

/**
 * Hook para manejar gestos táctiles del BottomSheet
 * - Swipe hacia arriba: expande el panel
 * - Swipe hacia abajo: colapsa el panel
 * - Tap rápido: alterna estado expandido/colapsado
 */
export function useBottomSheetGestures({ isExpanded, setIsExpanded }: UseBottomSheetGesturesProps) {
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    
    // Ignorar gestos en elementos interactivos o scroll containers
    if (target.closest('button, [role="button"], .no-swipe, .premium-cards-container')) {
      return;
    }

    e.preventDefault();
    
    const startY = e.touches[0].clientY;
    const startTime = Date.now();
    let hasMoved = false;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      hasMoved = true;
      
      const deltaY = startY - moveEvent.touches[0].clientY;
      const threshold = 15;

      if (deltaY > threshold && !isExpanded) {
        setIsExpanded(true);
        cleanup();
      } else if (deltaY < -threshold && isExpanded) {
        setIsExpanded(false);
        cleanup();
      }
    };

    const handleTouchEnd = () => {
      const duration = Date.now() - startTime;
      const isQuickTap = !hasMoved && duration < 120;
      const isTapInUpperHalf = startY < window.innerHeight * 0.6;
      
      if (isQuickTap && isTapInUpperHalf) {
        setIsExpanded(!isExpanded);
      }
      
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
  };

  return { handleTouchStart };
}
