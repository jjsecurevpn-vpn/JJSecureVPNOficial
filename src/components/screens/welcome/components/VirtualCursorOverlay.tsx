import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { VirtualCursorApi } from '../hooks/useVirtualCursor';

interface VirtualCursorOverlayProps {
  cursor: VirtualCursorApi;
}

export const VirtualCursorOverlay: React.FC<VirtualCursorOverlayProps> = ({ cursor }) => {
  const { active, position, precision, debug, toggleDebug } = cursor;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        toggleDebug();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleDebug]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {active && (
        <div
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            width: precision ? 26 : 32,
            height: precision ? 26 : 32,
            marginLeft: (precision ? 26 : 32) / -2,
            marginTop: (precision ? 26 : 32) / -2,
            pointerEvents: 'none',
            zIndex: 9999,
            transition: 'width 0.15s, height 0.15s, margin 0.15s'
          }}
        >
          <div className={`virtual-cursor-pointer ${precision ? 'scale-90 opacity-90' : 'scale-100 opacity-100'}`}
               style={{width: '100%', height: '100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 32 32" className="cursor-shape">
              <path fill="currentColor" d="M9.391 2.32C8.42 1.56 7 2.253 7 3.486V28.41c0 1.538 1.966 2.18 2.874.938l6.225-8.523a2 2 0 0 1 1.615-.82h9.69c1.512 0 2.17-1.912.978-2.844z" />
            </svg>
          </div>
        </div>
      )}
      {debug && (
        <div className="fixed bottom-2 left-2 z-[10000] text-[10px] font-mono bg-black/70 text-white px-2 py-1 rounded">
          x:{Math.round(position.x)} y:{Math.round(position.y)} prec:{precision ? '1' : '0'}
        </div>
      )}
    </>,
    document.body
  );
};
