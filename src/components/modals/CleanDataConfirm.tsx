import { AlertTriangle, Wifi, Trash2 } from "lucide-react";
import { Modal } from "./Modal";
import { cleanAppData } from "../../utils/appFunctions";
import { useTranslations } from "../../hooks/useTranslations";

interface CleanDataConfirmProps {
  onClose: () => void;
}

export function CleanDataConfirm({ onClose }: CleanDataConfirmProps) {
  const { t } = useTranslations();
  const handleCleanData = () => {
    cleanAppData();
    onClose();
  };

  const m = t.modals?.cleanData;
  const dataItems = [
    m?.items?.connectionConfigs || 'Configuraciones de conexión',
    m?.items?.userCredentials || 'Datos de usuario y credenciales',
    m?.items?.preferences || 'Preferencias de la aplicación',
    m?.items?.history || 'Historial de conexiones'
  ];

  return (
  <Modal onClose={onClose} title={m?.title || 'Limpiar Datos'} icon={Trash2}>
      <div className="flex flex-col h-full">
        {/* Contenido */}
        <div className="flex-1 px-6 py-6 flex flex-col min-h-0">
          {/* Icono advertencia */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-danger" />
            </div>
          </div>

          {/* Título advertencia */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-white mb-2">{m?.attention || '¡Atención!'}</h3>
            <p className="text-neutral-text leading-relaxed">
              {m?.permanent || 'Esta acción eliminará todos los datos de la aplicación de forma permanente.'}
            </p>
          </div>

          {/* Sección información */}
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-lg bg-surface/70 border border-surface-border">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-danger"></div>
                {m?.willRemove || 'Se eliminarán los siguientes datos:'}
              </h4>
              <ul className="space-y-2 text-neutral-text">
                {dataItems.map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Advertencia conexión */}
            <div className="p-4 rounded-lg alert-warn">
              <div className="flex items-center gap-3 mb-2">
                <Wifi className="w-5 h-5 text-warn" />
                <span className="text-warn font-medium">{m?.requirementTitle || 'Requisito importante'}</span>
              </div>
              <p className="text-neutral-text leading-relaxed pl-8">
                {m?.requirementText || 'Es necesario tener una conexión estable a internet para descargar las configuraciones nuevamente después de la limpieza.'}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="px-6 pb-6 pt-4 border-t border-surface-border flex-shrink-0">
          <div className="grid gap-3">
            <button
              onClick={handleCleanData}
              className="btn-danger w-full h-auto py-3 rounded-lg font-semibold"
            >
              <Trash2 size={20} />
              {m?.buttons?.confirm || 'Confirmar - Limpiar Datos'}
            </button>
            <button
              onClick={onClose}
              className="btn-neutral w-full h-auto py-3 rounded-lg"
            >
              {m?.buttons?.cancel || 'Cancelar'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
