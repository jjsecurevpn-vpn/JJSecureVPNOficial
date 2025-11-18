/**
 * @file types.ts
 * @description Tipos TypeScript para el sistema de traducciones
 */

export interface Translations {
  /**
   * NUEVO: Sección específica para el modo TV y su UI simplificada
   */
  tvMode?: {
    title: string;
    noServerSelected: string;
    howItWorksButton: string;
    howItWorksTooltip: string;
    steps: {
      credentials: string;
      selectServer: string;
      connection: string;
      stepLabel: string; // Prefijo "PASO"
    };
    emptyCategory: string;
    validation: {
      incomplete: string;
      noServer: string;
      missingCredentials: string;
      processError: string;
    };
    connection: {
      statusPrefix: string; // Ej: "Estado actual:"
    };
    howItWorksModal: {
      title: string;
      introTitle: string;
      introSubtitle: string;
      steps: {
        install: { title: string; desc: string };
        wifi: { title: string; desc: string };
        follow: { title: string; desc: string };
        enjoy: { title: string; desc: string };
      };
      tipLabel: string;
      tipText: string;
      confirmButton: string;
    };
  };

  /**
   * NUEVO: Modales genéricos y específicos
   */
  modals?: {
    missingConfig?: {
      title: string;
      advice: string;
      messages: {
        missingCredentials: string;
        missingServer: string;
        missingSetup: string;
      };
      buttons: {
        configureCredentials: string;
        chooseServer: string;
        server: string;
        credentials: string;
      };
    };
    cleanData?: {
      title: string;
      attention: string;
      permanent: string;
      willRemove: string;
      items: {
        connectionConfigs: string;
        userCredentials: string;
        preferences: string;
        history: string;
      };
      requirementTitle: string;
      requirementText: string;
      buttons: {
        confirm: string;
        cancel: string;
      };
    };
  };
  header: {
    protected: string;
    notProtected: string;
    connecting: string;
    noConnection: string;
    connected: string;
    disconnected: string;
  };
  tutorial: {
    start: string;
  };
  languages: {
    spanish: string;
    english: string;
    portuguese: string;
  };
  common: {
    close: string;
    select: string;
    cancel: string;
    back: string;
    continue: string;
    accept: string;
    decline: string;
    confirm: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  support: {
    title: string;
    subtitle: string;
    directContact: string;
    whatsapp: string;
    telegram: string;
    recommended: string;
    immediateResponse: string;
    specializedSupport: string;
    fastChat: string;
    efficientChat: string;
    communities: string;
    joinCommunities: string;
    whatsappGroup: string;
    telegramChannel: string;
    telegramGroup: string;
    userCommunity: string;
    newsUpdates: string;
    discussionsHelp: string;
  };
  welcome: {
    title: string;
    subtitle: string;
    description: string;
    buy: string;
    resell: string;
    termsAcceptance: string;
    termsAndConditions: string;
    certifiedVpn: string;
    simpleMode: string;
    simpleModeDesc: string;
    advancedMode: string;
    advancedModeDesc: string;
    // Selección de modo de dispositivo
    chooseMode?: string;
    mobileMode?: string;
    mobileModeDesc?: string;
    tvMode?: string;
    tvModeDesc?: string;
    startMobile?: string;
    openTvMode?: string;
    termsText: string;
    termsLink: string;
    privacyLink: string;
  };
  settings: {
    title: string;
    general: string;
    support: string;
    account: string;
    about: string;
    quickActions: string;
    tools: string;
    configurations: string;
    update: string;
    updateDesc: string;
    autoConnect: string;
    autoConnectDesc: string;
    battery: string;
    batteryDesc: string;
    hotspot: string;
    apn: string;
    apnDesc: string;
    credentials: string;
    credentialsDesc: string;
    cleanData: string;
    cleanDataDesc: string;
    viewPremiumPlans: string;
    resellerProgram: string;
    affiliateProgram: string; // Nuevo: Programa de afiliados
    supportCommunitiesLabel?: string; // Nuevo: etiqueta específica para el botón Soporte & Comunidades
    supportCommunitiesDesc?: string; // Nuevo: descripción Soporte 24/7 - Comunidades
    downloadApp: string;
    downloadAppDesc: string;
    termsAndConditions: string;
    privacyPolicy: string;
    premiumInfo: {
      title: string;
      subtitle: string;
      description: string;
      features: string[];
      upgradeButton: string;
    };
  };
  hotspot: {
    title: string;
    sharing: string;
    notSharing: string;
    sharingDescription: string;
    notSharingDescription: string;
    start: string;
    stop: string;
    processing: string;
    activeConnectionTitle: string;
    activeConnectionDescription: string;
    howToConfigure: string;
    whatYouWillAchieve: string;
    whatYouWillAchieveDesc: string;
    // Nueva guía simplificada con proxy
    proxyGuide: {
      title: string;
      steps: string[]; // Lista de pasos con emoji/número incluido
      finalMessage: string;
    };
    importantTips: {
      title: string;
      battery: string;
      speed: string;
      security: string;
    };
    footerTip: string;
    tip: string;
    tipDescription: string;
  };
  autoConnect: {
    title: string;
    settingsTitle: string;
    searchTitle: string;
    subtitle: string;
    description: string;
    startTest: string;
    stopTest: string;
    clearResults: string;
    settings: string;
    backToMain: string;
    mainScreen: {
      subtitle: string;
      description: string;
      lastSuccessful: string;
      noSuccessful: string;
      startButton: string;
      settingsButton: string;
    };
    status: {
      idle: string;
      running: string;
      success: string;
      failed: string;
      cancelled: string;
      testing: string;
      error: string;
      timeout: string;
    };
    progress: {
      testing: string;
      of: string;
      configurations: string;
      current: string;
      success: string;
      failed: string;
      status: string;
      completed: string;
      cancelled: string;
      error: string;
      currentTest: string;
      tested: string;
      successful: string;
      detailedLogs: string;
      showLogs: string;
      hideLogs: string;
      startButton: string;
      stopButton: string;
      backButton: string;
      showDetails: string;
      noTests: string;
      testResults: string;
    };
    settingsScreen: {
      title: string;
      filters: string;
      categories: string;
      selectCategories: string;
      allCategories: string;
      advanced: string;
      timeout: string;
      timeoutSeconds: string;
      seconds: string;
      maxRetries: string;
      retries: string;
      retryAttempts: string;
      testOrder: string;
      sequential: string;
      random: string;
      parallel: string;
      enableParallel: string;
      parallelDesc: string;
      maxParallel: string;
      tests: string;
      enableLogs: string;
      autoStop: string;
      saveSettings: string;
    };
    logs: {
      title: string;
      clear: string;
      empty: string;
      testing: string;
      success: string;
      failed: string;
      timeout: string;
      cancelled: string;
      completed: string;
      connecting: string;
      verifying: string;
      connectionTimeout: string;
      internetTestFailed: string;
      connectionError: string;
      noCategory: string;
    };
    messages: {
      confirmClose: string;
      searchCompleted: string;
      configurationFound: string;
      noConfigurationFound: string;
      searchCancelled: string;
    };
  };
  terms: {
    title: string;
    alreadyAccepted: string;
    alreadyAcceptedDesc: string;
    readToEnd: string;
    readToEndDesc: string;
    welcome: {
      title: string;
      subtitle: string;
    };
    buttons: {
      accepted: string;
      accept: string;
      readToEndFirst: string;
    };
    sections: {
      acceptance: {
        title: string;
        content: string;
      };
      service: {
        title: string;
        intro: string;
        features: string[];
      };
      usage: {
        title: string;
        commitment: string;
        commitmentLabel: string;
        prohibited: string;
        prohibitedItems: string[];
      };
      limitations: {
        title: string;
        intro: string;
        items: string[];
      };
      responsibility: {
        title: string;
        limitationLabel: string;
        limitation: string;
        userResponsibility: string;
      };
      refund: {
        title: string;
        policyLabel: string;
        policy: string;
        process: string;
        freezingTitle: string;
        freezingDesc: string;
        importantLabel: string;
        important: string;
      };
      modifications: {
        title: string;
        content: string;
      };
      contact: {
        title: string;
        content: string;
        supportLink: string;
      };
    };
    footer: {
      lastUpdate: string;
      company: string;
    };
  };
  privacy: {
    title: string;
    alreadyAccepted: string;
    alreadyAcceptedDesc: string;
    readToEnd: string;
    readToEndDesc: string;
    intro: {
      title: string;
      subtitle: string;
    };
    buttons: {
      accepted: string;
      accept: string;
      readToEndFirst: string;
    };
    sections: {
      collection: {
        title: string;
        intro: string;
        items: string[];
      };
      usage: {
        title: string;
        intro: string;
        items: string[];
      };
      protection: {
        title: string;
        commitmentLabel: string;
        commitment: string;
        autoDelete: string;
      };
      sharing: {
        title: string;
        policyLabel: string;
        policy: string;
        legalRequirement: string;
      };
      rights: {
        title: string;
        intro: string;
        items: string[];
      };
      contact: {
        title: string;
        content: string;
        supportLink: string;
      };
    };
    footer: {
      lastUpdate: string;
      company: string;
    };
  };
  bottomSheetServerSelector: {
    serverInfo: {
      selectServer: string;
      selectServerDesc: string;
      freeServersTooltip: string;
    };
    connectionButtons: {
      vpnStates: {
        connected: string;
        connecting: string;
        stopping: string;
        auth: string;
        noNetwork: string;
        authFailed: string;
        disconnected: string;
      };
      logsButton: string;
      logsTooltip: string;
    };
    premiumFeatures: {
      title: string;
      upgradeButton: string;
      features: {
        globalCoverage: {
          title: string;
          description: string;
        };
        fasterBrowsing: {
          title: string;
          description: string;
        };
        advancedSecurity: {
          title: string;
          description: string;
        };
      };
    };
  };
  freeServersInfoModal: {
    title: string;
    subtitle: string;
    stats: {
      freeServers: string;
      premiumServers: string;
    };
    availableConnections: string;
    selectFreeServer: string;
    serverDescription: string;
    moreServersAvailable: string;
    upgradeTitle: string;
    upgradeMessage: string;
    upgradeButton: string;
    closeButton: string;
    loadError: string;
  };
  footer: {
    tabs: {
      home: string;
      servers: string;
      logs: string;
      profile: string;
      settings: string;
    };
  };
  userProfileScreen: {
    header: {
      myAccount: string;
      configuration: string;
      connected: string;
      configureCredentials: string;
    };
    disconnectedContent: {
      configureAccess: string;
      configureAccessDesc: string;
      secureConnection: string;
      secureConnectionDesc: string;
    };
    accountPanel: {
      days: string;
      active: string;
      expired: string;
      aboutToExpire: string;
      expiresOn: string;
      expiredLabel: string;
      inDays: string;
      connections: string;
      activeConnections: string;
      limit: string;
      renewWarningTitle: string;
      renewWarningDesc: string;
      renewSubscription: string;
      contactSupport: string;
    };
    sessionStats: {
      session: string;
      ping: string;
      download: string;
      upload: string;
      downloadSpeed: string;
      uploadSpeed: string;
      network: string;
      localIP: string;
    };
    deviceInfo: {
      device: string;
      deviceId: string;
      version: string;
      copyIdLabel: string;
    };
    recentConfigs: {
      recent: string;
      config: string;
    };
    errors: {
      serverError: string;
      userNotFound: string;
      processingError: string;
      dtunnelNotAvailable: string;
      timeout: string;
      queryError: string;
    };
  };
  credentialsPanel: {
    header: {
      hysteria: string;
      v2ray: string;
      ssh: string;
    };
    headerDesc: {
      hysteria: string;
      ssh: string;
    };
    hysteriaTitle: string;
    usernameLabel: string;
    passwordLabel: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    uuidLabel: string;
    uuidPlaceholder: string;
    connecting: string; // estado mientras se guardan/validan credenciales o se conecta
    errors: {
      userRequired: string;
      passwordRequired: string;
      uuidRequired: string;
      uuidInvalid: string;
    };
    buttons: {
      saving: string;
      save: string;
    };
    secureInfo: {
      title: string;
      desc: string;
      connectNote: string;
    };
    /** Estados informativos para guardado automático (opcionales). */
    statusMessages?: {
      autoSaving: string; // "Guardando..."
      saved: string; // "Guardado"
      pending: string; // "Pendiente"
    };
    /**
     * Panel alternativo cuando todas las credenciales vienen embebidas en el servidor seleccionado.
     * Opcional para mantener compatibilidad con traducciones antiguas.
     */
    preconfigured?: {
      title: string; // Ej: "Credenciales automáticas"
      description: string; // Ej: "Este servidor ya incluye credenciales listas."
      actionLabel: string; // Ej: "Ir a Conectar"
      readyBadge: string; // Ej: "Listo"
      changeServerLabel: string; // Ej: "Cambiar servidor"
    };
  };
  serverSelectorScreen: {
    header: {
      selectServer: string;
      categories: string;
      backToCategories: string;
      nativeMode: string;
      customMode: string;
    };
    searchBar: {
      placeholder: string;
      clearSearch: string;
    };
    categoryView: {
      activeConfig: string;
      serverCount: string;
      selectCategory: string;
    };
    serverView: {
      serversList: string;
      noServersFound: string;
      retrySearch: string;
      configuring: string;
      connecting: string;
    };
    loadingView: {
      loadingServers: string;
      updating: string;
      noServersAvailable: string;
      updateConfigs: string;
    };
    errorView: {
      loadError: string;
      connectionFailed: string;
      retry: string;
      useNativeSelector: string;
      errorDetails: string;
    };
    serverCard: {
      premium: string;
      free: string;
      recommended: string;
      connecting: string;
      connected: string;
      select: string;
      ping: string;
      load: string;
      unavailable: string;
    };
    filters: {
      allServers: string;
      freeServers: string;
      premiumServers: string;
      recommendedServers: string;
    };
    actions: {
      refresh: string;
      settings: string;
      help: string;
      close: string;
    };
    countries: {
      MX: string;
      PE: string;
      ES: string;
      NL: string;
      CA: string;
      JP: string;
      US: string;
      GB: string;
      FR: string;
      DE: string;
      BR: string;
      AR: string;
    };
    subcategories: {
      premiumSsh: {
        title: string;
        description: string;
      };
      premiumCm: {
        title: string;
        description: string;
      };
      udpHysteria: {
        title: string;
        description: string;
      };
      premiumVpn: {
        title: string;
        description: string;
      };
      premiumDns: {
        title: string;
        description: string;
      };
      premiumGames: {
        title: string;
        description: string;
      };
      others: {
        title: string;
      };
    };
    categoryTypes: {
      premium: string;
      free: string;
      emergency: string;
    };
  };
}

export type SupportedLanguage = "es" | "en" | "pt";

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}
