import { memo } from 'react';
import { Download, Upload } from 'lucide-react';
import type { NetSpeedsResult } from "../../../hooks/useNetSpeeds";

interface SpeedStatsProps {
  netSpeeds: NetSpeedsResult;
  isConnected: boolean;
}

/**
 * SpeedStats - Componente memoizado para mostrar estadísticas de velocidad
 * Solo se re-renderiza cuando cambian los valores de velocidad o el estado de conexión
 */
function SpeedStatsComponent({
  netSpeeds,
  isConnected,
}: SpeedStatsProps) {
  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isConnected ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isConnected}
    >
      {isConnected && (
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Download size={18} className="text-emerald-400" strokeWidth={2.5} />
            <span className="text-sm font-medium text-gray-200">
              {netSpeeds.formatted.download}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-600 opacity-30" />
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-sky-400" strokeWidth={2.5} />
            <span className="text-sm font-medium text-gray-200">
              {netSpeeds.formatted.upload}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Función de comparación personalizada para evitar re-renders innecesarios
function arePropsEqual(prevProps: SpeedStatsProps, nextProps: SpeedStatsProps): boolean {
  return (
    prevProps.isConnected === nextProps.isConnected &&
    prevProps.netSpeeds.formatted.download === nextProps.netSpeeds.formatted.download &&
    prevProps.netSpeeds.formatted.upload === nextProps.netSpeeds.formatted.upload
  );
}

export const SpeedStats = memo(SpeedStatsComponent, arePropsEqual);
