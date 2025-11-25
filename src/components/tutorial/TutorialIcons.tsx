import React from 'react';
import { colors } from '../../constants/theme';

const ICON_BUTTON_STYLES = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.text.primary,
  width: '32px',
  height: '32px',
  padding: '0',
  outline: 'none'
};

const SVG_BASE_PROPS = {
  width: "16",
  height: "16",
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

const STROKE_PROPS = {
  stroke: "currentColor",
  strokeWidth: "2",
  fill: "none"
};

export const TutorialIcon: React.FC<{ 
  className?: string; 
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ className = '', onClick, style = {} }) => (
  <button
    onClick={onClick}
    className={`tutorial-trigger-button ${className}`}
    title="Iniciar tutorial"
    aria-label="Iniciar tutorial"
    style={{ ...ICON_BUTTON_STYLES, ...style }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.color = colors.brand.primary;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.color = colors.text.primary;
    }}
  >
    <svg {...SVG_BASE_PROPS} style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" {...STROKE_PROPS} />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" {...STROKE_PROPS} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  </button>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg {...SVG_BASE_PROPS} className={className}>
    <polygon points="5,3 19,12 5,21" fill="currentColor" />
  </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg {...SVG_BASE_PROPS} className={className}>
    <circle cx="12" cy="12" r="9" {...STROKE_PROPS} />
    <path d="M12 16v-4" {...STROKE_PROPS} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
);
