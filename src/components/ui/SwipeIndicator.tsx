/**
 * @file SwipeIndicator.tsx
 * @description Componente para mostrar indicadores visuales durante el swipe
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeIndicatorProps {
  direction: 'left' | 'right' | null;
  nextTab?: string | null;
  isVisible?: boolean;
}

export const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ 
  direction, 
  nextTab, 
  isVisible = false 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible && direction && nextTab) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, direction, nextTab]);

  if (!show || !direction || !nextTab) return null;

  return (
    <div 
      className={`swipe-indicator ${direction} ${show ? 'show' : ''}`}
      style={{
        position: 'fixed',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 999,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: 'none',
        backdropFilter: 'blur(10px)',
        ...(direction === 'left' ? { left: '20px' } : { right: '20px' })
      }}
    >
      {direction === 'left' ? (
        <>
          <ChevronLeft size={16} />
          <span>{nextTab.toUpperCase()}</span>
        </>
      ) : (
        <>
          <span>{nextTab.toUpperCase()}</span>
          <ChevronRight size={16} />
        </>
      )}
    </div>
  );
};
