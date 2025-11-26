import React, { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';
import { Globe2 } from 'lucide-react';
import { useSafeArea } from '../../../../utils/deviceUtils';

export const LanguageSelectorBadge: React.FC = () => {
  const { currentLanguage, availableLanguages, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const { statusBarHeight } = useSafeArea();

  // Espaciado base superior cuando no hay status bar detectable
  const baseTop = 14;
  // Si hay statusBarHeight válido, dejamos un margen adicional pequeño (6px)
  const computedTop = Math.max(statusBarHeight + 6, baseTop);

  return (
    <div
      className="fixed z-[11000]"
      style={{
        // Combina statusBarHeight nativo + env safe-area-inset-top (no se suman, se usa el mayor)
        // y añade un pequeño margen visual.
        top: `calc(max(${computedTop}px, env(safe-area-inset-top, 0px) + 6px))`,
        left: 16,
        transition: 'top 180ms ease'
      }}
    >
      <div className="relative group">
        {/* Botón flotante */}
        <button
          onClick={() => setOpen(o => !o)}
          onBlur={(e) => {
            // Cierra si el foco se va fuera del contenedor
            if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
              setOpen(false);
            }
          }}
          className="flex items-center gap-2 px-3 h-10 rounded-full bg-[rgba(20,23,27,0.85)] backdrop-blur-md border border-[rgba(255,255,255,0.08)] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)] text-[13px] font-medium text-white/85 hover:text-white hover:border-[rgba(255,255,255,0.16)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        >
          <Globe2 className="w-4 h-4" strokeWidth={1.75} />
          <span>{currentLanguage.toUpperCase()}</span>
          <svg
            className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M5 8l5 5 5-5" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute left-0 mt-2 min-w-[160px] rounded-xl p-1.5 bg-[rgba(15,17,20,0.92)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] shadow-[0_8px_28px_-6px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.05)] animate-[fadeIn_.15s_ease]"
          >
            <ul className="flex flex-col gap-0.5 max-h-[260px] overflow-y-auto scrollbar-thin">
              {availableLanguages.map(lang => (
                <li key={lang.code}>
                  <button
                    onClick={() => {
                      setLanguage(lang.code);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-[13px] tracking-wide flex items-center justify-between transition-colors ${lang.code === currentLanguage ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30' : 'text-white/75 hover:text-white hover:bg-white/5 border border-transparent'}`}
                  >
                    <span>{lang.nativeName}</span>
                    {lang.code === currentLanguage && (
                      <span className="text-[10px] font-semibold uppercase text-emerald-300">ACTUAL</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
