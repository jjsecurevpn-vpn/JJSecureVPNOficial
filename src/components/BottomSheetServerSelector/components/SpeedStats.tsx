import { Download, Upload } from 'lucide-react';
import type { NetSpeedsResult } from "../../../hooks/useNetSpeeds";

interface SpeedStatsProps {
  netSpeeds: NetSpeedsResult;
  isConnected: boolean;
}

export function SpeedStats({
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
