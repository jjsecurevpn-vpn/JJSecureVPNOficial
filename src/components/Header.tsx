/**
 * @file Header_optimized.tsx
 * @description Cabecera principal de la aplicación - OPTIMIZADA CON COMPONENTES REUTILIZABLES
 *
 * IMPORTANTE: Este componente está optimizado exclusivamente para:
 * - Dispositivos Android móviles
 * - Interfaces táctiles
 * - Interacciones touch sin hover
 * - Áreas de toque optimizadas para dedos
 * - Estados de conexión VPN claros y visibles
 * - Sistema responsivo con Container
 * - Selector de idiomas multilingüe
 */

import { useUnifiedVpn } from "../hooks/useUnifiedVpn";
import { useIPInfo } from "../hooks/useIPInfo";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { VPNStatusOverlay, Container } from "./ui";
import { 
  getDisplayIP, 
  getProtectionStatus, 
  getTargetIPForGeo,
  HEADER_STYLES 
} from "../utils/headerUtils";
import { TutorialIcon } from "./tutorial/TutorialIcons";
import { AdTicker, AD_TICKER_DEFAULT_HEIGHT } from "./AdTicker";
import { useTutorial } from "../context/TutorialContext";
import { useLanguage } from "../context/LanguageContext";
import { appTutorialSteps } from "./tutorial/tutorialSteps";
import { useSafeArea } from "../utils/deviceUtils";
import { LanguageSelector } from "./LanguageSelector";


export function Header() {
  // Estado de VPN e IPs
  const { state: vpnState, isConnected } = useUnifiedVpn();
  const { displayIP, vpnIP, localIP } = useIPInfo(vpnState);
  
  // Idiomas y traducciones
  const { t } = useLanguage();
  
  // Tutorial
  const { startTutorial } = useTutorial();
  
  // Safe area para respetar barras del sistema
  const { statusBarHeight } = useSafeArea();
  
  // Calcular posición top consistente para ambos elementos
  const topPosition = statusBarHeight + AD_TICKER_DEFAULT_HEIGHT + 6; // altura ticker + margen reducido
  
  // Para geolocalización: solo pasamos IP específica si tenemos una IP de túnel válida
  const targetIPForGeo = getTargetIPForGeo(isConnected, vpnIP);
  const { geoData } = useGeoLocation(vpnState, targetIPForGeo);
  
  // IP a mostrar usando utilidad centralizada con traducciones
  const ipToShow = getDisplayIP(isConnected, vpnIP, geoData?.ip, localIP, displayIP, t);
  
  // Estado de protección usando utilidad centralizada con traducciones
  const protectionStatus = getProtectionStatus(isConnected, t);

  const handleStartTutorial = () => {
    console.log('🎯 [TUTORIAL] Botón de tutorial clickeado');
    console.log('🎯 [TUTORIAL] Steps:', appTutorialSteps);
    try {
      startTutorial(appTutorialSteps);
      console.log('🎯 [TUTORIAL] Tutorial iniciado correctamente');
    } catch (error) {
      console.error('🎯 [TUTORIAL] Error al iniciar tutorial:', error);
    }
  };

  return (
    <>
      {/* Barra de anuncios scrolling */}
      <AdTicker />

      {/* Selector de idiomas - posicionado en la esquina superior izquierda (debajo del ticker) */}
      <LanguageSelector 
        className=""
        style={{
          position: 'fixed',
          top: topPosition,
          left: 16,
          zIndex: 1000,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      {/* Icono del tutorial - alineado con desplazamiento tras ticker */}
      <TutorialIcon 
        onClick={handleStartTutorial}
        style={{
          position: 'fixed',
          top: topPosition,
          right: 16,
          zIndex: 1000,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />

      <Container 
        className={HEADER_STYLES.container}
      >
        {/* Overlay flotante con candado + estado + país/IP */}
        <VPNStatusOverlay
          isConnected={isConnected}
          statusText={protectionStatus.text}
          iconColor={protectionStatus.iconColor}
          ariaLabel={protectionStatus.ariaLabel}
          country={geoData?.country}
          ipAddress={ipToShow}
        />
      </Container>
    </>
  );
}
