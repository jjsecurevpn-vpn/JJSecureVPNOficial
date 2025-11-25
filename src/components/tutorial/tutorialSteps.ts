import { TutorialStep } from '../../context/TutorialContext';

// Tutorial principal inspirado en Proton VPN
// Reorganizado de arriba hacia abajo, agrupando componentes relacionados
export const appTutorialSteps: TutorialStep[] = [
  // Parte superior: Configuración rápida
  {
    id: 'language-selector',
    target: '[data-tutorial="language-selector"]',
    title: 'Cambiar Idioma',
    description: 'Toca aquí para cambiar rápidamente el idioma de la aplicación (ES / EN / PT).',
    position: 'bottom',
    showArrow: true,
  },
  {
    id: 'user-profile',
    target: '[data-tutorial="user-profile"]',
    title: 'Perfil y Credenciales',
    description: 'Configura tus credenciales de acceso y consulta información de tu cuenta cuando estés conectado.',
    position: 'bottom',
    showArrow: true,
  },
  
  // Sección central principal: Información y conexión
  {
    id: 'welcome',
    target: '[data-tutorial="server-selector"]',
    title: 'Información del Servidor',
    description: 'Aquí se muestra el servidor VPN actual y su configuración. Esta área te informa sobre tu conexión activa.',
    position: 'bottom',
    showArrow: true,
  },
  {
    id: 'connection-button',
    target: '[data-tutorial="connection-button"]',
    title: 'Conectar/Desconectar',
    description: 'El corazón de tu privacidad. Un toque para activar tu escudo digital y proteger tu conexión.',
    position: 'bottom',
    showArrow: true,
  },
  {
    id: 'location-display',
    target: '[data-tutorial="location-display"]',
    title: 'Tu Nueva Identidad',
    description: 'Observa cómo tu ubicación virtual cambia y tu IP real queda protegida del mundo exterior.',
    position: 'bottom',
    showArrow: true,
  },
  
  // Sección de opciones: Servidores y monitoreo
  {
    id: 'servers-menu',
    target: '[data-tutorial="servers-menu"]',
    title: 'Servidores y Protocolos',
    description: 'Elige entre servidores premium de Argentina y opciones gratuitas de otros países. También configura protocolos de conexión.',
    position: 'top',
    showArrow: true,
  },
  {
    id: 'logs-button',
    target: '[data-tutorial="logs-button"]',
    title: 'Centro de Monitoreo',
    description: 'Accede al historial y diagnósticos en tiempo real de tu conexión VPN.',
    position: 'top',
    showArrow: true,
  },
  
  // Parte inferior: Configuración general
  {
    id: 'settings-menu',
    target: '[data-tutorial="settings-menu"]',
    title: 'Opciones y Configuración',
    description: 'Accede a opciones de compra, reventa, ajustes adicionales y otras configuraciones de la aplicación.',
    position: 'top',
    showArrow: true,
  }
];

// Tutorial para nuevos usuarios (experiencia de onboarding)
// Reorganizado de arriba hacia abajo en el mismo orden lógico
export const newUserTutorialSteps: TutorialStep[] = [
  // Sección central principal: Información y conexión
  {
    id: 'server-selection',
    target: '[data-tutorial="server-selector"]',
    title: 'Estado del Servidor',
    description: 'Esta área muestra información sobre tu servidor VPN actual y el estado de tu conexión digital.',
    position: 'bottom',
    showArrow: true,
  },
  {
    id: 'first-connection',
    target: '[data-tutorial="connection-button"]',
    title: 'Tu Primera Conexión',
    description: 'Un simple toque activa tu escudo digital. Tu puerta hacia la libertad en internet.',
    position: 'bottom',
    showArrow: true,
  },
  {
    id: 'you-are-protected',
    target: '[data-tutorial="location-display"]',
    title: '¡Eres Invisible!',
    description: 'Tu identidad real ha desaparecido. Ahora navegas como un fantasma digital, completamente protegido.',
    position: 'bottom',
    showArrow: true,
  },
  // Sección de opciones: Servidores
  {
    id: 'servers-access',
    target: '[data-tutorial="servers-menu"]',
    title: 'Configura tu Conexión',
    description: 'Accede a servidores premium de Argentina y gratuitos internacionales. Configura protocolos según tus necesidades.',
    position: 'bottom',
    showArrow: true,
  }
];

// Tutorial para funciones avanzadas
export const advancedFeaturesTutorial: TutorialStep[] = [
  {
    id: 'location-info',
    target: '[data-tutorial="location-display"]',
    title: 'Información de Ubicación',
    description: 'Aquí puedes ver tu ubicación virtual actual, país de conexión y dirección IP protegida.',
    position: 'top',
    showArrow: true,
  }
];
