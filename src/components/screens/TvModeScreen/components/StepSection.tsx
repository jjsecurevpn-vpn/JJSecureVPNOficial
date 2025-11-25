import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface StepSectionProps {
  title: string;
  headerSize: 'small' | 'medium' | 'large';
  compact?: boolean;
  padding: number;
  children: React.ReactNode;
  className?: string;
  showScrollButtons?: boolean;
  scrollable?: boolean;
}

// Simulación del componente ResponsiveStepHeader
const ResponsiveStepHeader: React.FC<{ title: string; size: string; compact?: boolean }> = ({ title, size }) => (
  <div className={`px-6 py-2 text-center pointer-events-auto cursor-default transition-all duration-200 select-none ${size === 'large' ? 'text-xl font-semibold' : size === 'medium' ? 'text-lg font-medium' : 'text-base font-medium'}`}>
    {title}
  </div>
);

export const StepSection: React.FC<StepSectionProps> = ({
  title,
  headerSize,
  compact,
  padding,
  children,
  className,
  showScrollButtons = false,
  scrollable = true,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    if (!scrollable) return;
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 5);
    }
  }, [scrollable]);

  React.useEffect(() => {
    if (!scrollable) return;
    checkScroll();
    const container = contentRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, scrollable]);

  const handleScrollUp = () => {
    if (!scrollable) return;
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: -contentRef.current.clientHeight * 0.8, behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    if (!scrollable) return;
    if (contentRef.current) {
      contentRef.current.scrollBy({ top: contentRef.current.clientHeight * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .scroll-btn-active {
          animation: slideIn 0.3s ease-out;
        }

        .scroll-button {
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .scroll-button:focus {
          outline: none;
          box-shadow: none;
        }

        .scroll-button:focus-visible {
          outline: none;
          box-shadow: none;
        }
      `}</style>

      <div
        className={`min-h-0 rounded-xl bg-surface/70 border border-surface-border flex flex-col ${
          className || ''
        }`}
      >
        <ResponsiveStepHeader title={title} size={headerSize} compact={compact} />

        <div className="flex-1 min-h-0 flex flex-col relative group">
          {/* Botón arriba - área cliqueable grande */}
          {showScrollButtons && scrollable && (
            <button
              onClick={handleScrollUp}
              className={`scroll-button flex-shrink-0 w-full h-12 pointer-events-auto transition-all duration-300 flex items-center justify-center border-t-0 border-b ${
                canScrollUp
                  ? 'text-brand hover:text-primary-500 border-brand/50 hover:border-brand shadow-sm hover:shadow-md hover:shadow-brand/20 active:scale-95 cursor-pointer'
                  : 'text-brand border-brand/30 shadow-sm hover:shadow-md hover:shadow-brand/20 cursor-pointer opacity-60 hover:opacity-100'
              }`}
              title="Scroll arriba"
            >
              <ChevronUp size={32} strokeWidth={2.5} className="transition-transform group-hover:-translate-y-1" />
            </button>
          )}

          {/* Contenido scrolleable */}
          <div
            className={`${scrollable ? 'flex-1 overflow-auto' : 'flex-none overflow-visible'} scrollbar-hidden`}
            style={{ padding }}
            ref={contentRef}
          >
            {children}
          </div>

          {/* Botón abajo - área cliqueable grande */}
          {showScrollButtons && scrollable && (
            <button
              onClick={handleScrollDown}
              className={`scroll-button flex-shrink-0 w-full h-12 pointer-events-auto transition-all duration-300 flex items-center justify-center border-b-0 border-t ${
                canScrollDown
                  ? 'text-brand hover:text-primary-500 border-brand/50 hover:border-brand shadow-sm hover:shadow-md hover:shadow-brand/20 active:scale-95 cursor-pointer'
                  : 'text-brand border-brand/30 shadow-sm hover:shadow-md hover:shadow-brand/20 cursor-pointer opacity-60 hover:opacity-100'
              }`}
              title="Scroll abajo"
            >
              <ChevronDown size={32} strokeWidth={2.5} className="transition-transform group-hover:translate-y-1" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};