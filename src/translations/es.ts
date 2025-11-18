/**
 * @file es.ts
 * @description Traducciones en español para JJSecure VPN
 */

import { Translations } from "./types.ts";

export const es: Translations = {
  tvMode: {
    title: "Modo TV",
    noServerSelected: "Sin servidor seleccionado",
    howItWorksButton: "¿Cómo Funciona?",
    howItWorksTooltip: "Aprende cómo funciona la app",
    steps: {
      credentials: "INGRESAR CREDENCIALES",
      selectServer: "ELEGIR SERVIDOR",
      connection: "CONEXIÓN",
      stepLabel: "PASO",
    },
    emptyCategory: "Selecciona una categoría para ver servidores",
    validation: {
      incomplete: "Configuración incompleta",
      noServer: "No hay ninguna configuración seleccionada",
      missingCredentials: "Faltan credenciales",
      processError: "Error al procesar la conexión",
    },
    connection: {
      statusPrefix: "Estado actual:",
    },
    howItWorksModal: {
      title: "¿Cómo Funciona?",
      introTitle: "¡Es muy fácil usar JJSecure en tu TV!",
      introSubtitle: "Sigue estos simples pasos:",
      steps: {
        install: {
          title: "Instala la app en tu TV",
          desc: "Descarga e instala JJSecure en tu Smart TV desde la tienda de aplicaciones.",
        },
        wifi: {
          title: "Conecta WiFi desde tu móvil",
          desc: "Usa tu móvil con compañía Personal (sin saldo necesario) para compartir internet con tu TV vía WiFi.",
        },
        follow: {
          title: "Sigue los pasos aquí indicados",
          desc: "Completa los 3 pasos: credenciales, elige servidor y conecta. ¡Todo desde tu control remoto!",
        },
        enjoy: {
          title: "¡Disfruta navegando!",
          desc: "Una vez conectado, podrás navegar libremente en tu Smart TV con total privacidad.",
        },
      },
      tipLabel: "Consejo",
      tipText:
        "No necesitas saldo en tu móvil Personal. La conexión funciona aprovechando la configuración especial de la compañía.",
      confirmButton: "¡Entendido, empezar!",
    },
  },
  modals: {
    missingConfig: {
      title: "Configuración incompleta",
      advice:
        "Consejo: puedes abrir credenciales desde el icono de la cabecera y el selector desde la tarjeta superior.",
      messages: {
        missingCredentials:
          "Faltan tus credenciales de acceso (usuario y/o contraseña).",
        missingServer: "No has seleccionado un servidor.",
        missingSetup:
          "Faltan datos para conectar: selecciona un servidor y completa tus credenciales.",
      },
      buttons: {
        configureCredentials: "Configurar credenciales",
        chooseServer: "Elegir servidor",
        server: "Servidor",
        credentials: "Credenciales",
      },
    },
    cleanData: {
      title: "Limpiar Datos",
      attention: "¡Atención!",
      permanent:
        "Esta acción eliminará todos los datos de la aplicación de forma permanente.",
      willRemove: "Se eliminarán los siguientes datos:",
      items: {
        connectionConfigs: "Configuraciones de conexión",
        userCredentials: "Datos de usuario y credenciales",
        preferences: "Preferencias de la aplicación",
        history: "Historial de conexiones",
      },
      requirementTitle: "Requisito importante",
      requirementText:
        "Es necesario tener una conexión estable a internet para descargar las configuraciones nuevamente después de la limpieza.",
      buttons: {
        confirm: "Confirmar - Limpiar Datos",
        cancel: "Cancelar",
      },
    },
  },
  header: {
    protected: "Estoy protegido",
    notProtected: "No protegido",
    connecting: "Conectando...",
    noConnection: "Sin conexión",
    connected: "Conectado",
    disconnected: "Desconectado",
  },
  tutorial: {
    start: "Iniciar tutorial",
  },
  languages: {
    spanish: "Español",
    english: "Inglés",
    portuguese: "Portugués",
  },
  common: {
    close: "Cerrar",
    select: "Seleccionar",
    cancel: "Cancelar",
    back: "Volver",
    continue: "Continuar",
    accept: "Aceptar",
    decline: "Rechazar",
    confirm: "Confirmar",
    loading: "Cargando",
    error: "Error",
    success: "Éxito",
    warning: "Advertencia",
    info: "Información",
  },
  support: {
    title: "Centro de Soporte",
    subtitle: "Estamos aquí para ayudarte en todo momento",
    directContact: "Contacto Directo",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    recommended: "Recomendado",
    immediateResponse: "Respuesta inmediata",
    specializedSupport: "Soporte especializado",
    fastChat: "Chat rápido",
    efficientChat: "Chat eficiente",
    communities: "Comunidades",
    joinCommunities: "Únete a nuestras comunidades",
    whatsappGroup: "Grupo WhatsApp",
    telegramChannel: "Canal Telegram",
    telegramGroup: "Grupo Telegram",
    userCommunity: "Comunidad de usuarios",
    newsUpdates: "Noticias y actualizaciones",
    discussionsHelp: "Discusiones y ayuda",
  },
  welcome: {
    title: "Bienvenido a JJSecure VPN",
    subtitle: "Tu privacidad y seguridad son nuestra prioridad",
    description: "Protege tu conexión y navega de forma segura",
    buy: "Comprar Premium",
    resell: "Planes Revendedor",
    termsAcceptance: "Al continuar, aceptas nuestros",
    termsAndConditions: "Términos y Condiciones",
    certifiedVpn: "VPN Certificado",
    simpleMode: "Modo Simple",
    simpleModeDesc: "Interfaz limpia y fácil de usar",
    advancedMode: "Modo Avanzado",
    advancedModeDesc: "Control total y configuración detallada",
    chooseMode: "Elige cómo quieres usar la app",
    mobileMode: "Modo Móvil",
    mobileModeDesc: "Interfaz vertical optimizada para teléfono",
    tvMode: "Modo SmartTV",
    tvModeDesc: "Interfaz horizontal para TV con botones grandes",
    startMobile: "Iniciar en Modo Móvil",
    openTvMode: "Abrir Modo SmartTV",
    termsText: "Al continuar, aceptas nuestros",
    termsLink: "Términos y Condiciones",
    privacyLink: "Política de Privacidad",
  },
  settings: {
    title: "Configuraciones",
    general: "General",
    support: "Soporte",
    account: "Cuenta",
    about: "Acerca de",
    quickActions: "Acciones Rápidas",
    tools: "Herramientas",
    configurations: "Configuraciones",
    update: "Actualizar Aplicación",
    updateDesc: "Verificar e instalar la última actualización disponible",
    autoConnect: "Conexión Automática",
    autoConnectDesc: "Conectar automáticamente al iniciar",
    hotspot: "Hotspot",
    apn: "Configurar APN",
    apnDesc: "Ajustes de punto de acceso de red",
    battery: "Optimizar Batería",
    batteryDesc: "Configurar optimización de batería",
    credentials: "Credenciales de Acceso",
    credentialsDesc: "Configurar usuario y contraseña",
    cleanData: "Limpiar Datos",
    cleanDataDesc: "Eliminar configuraciones y caché",
    viewPremiumPlans: "Ver Planes Premium",
    resellerProgram: "Programa de Revendedores",
    affiliateProgram: "Programa de Afiliados",
    supportCommunitiesLabel: "Soporte & Comunidades",
    supportCommunitiesDesc: "Soporte 24/7 - Comunidades",
    downloadApp: "Descargar App",
    downloadAppDesc: "Descarga la app oficial desde Google Play",
    termsAndConditions: "Términos y Condiciones",
    privacyPolicy: "Política de Privacidad",
    premiumInfo: {
      title: "Información Premium",
      subtitle:
        "Obtén acceso premium con servidores de alta velocidad y menor latencia.",
      description:
        "Disfruta de ubicaciones exclusivas y soporte prioritario cuando más lo necesitas.",
      features: [
        "Más velocidad en horas pico y mayor estabilidad.",
        "Más ubicaciones y servidores disponibles.",
        "Soporte prioritario por parte de nuestro equipo.",
      ],
      upgradeButton: "Actualizar a Premium",
    },
  },
  hotspot: {
    title: "Compartir VPN",
    sharing: "Compartiendo Conexión VPN",
    notSharing: "Hotspot Desactivado",
    sharingDescription: "Otros dispositivos pueden conectarse y usar tu VPN",
    notSharingDescription:
      "Activa el hotspot para compartir tu conexión VPN segura",
    start: "Iniciar Hotspot",
    stop: "Detener Hotspot",
    processing: "Procesando...",
    activeConnectionTitle: "✅ Conexión VPN Compartida Activa",
    activeConnectionDescription:
      "Los dispositivos conectados a tu hotspot están protegidos por la VPN",
    howToConfigure: "📋 Guía Paso a Paso",
    whatYouWillAchieve: "🎯 ¿Qué conseguirás?",
    whatYouWillAchieveDesc:
      "Convertir tu dispositivo en un punto de acceso WiFi que comparte tu conexión VPN segura con otros dispositivos (móviles, tablets, laptops, etc.)",
    proxyGuide: {
      title: "📌 Cómo compartir internet mediante VPN con Proxy",
      steps: [
        "1️⃣ Abre la app VPN en tu celular y activa la opción Hotspot interno (de la app).",
        "2️⃣ Al activarlo, en la barra de notificaciones te aparecerán los datos del Proxy y Puerto → anótalos porque los vas a necesitar.",
        "3️⃣ Ahora activa el Hotspot normal de Android (zona Wi-Fi portátil) y ponle una clave.",
        "4️⃣ En el celular receptor (el que recibirá internet):\n• Conéctate a la red Wi-Fi que acabas de crear.\n• En la configuración avanzada de la red, coloca el Proxy y Puerto que anotaste antes.",
        "5️⃣ Guarda los cambios y conéctate.",
      ],
      finalMessage:
        "✅ ¡Listo! Ya puedes disfrutar de internet compartido a través de la VPN con Proxy.",
    },
    importantTips: {
      title: "💡 Consejos Importantes",
      battery:
        "Batería: El hotspot consume más batería, mantén tu dispositivo cargado",
      speed:
        "Velocidad: La velocidad se compartirá entre todos los dispositivos conectados",
      security:
        "Seguridad: Todos los dispositivos conectados estarán protegidos por tu VPN automáticamente",
    },
    footerTip:
      "💡 Tip: Asegúrate de estar conectado a la VPN antes de iniciar el hotspot",
    // Mantener compatibilidad con versiones anteriores
    tip: "Tip:",
    tipDescription: 'Para navegar sin VPN, cambia el proxy a "Automático"',
  },
  autoConnect: {
    title: "Auto Conexión",
    settingsTitle: "Configuración",
    searchTitle: "Búsqueda",
    subtitle: "Encuentra la mejor configuración automáticamente",
    description:
      "Prueba todas las configuraciones hasta encontrar una que funcione",
    startTest: "Iniciar Prueba",
    stopTest: "Detener Prueba",
    clearResults: "Limpiar Resultados",
    settings: "Configuración",
    backToMain: "Volver al Principal",
    mainScreen: {
      subtitle: "Encuentra automáticamente la mejor configuración disponible",
      description:
        "JJSecure probará automáticamente todas las configuraciones disponibles para encontrar la que funcione mejor en tu ubicación.",
      lastSuccessful: "Última conexión exitosa:",
      noSuccessful: "No hay conexiones exitosas previas",
      startButton: "Iniciar Búsqueda Automática",
      settingsButton: "Configurar Filtros",
    },
    status: {
      idle: "Listo para comenzar",
      running: "Probando configuraciones...",
      success: "Configuración encontrada",
      failed: "Ninguna configuración funcionó",
      cancelled: "Prueba cancelada",
      testing: "Probando",
      error: "Error",
      timeout: "Tiempo agotado",
    },
    progress: {
      testing: "Probando",
      of: "de",
      configurations: "configuraciones",
      current: "Actual:",
      success: "Éxito:",
      failed: "Fallidas:",
      status: "Estado de la Búsqueda",
      completed: "Búsqueda completada",
      cancelled: "Búsqueda cancelada",
      error: "Error en la búsqueda",
      currentTest: "Probando:",
      tested: "Probadas",
      successful: "Exitosas:",
      detailedLogs: "Logs Detallados",
      showLogs: "Mostrar Logs",
      hideLogs: "Ocultar Logs",
      startButton: "Iniciar",
      stopButton: "Detener",
      backButton: "Volver",
      showDetails: "Ver Detalles",
      noTests: "No hay pruebas ejecutadas",
      testResults: "Resultados de Pruebas",
    },
    settingsScreen: {
      title: "Configuración de Auto Conexión",
      filters: "Filtros de Búsqueda",
      categories: "Categorías a Incluir",
      selectCategories: "Seleccionar categorías",
      allCategories: "Todas las categorías",
      advanced: "Configuración Avanzada",
      timeout: "Tiempo límite por configuración",
      timeoutSeconds: "segundos",
      seconds: "segundos",
      maxRetries: "Máximo de reintentos",
      retries: "reintentos",
      retryAttempts: "intentos",
      testOrder: "Orden de prueba",
      sequential: "Secuencial",
      random: "Aleatorio",
      parallel: "Pruebas paralelas",
      enableParallel: "Habilitar pruebas paralelas",
      parallelDesc:
        "Probar múltiples configuraciones simultáneamente (más rápido)",
      maxParallel: "Máximo de pruebas paralelas",
      tests: "pruebas",
      enableLogs: "Habilitar registros detallados",
      autoStop: "Detener automáticamente al encontrar",
      saveSettings: "Guardar Configuración",
    },
    logs: {
      title: "Registro de Pruebas",
      clear: "Limpiar",
      empty: "No hay registros disponibles",
      testing: "Probando configuración:",
      success: "Configuración exitosa:",
      failed: "Configuración falló:",
      timeout: "Tiempo agotado para:",
      cancelled: "Prueba cancelada",
      completed: "Prueba completada",
      connecting: "Estableciendo conexión...",
      verifying: "Verificando conectividad...",
      connectionTimeout: "Tiempo de conexión agotado",
      internetTestFailed: "Prueba de internet fallida",
      connectionError: "Error de conexión",
      noCategory: "Sin categoría",
    },
    messages: {
      confirmClose: "¿Estás seguro que deseas cerrar? La búsqueda se detendrá.",
      searchCompleted: "Búsqueda automática completada",
      configurationFound: "Configuración encontrada:",
      noConfigurationFound: "No se encontró una configuración válida",
      searchCancelled: "Búsqueda cancelada por el usuario",
    },
  },
  terms: {
    title: "Términos y Condiciones",
    alreadyAccepted: "Términos ya aceptados",
    alreadyAcceptedDesc:
      "Ya has aceptado nuestros términos y condiciones anteriormente.",
    readToEnd: "Información importante",
    readToEndDesc:
      "Lee hasta el final para aceptar los términos y continuar usando la aplicación.",
    welcome: {
      title: "Bienvenido a JJSecure VPN",
      subtitle:
        "Al usar nuestra aplicación, aceptas los siguientes términos y condiciones",
    },
    buttons: {
      accepted: "Términos aceptados - Continuar",
      accept: "Acepto los Términos y Condiciones",
      readToEndFirst: "Lee hasta el final para continuar",
    },
    sections: {
      acceptance: {
        title: "Aceptación de Términos",
        content:
          "Al acceder y utilizar JJSecure VPN, confirmas que has leído, entendido y aceptas estos términos. Si no estás de acuerdo, no debes usar el servicio.",
      },
      service: {
        title: "Descripción del Servicio",
        intro: "JJSecure VPN es un servicio de proxy/VPN que te permite:",
        features: [
          "Navegar de forma más privada y segura",
          "Acceder a contenido con restricciones geográficas",
          "Proteger tu conexión en redes WiFi públicas",
        ],
      },
      usage: {
        title: "Uso Responsable",
        commitmentLabel: "Compromiso del usuario:",
        commitment:
          "Te comprometes a usar el servicio de manera responsable y legal.",
        prohibited: "Está prohibido usar el servicio para:",
        prohibitedItems: [
          "Actividades ilegales o maliciosas",
          "Spam, phishing o distribución de malware",
          "Ataques contra otros servicios o usuarios",
        ],
      },
      limitations: {
        title: "Limitaciones del Servicio",
        intro:
          'El servicio se proporciona "tal como es", con las siguientes consideraciones:',
        items: [
          "Puede haber interrupciones ocasionales por mantenimiento",
          "La velocidad puede variar según la congestión de la red",
          "Nos reservamos el derecho de limitar conexiones simultáneas",
        ],
      },
      responsibility: {
        title: "Responsabilidad y Garantías",
        limitationLabel: "Limitación de responsabilidad:",
        limitation:
          "JJSecure VPN no se hace responsable de daños directos o indirectos derivados del uso del servicio.",
        userResponsibility:
          "El usuario es el único responsable de sus actividades mientras usa el servicio.",
      },
      refund: {
        title: "Reembolso e Compra de Logins",
        policyLabel: "Política de reembolso:",
        policy:
          "En caso de que un usuario compre un login para acceder al servicio, tendrá derecho al reembolso solamente si se comprueba que el problema está relacionado con nuestros servidores y no con bloqueos de las operadoras.",
        process:
          "Para solicitar el reembolso, el usuario debe proporcionar pruebas del problema y aguardar el análisis de nuestro equipo técnico.",
        freezingTitle: "Congelamiento de planes",
        freezingDesc:
          "En casos de bloqueos por parte de las operadoras telefónicas, los planes se congelarán automáticamente hasta que se encuentre un nuevo método funcional. Una vez solucionado el bloqueo, se reintegrarán todos los días que restaban en su plan.",
        importantLabel: "Importante:",
        important:
          "No se realizarán reembolsos por problemas relacionados con bloqueos de operadoras telefónicas o problemas de conectividad del usuario, pero los días pagados se preservarán mediante el sistema de congelamiento.",
      },
      modifications: {
        title: "Modificaciones",
        content:
          "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación.",
      },
      contact: {
        title: "Contacto y Soporte",
        content: "Para consultas o soporte, contáctanos por Telegram",
        supportLink: "@SoporteJHS_bot",
      },
    },
    footer: {
      lastUpdate: "Última actualización:",
      company: "JJSECURE VPN",
    },
  },
  privacy: {
    title: "Política de Privacidad",
    alreadyAccepted: "Política ya aceptada",
    alreadyAcceptedDesc:
      "Ya has aceptado nuestra política de privacidad anteriormente.",
    readToEnd: "Información importante",
    readToEndDesc:
      "Lee hasta el final para aceptar la política y continuar usando la aplicación.",
    intro: {
      title: "Tu privacidad es importante",
      subtitle:
        "Esta política explica cómo recopilamos, usamos y protegemos tu información al utilizar JJSecure VPN",
    },
    buttons: {
      accepted: "Política ya aceptada - Continuar",
      accept: "Acepto la Política de Privacidad",
      readToEndFirst: "Lee hasta el final para continuar",
    },
    sections: {
      collection: {
        title: "Información que Recopilamos",
        intro:
          "Para el funcionamiento del servicio, recopilamos mínima información:",
        items: [
          "Device ID (removido automáticamente cada 24 horas)",
          "Información básica de conexión para control de límites",
          "Datos técnicos necesarios para el funcionamiento del proxy",
        ],
      },
      usage: {
        title: "Uso de la Información",
        intro: "La información recopilada se utiliza exclusivamente para:",
        items: [
          "Controlar límites de conexiones simultáneas",
          "Mantener la estabilidad del servicio",
          "Proveer soporte técnico cuando sea necesario",
        ],
      },
      protection: {
        title: "Protección de Datos",
        commitmentLabel: "Compromiso de seguridad:",
        commitment:
          "No almacenamos historial de navegación, contenido de comunicaciones ni datos personales identificables.",
        autoDelete:
          "Los datos temporales (como Device ID) se eliminan automáticamente de nuestros servidores cada 24 horas.",
      },
      sharing: {
        title: "Compartir Información",
        policyLabel: "Política estricta:",
        policy:
          "No vendemos, alquilamos ni compartimos tu información personal con terceros.",
        legalRequirement:
          "Solo podríamos divulgar información si fuera requerido por ley y con orden judicial válida.",
      },
      rights: {
        title: "Tus Derechos",
        intro: "Como usuario, tienes derecho a:",
        items: [
          "Solicitar información sobre los datos que almacenamos",
          "Pedir la eliminación de tus datos",
          "Dejar de usar el servicio en cualquier momento",
        ],
      },
      contact: {
        title: "Contacto",
        content: "Para consultas sobre privacidad, contáctanos por Telegram",
        supportLink: "@SoporteJHS_bot",
      },
    },
    footer: {
      lastUpdate: "Última actualización:",
      company: "JJSECURE VPN",
    },
  },
  bottomSheetServerSelector: {
    serverInfo: {
      selectServer: "SELECCIONAR SERVIDOR",
      selectServerDesc: "Toca para elegir una configuración",
      freeServersTooltip: "Ver servidores gratuitos disponibles",
    },
    connectionButtons: {
      vpnStates: {
        connected: "DESCONECTAR",
        connecting: "CANCELAR",
        stopping: "DETENIENDO",
        auth: "CANCELAR",
        noNetwork: "REINTENTAR",
        authFailed: "REINTENTAR",
        disconnected: "CONECTAR",
      },
      logsButton: "LOGS",
      logsTooltip: "Ver logs de conexión",
    },
    premiumFeatures: {
      title: "Características Premium",
      upgradeButton: "Actualizar a Premium",
      features: {
        globalCoverage: {
          title: "Cobertura global",
          description: "Más de 14900 ubicaciones de servidores en 122 países",
        },
        fasterBrowsing: {
          title: "Navegación más rápida",
          description: "Navegue a velocidades aún mayores (hasta 10 Gbps)",
        },
        advancedSecurity: {
          title: "Seguridad Avanzada",
          description: "Cifrado AES-256 y kill switch",
        },
      },
    },
  },
  freeServersInfoModal: {
    title: "Servidores Gratuitos",
    subtitle:
      "Todos nuestros servidores gratuitos pasan por canales oficiales seguros",
    stats: {
      freeServers: "Servidores Gratuitos",
      premiumServers: "Servidores Premium",
    },
    availableConnections: "Conexiones Gratuitas Disponibles",
    selectFreeServer: "Selecciona un servidor gratuito:",
    serverDescription: "Canal oficial • Conexión estable",
    moreServersAvailable: "+{count} servidores más disponibles",
    upgradeTitle: "¿Quieres más velocidad?",
    upgradeMessage: "Upgrade a Premium para {count} servidores exclusivos",
    upgradeButton: "Actualizar a Premium",
    closeButton: "Cerrar",
    loadError: "Error cargando servidores:",
  },
  footer: {
    tabs: {
      home: "INICIO",
      servers: "SERVIDORES",
      logs: "LOGS",
      profile: "PERFIL",
      settings: "AJUSTES",
    },
  },
  userProfileScreen: {
    header: {
      myAccount: "Mi Cuenta",
      configuration: "Configuración",
      connected: "Conectado",
      configureCredentials: "Configurar credenciales",
    },
    disconnectedContent: {
      configureAccess: "Configurar Acceso",
      configureAccessDesc: "Ingresa tus credenciales para conectarte",
      secureConnection: "Conexión segura",
      secureConnectionDesc:
        "Tus credenciales se almacenan de forma segura en tu dispositivo y solo se usan para la autenticación VPN.",
    },
    accountPanel: {
      days: "días",
      active: "Activa",
      expired: "Vencida",
      aboutToExpire: "Por vencer",
      expiresOn: "Vence",
      expiredLabel: "expirada",
      inDays: "en {count} día{plural}",
      connections: "Conexiones",
      activeConnections: "Activas",
      limit: "Límite",
      renewWarningTitle: "Tu cuenta está por vencer",
      renewWarningDesc:
        "Renueva ahora para mantener tu acceso sin interrupciones.",
      renewSubscription: "Renovar suscripción",
      contactSupport: "Contactar soporte",
    },
    sessionStats: {
      session: "Sesión",
      ping: "Ping",
      download: "Descarga",
      upload: "Subida",
      downloadSpeed: "Vel. Bajada",
      uploadSpeed: "Vel. Subida",
      network: "Red",
      localIP: "IP local",
    },
    deviceInfo: {
      device: "Dispositivo",
      deviceId: "ID",
      version: "Versión",
      copyIdLabel: "Copiar ID",
    },
    recentConfigs: {
      recent: "Recientes",
      config: "Config",
    },
    errors: {
      serverError: "Error del servidor",
      userNotFound: "Usuario no encontrado en este servidor",
      processingError: "Error al procesar datos del usuario",
      dtunnelNotAvailable: "Función DTunnel no disponible",
      timeout: "Timeout: No se recibió respuesta del servidor",
      queryError: "Error al ejecutar consulta de usuario",
    },
  },
  credentialsPanel: {
    header: {
      hysteria: "Protocolo HYSTERIA",
      v2ray: "Protocolo V2Ray",
      ssh: "Autenticación SSH",
    },
    headerDesc: {
      hysteria: "Combina usuario y contraseña automáticamente",
      ssh: "Configura las credenciales de acceso",
    },
    hysteriaTitle: "Credenciales HYSTERIA",
    usernameLabel: "Nombre de Usuario",
    passwordLabel: "Contraseña",
    usernamePlaceholder: "Ingresa tu nombre de usuario",
    passwordPlaceholder: "Ingresa tu contraseña",
    uuidLabel: "UUID V2Ray",
    uuidPlaceholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    connecting: "Conectando al servidor...",
    errors: {
      userRequired: "El usuario es requerido",
      passwordRequired: "La contraseña es requerida",
      uuidRequired: "El UUID es requerido",
      uuidInvalid: "Formato de UUID inválido",
    },
    buttons: {
      saving: "Guardando...",
      save: "Guardar Credenciales",
    },
    secureInfo: {
      title: "Credenciales seguras:",
      desc: "Se almacenan localmente en tu dispositivo",
      connectNote:
        "Para conectarte, usa el botón CONECTAR en la pantalla principal",
    },
    statusMessages: {
      autoSaving: "Guardando...",
      saved: "Guardado",
      pending: "Pendiente",
    },
    preconfigured: {
      title: "Conexión directa",
      description:
        "Este servidor está configurado para conexión directa. Podría fallar si no está habilitado o disponible. Si no conecta, prueba otro servidor.",
      actionLabel: "Ir a Conectar",
      readyBadge: "Listo",
      changeServerLabel: "Cambiar servidor",
    },
  },

  serverSelectorScreen: {
    header: {
      selectServer: "Seleccionar Servidor",
      categories: "Categorías",
      backToCategories: "Volver a Categorías",
      nativeMode: "NATIVO",
      customMode: "CUSTOM",
    },
    searchBar: {
      placeholder: "Buscar servidores...",
      clearSearch: "Limpiar búsqueda",
    },
    categoryView: {
      activeConfig: "Configuración activa",
      serverCount: "{count} servidor{plural}",
      selectCategory: "Seleccionar categoría",
    },
    serverView: {
      serversList: "Lista de Servidores",
      noServersFound: "No se encontraron servidores",
      retrySearch: "Intentar de nuevo",
      configuring: "Configurando...",
      connecting: "Conectando...",
    },
    loadingView: {
      loadingServers: "Cargando servidores...",
      updating: "Actualizando...",
      noServersAvailable: "No hay servidores disponibles",
      updateConfigs: "Actualizar configuraciones",
    },
    errorView: {
      loadError: "Error al cargar",
      connectionFailed: "Falló la conexión",
      retry: "Reintentar",
      useNativeSelector: "Usar selector nativo",
      errorDetails: "Detalles del error",
    },
    serverCard: {
      premium: "Premium",
      free: "Gratis",
      recommended: "Recomendado",
      connecting: "Conectando",
      connected: "Conectado",
      select: "Seleccionar",
      ping: "Ping",
      load: "Carga",
      unavailable: "No disponible",
    },
    filters: {
      allServers: "Todos los servidores",
      freeServers: "Servidores gratuitos",
      premiumServers: "Servidores premium",
      recommendedServers: "Servidores recomendados",
    },
    actions: {
      refresh: "Actualizar",
      settings: "Configuración",
      help: "Ayuda",
      close: "Cerrar",
    },
    countries: {
      MX: "México",
      PE: "Perú",
      ES: "España",
      NL: "Países Bajos",
      CA: "Canadá",
      JP: "Japón",
      US: "Estados Unidos",
      GB: "Reino Unido",
      FR: "Francia",
      DE: "Alemania",
      BR: "Brasil",
      AR: "Argentina",
    },
    subcategories: {
      premiumSsh: {
        title: "🏆 PRINCIPAL",
        description: "Configuración recomendada • Internet ilimitado",
      },
      premiumCm: {
        title: "CONGELA MEGAS",
        description: "Usar con precaución",
      },
      udpHysteria: {
        title: "UDP HYSTERIA",
        description: "Protocolo UDP optimizado",
      },
      premiumVpn: {
        title: "PREMIUM VPN",
        description: "Camuflaje de IP con datos",
      },
      premiumDns: {
        title: "PREMIUM DNS",
        description: "Sin Anuncios",
      },
      premiumGames: {
        title: "PREMIUM GAMES",
        description: "Soporte para Juegos",
      },
      others: {
        title: "Otros",
      },
    },
    categoryTypes: {
      premium: "PREMIUM",
      free: "GRATUITO",
      emergency: "EMERGENCIAS",
    },
  },
};
