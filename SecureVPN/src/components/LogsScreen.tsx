import { useEffect } from 'react';
import { useVpn } from '../context/VpnContext';
import { Button } from './ui/Button';
import { useLogs } from '../hooks/useLogs';
import { useSafeArea } from '../hooks/useSafeArea';
import { callOne } from '../utils/nativeApi';

interface LogsScreenProps {
  onShowToast: (msg: string) => void;
}

export function LogsScreen({ onShowToast }: LogsScreenProps) {
  const { setScreen } = useVpn();
  const { logs, refresh } = useLogs();
  const { statusBarHeight, navigationBarHeight } = useSafeArea();
  const sectionStyle = {
    paddingTop: `calc(${statusBarHeight}px + 16px)`,
    paddingBottom: `calc(${navigationBarHeight}px + 24px)`,
  };

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(logs);
      onShowToast('Logs copiados');
    } catch {
      onShowToast('No fue posible copiar');
    }
  };

  const handleClear = () => {
    if (callOne(['DtClearLogs'])) {
      onShowToast('Logs limpiados');
      refresh();
    }
  };

  return (
    <section className="screen" style={sectionStyle}>
      <div className="row row-between section-header">
        <div className="panel-title">Registros</div>
        <div className="row">
          <Button onClick={handleCopy}>Copiar</Button>
          <Button onClick={handleClear}>Limpiar</Button>
          <Button onClick={() => setScreen('home')}>Cerrar</Button>
        </div>
      </div>

      <div className="log-box" style={{ whiteSpace: 'pre-wrap' }}>
        {logs}
      </div>
    </section>
  );
}
