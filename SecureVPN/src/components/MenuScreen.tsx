import { useEffect, useState } from 'react';
import { useVpn } from '../context/VpnContext';
import { useSafeArea } from '../hooks/useSafeArea';
import { callOne, dt } from '../utils/nativeApi';

interface MenuScreenProps {
  onShowToast: (msg: string) => void;
}

type HotspotState = 'RUNNING' | 'STOPPED' | 'UNKNOWN';

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  action?: () => void;
}

export function MenuScreen({ onShowToast }: MenuScreenProps) {
  const { setScreen } = useVpn();
  const [hotspotStatus, setHotspotStatus] = useState<HotspotState>('UNKNOWN');
  const { statusBarHeight, navigationBarHeight } = useSafeArea();
  const sectionStyle = {
    paddingTop: `calc(${statusBarHeight}px + 16px)`,
    paddingBottom: `calc(${navigationBarHeight}px + 24px)`,
  };

  const refreshHotspotStatus = () => {
    const status = dt.call<string>('DtGetStatusHotSpotService');
    if (status === 'RUNNING' || status === 'STOPPED') {
      setHotspotStatus(status);
    } else {
      setHotspotStatus('UNKNOWN');
    }
  };

  useEffect(() => {
    refreshHotspotStatus();
  }, []);

  const toggleHotspot = () => {
    const starting = hotspotStatus !== 'RUNNING';
    const success = starting ? callOne(['DtStartHotSpotService']) : callOne(['DtStopHotSpotService']);
    if (success) {
      onShowToast(starting ? 'Hotspot iniciado' : 'Hotspot detenido');
      setTimeout(refreshHotspotStatus, 400);
    } else {
      onShowToast('No disponible en este dispositivo');
      setHotspotStatus('UNKNOWN');
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'apn',
      title: 'APN',
      subtitle: 'Configuración del punto de acceso',
      action: () => {
        if (!callOne(['DtStartApnActivity', 'DtOpenApn', 'DtApn'])) {
          onShowToast('No disponible en este dispositivo');
        }
      },
    },
    {
      id: 'battery',
      title: 'Batería',
      subtitle: 'Optimizaciones/uso de energía',
      action: () => {
        if (!callOne(['DtIgnoreBatteryOptimizations', 'DtOpenBatteryOptimization', 'DtOpenPower'])) {
          onShowToast('No disponible en este dispositivo');
        }
      },
    },
    {
      id: 'hotspot',
      title: hotspotStatus === 'RUNNING' ? 'Hotspot / Desactivar' : 'Hotspot / Activar',
      subtitle:
        hotspotStatus === 'RUNNING'
          ? 'Hotspot activo'
          : hotspotStatus === 'STOPPED'
            ? 'Hotspot inactivo'
            : 'Estado desconocido',
      action: hotspotStatus === 'UNKNOWN' ? undefined : toggleHotspot,
    },
    {
      id: 'speedtest',
      title: 'Speedtest',
      subtitle: 'Prueba de velocidad',
      action: () => {
        if (callOne(['DtStartWebViewActivity'], 'https://www.speedtest.net/')) return;
        if (callOne(['DtOpenExternalUrl'], 'https://fast.com')) return;
        window.open('https://fast.com', '_blank');
      },
    },
    {
      id: 'terms',
      title: 'Términos',
      subtitle: 'Términos y políticas',
      action: () => setScreen('terms'),
    },
    {
      id: 'clean',
      title: 'Limpieza',
      subtitle: 'Limpiar caché/ajustes',
      action: () => {
        if (callOne(['DtCleanApp'])) {
          onShowToast('Limpieza realizada');
        } else {
          onShowToast('No disponible en este dispositivo');
        }
      },
    },
    {
      id: 'logs',
      title: 'Registros',
      subtitle: 'Ver y copiar logs',
      action: () => setScreen('logs'),
    },
  ];

  return (
    <section className="screen" style={sectionStyle}>
      <div className="section-header">
        <div className="panel-title">Acciones</div>
      </div>

      {menuItems.map((item) => (
        <div
          key={item.id}
          className="list-item"
          onClick={item.action ?? undefined}
        >
          <div className="li-left">
            <strong>{item.title}</strong>
            <small>{item.subtitle}</small>
          </div>
          <div className="li-right">
            <i className="fa fa-chevron-right" />
          </div>
        </div>
      ))}
    </section>
  );
}
