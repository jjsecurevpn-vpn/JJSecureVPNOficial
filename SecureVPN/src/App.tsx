import { useState, useEffect } from 'react';
import { VpnProvider, useVpn } from './context/VpnContext';
import { TopBar } from './components/TopBar';
import { Hero } from './components/Hero';
import { HomeScreen } from './components/HomeScreen';
import { ServersScreen } from './components/ServersScreen';
import { MenuScreen } from './components/MenuScreen';
import { LogsScreen } from './components/LogsScreen';
import { TermsScreen } from './components/TermsScreen';
import { AccountScreen } from './components/AccountScreen';
import { Toast } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { loadAutoMode, saveAutoMode } from './utils/storageUtils';
import './index.css';

function AppContent() {
  const { status, screen, setScreen, termsAccepted } = useVpn();
  const { toast, showToast } = useToast();
  const [autoMode, setAutoMode] = useState(loadAutoMode());

  const handleAutoModeChange = (on: boolean) => {
    setAutoMode(on);
    saveAutoMode(on);
  };

  // Determinar clase de estado
  const stateClass = status === 'CONNECTED' 
    ? 'state-connected' 
    : status === 'CONNECTING' 
      ? 'state-connecting' 
      : 'state-disconnected';

  // Mostrar términos si no aceptados
  useEffect(() => {
    if (!termsAccepted && screen !== 'terms') {
      setScreen('terms');
    }
  }, [termsAccepted, screen, setScreen]);

  // Renderizar pantalla actual
  const renderScreen = () => {
    switch (screen) {
      case 'servers':
        return <ServersScreen onShowToast={showToast} autoMode={autoMode} />;
      case 'menu':
        return <MenuScreen onShowToast={showToast} />;
      case 'logs':
        return <LogsScreen onShowToast={showToast} />;
      case 'terms':
        return <TermsScreen />;
      case 'account':
        return <AccountScreen />;
      default:
        return (
          <HomeScreen 
            onShowToast={showToast} 
            autoMode={autoMode}
            onAutoModeChange={handleAutoModeChange}
          />
        );
    }
  };

  return (
    <div className={`phone ${stateClass}`} id="app">
      <div className="top-strip" />
      
      {screen !== 'terms' && (
        <>
          <TopBar onMenuClick={() => setScreen('menu')} />
          {screen === 'home' && <Hero />}
        </>
      )}

      {renderScreen()}
      
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}

export default function App() {
  return (
    <VpnProvider>
      <AppContent />
    </VpnProvider>
  );
}
