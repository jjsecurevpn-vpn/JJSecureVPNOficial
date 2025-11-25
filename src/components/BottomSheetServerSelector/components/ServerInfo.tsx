import { useTranslations } from "../../../hooks/useTranslations";

interface ServerConfig {
  name: string;
  description?: string;
}

interface ServerInfoProps {
  activeConfig: ServerConfig | null;
  compact?: boolean;
}

export function ServerInfo({ activeConfig, compact = false }: ServerInfoProps) {
  const { t } = useTranslations();
  const labels = t.bottomSheetServerSelector.serverInfo;
  
  const titleSize = compact ? 'text-[0.9rem] leading-snug' : 'text-h4';
  const descriptionSize = compact ? 'text-[0.65rem]' : activeConfig ? 'text-body' : 'text-caption';
  
  return (
    <div className={`flex items-center ${compact ? 'mb-3' : 'mb-4'}`} data-tutorial="server-selector">
      {/* Icono de servidor - no participa en el centrado */}
      <div className="flex-shrink-0 mr-2">
        <ServerRackIcon size={compact ? 24 : 28} className="text-white" />
      </div>
      
      {/* Información del servidor - alineada a la izquierda */}
      <div className="flex-1 min-w-0 flex flex-col">
        {activeConfig ? (
          <>
            <div className={`${titleSize} text-neutral-strong font-semibold truncate`}>
              {activeConfig.name}
            </div>
            {activeConfig.description && (
              <div className={`${descriptionSize} text-neutral-text truncate`}>
                {activeConfig.description}
              </div>
            )}
          </>
        ) : (
          <>
            <div className={`${titleSize} text-neutral-strong font-semibold truncate`}>
              {labels.selectServer}
            </div>
            <div className={`${descriptionSize} text-neutral-text truncate`}>
              {labels.selectServerDesc}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ServerRackIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M15 17a1 1 0 1 0 1 1a1 1 0 0 0-1-1m-6 0H6a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2m9 0a1 1 0 1 0 1 1a1 1 0 0 0-1-1m-3-6a1 1 0 1 0 1 1a1 1 0 0 0-1-1m-6 0H6a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2m9-6a1 1 0 1 0 1 1a1 1 0 0 0-1-1m0 6a1 1 0 1 0 1 1a1 1 0 0 0-1-1m4-6a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2a3 3 0 0 0 .78 2A3 3 0 0 0 2 11v2a3 3 0 0 0 .78 2A3 3 0 0 0 2 17v2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-2a3 3 0 0 0-.78-2a3 3 0 0 0 .78-2v-2a3 3 0 0 0-.78-2A3 3 0 0 0 22 7Zm-2 14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Zm0-6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Zm0-6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Zm-5-2a1 1 0 1 0 1 1a1 1 0 0 0-1-1M9 5H6a1 1 0 0 0 0 2h3a1 1 0 0 0 0-2"
      />
    </svg>
  );
}
