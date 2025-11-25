import { FileText } from 'lucide-react';
import { useTranslations } from '../../../../hooks/useTranslations';

function openNativeLogs() {
  try {
    if (typeof window !== 'undefined' && (window as any).DtShowLoggerDialog) {
      (window as any).DtShowLoggerDialog.execute();
    }
  } catch {}
}

export function ResponsiveLogsButton({ size, compact = false }: { size: 'small' | 'medium' | 'large'; compact?: boolean }) {
  const { t } = useTranslations();
  const sizeConfig = {
    small: { width: compact ? 'w-32' : 'w-40', height: compact ? 'h-10' : 'h-12', iconSize: compact ? 16 : 18, text: 'text-xs' },
    medium: { width: 'w-48', height: 'h-14', iconSize: 20, text: 'text-sm' },
    large: { width: 'w-56', height: 'h-16', iconSize: 24, text: 'text-base' }
  }[size];
  return (
    <button
      className={`no-swipe font-semibold tracking-wide touch-manipulation transition-all duration-200 ${sizeConfig.width} ${sizeConfig.height} rounded-lg flex flex-row items-center justify-center gap-2 shadow-lg bg-slate-600 hover:bg-slate-500 text-white active:scale-95 disabled:opacity-50 ${sizeConfig.text}`}
      onClick={openNativeLogs}
      title={t.bottomSheetServerSelector.connectionButtons.logsTooltip}
      aria-label={t.bottomSheetServerSelector.connectionButtons.logsButton}
      data-vc-focusable
    >
      <FileText size={sizeConfig.iconSize} className="text-white" strokeWidth={1.5} />
      <span>{t.bottomSheetServerSelector.connectionButtons.logsButton}</span>
    </button>
  );
}
