/**
 * @file MissingConfigWarningModal.tsx
 * @description Modal de advertencia cuando faltan credenciales y/o servidor
 */
import { AlertTriangle, Key, Server } from "lucide-react";
import { Modal } from "./Modal";
import type { ModalType } from "../../App";
import { useMemo } from "react";
import { useTranslations } from "../../hooks/useTranslations";

interface Props {
  onClose: () => void;
  onNavigate?: (modal: ModalType) => void;
  /**
   * type: missingcredentials | missingserver | missingsetup
   */
  notification?: { type: "missingcredentials" | "missingserver" | "missingsetup" };
}

export function MissingConfigWarningModal({ onClose, onNavigate, notification }: Props) {
  const { t } = useTranslations();
  const type = notification?.type || "missingsetup";

  const Title = (
    <div className="flex items-center gap-2">
      <span>{t.modals?.missingConfig?.title || 'Configuración incompleta'}</span>
    </div>
  );

  const content = useMemo(() => {
    const m = t.modals?.missingConfig;
    const base = {
      missingcredentials: {
        message: m?.messages?.missingCredentials || 'Faltan tus credenciales de acceso (usuario y/o contraseña).',
        buttons: [
          { label: m?.buttons?.configureCredentials || 'Configurar credenciales', modal: 'credentials' as ModalType, icon: Key, variant: 'action', cols: 1 }
        ],
        columns: 1
      },
      missingserver: {
        message: m?.messages?.missingServer || 'No has seleccionado un servidor.',
        buttons: [
          { label: m?.buttons?.chooseServer || 'Elegir servidor', modal: 'serverselector' as ModalType, icon: Server, variant: 'action', cols: 1 }
        ],
        columns: 1
      },
      missingsetup: {
        message: m?.messages?.missingSetup || 'Faltan datos para conectar: selecciona un servidor y completa tus credenciales.',
        buttons: [
          { label: m?.buttons?.server || 'Servidor', modal: 'serverselector' as ModalType, icon: Server, variant: 'neutral' },
          { label: m?.buttons?.credentials || 'Credenciales', modal: 'credentials' as ModalType, icon: Key, variant: 'action' }
        ],
        columns: 2
      }
    } as const;
    return base[type];
  }, [type, t]);

  return (
    <Modal onClose={onClose} title={Title} icon={AlertTriangle}>
      <div className="p-4">
        <div className="alert-warn p-3 mb-3 text-xs">
          {t.modals?.missingConfig?.advice || 'Consejo: puedes abrir credenciales desde el icono de la cabecera y el selector desde la tarjeta superior.'}
        </div>
        <p className="text-sm text-neutral-text">{content.message}</p>
        <div className={`grid gap-3 pt-4 ${content.columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {content.buttons.map(btn => {
            const IconComp = btn.icon;
            const className = btn.variant === 'action' ? 'btn-sm-action text-btn' : 'btn-sm-neutral text-btn';
            return (
              <button
                key={btn.label}
                onClick={() => onNavigate?.(btn.modal)}
                className={className}
              >
                <IconComp className={`w-4 h-4 ${btn.variant === 'neutral' ? 'text-primary-300' : ''}`} />
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
