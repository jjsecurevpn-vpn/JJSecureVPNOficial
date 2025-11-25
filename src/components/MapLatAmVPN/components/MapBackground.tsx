import React from 'react';

interface MapBackgroundProps {
  showGrid?: boolean;
  className?: string;
  children: React.ReactNode;
}

export type { MapBackgroundProps };

export const MapBackground: React.FC<MapBackgroundProps> = ({
  showGrid = false,
  className = "",
  children
}) => {
  const gridStyles = {
    backgroundImage: `
      linear-gradient(rgba(109, 74, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(109, 74, 255, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: "25px 25px"
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ backgroundColor: '#1D1A23' }}>
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={gridStyles}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-800/10 to-transparent pointer-events-none" />

      {children}
    </div>
  );
};
