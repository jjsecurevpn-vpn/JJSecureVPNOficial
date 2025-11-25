/**
 * @file pt.ts
 * @description Traduções em português para JJSecure VPN
 */

import { Translations } from "./types";

export const pt: Translations = {
  tvMode: {
    title: "Modo TV",
    noServerSelected: "Nenhum servidor selecionado",
    howItWorksButton: "Como Funciona?",
    howItWorksTooltip: "Aprenda como o app funciona",
    steps: {
      credentials: "INSERIR CREDENCIAIS",
      selectServer: "ESCOLHER SERVIDOR",
      connection: "CONEXÃO",
      stepLabel: "PASSO",
    },
    emptyCategory: "Selecione uma categoria para ver servidores",
    validation: {
      incomplete: "Configuração incompleta",
      noServer: "Nenhuma configuração selecionada",
      missingCredentials: "Credenciais faltando",
      processError: "Erro ao processar a conexão",
    },
    connection: { statusPrefix: "Status atual:" },
    howItWorksModal: {
      title: "Como Funciona?",
      introTitle: "É muito fácil usar o JJSecure na sua TV!",
      introSubtitle: "Siga estes passos simples:",
      steps: {
        install: {
          title: "Instale o app na sua TV",
          desc: "Baixe e instale o JJSecure na sua Smart TV pela loja de apps.",
        },
        wifi: {
          title: "Compartilhe WiFi do seu celular",
          desc: "Use seu celular (operadora Personal, sem saldo) para compartilhar internet via WiFi.",
        },
        follow: {
          title: "Siga os passos mostrados aqui",
          desc: "Complete os 3 passos: credenciais, escolha servidor e conecte. Tudo com o controle remoto!",
        },
        enjoy: {
          title: "Aproveite a navegação!",
          desc: "Uma vez conectado, poderá navegar livremente na sua Smart TV com total privacidade.",
        },
      },
      tipLabel: "Dica",
      tipText:
        "Você não precisa de saldo no celular da operadora Personal. A conexão funciona com a configuração especial.",
      confirmButton: "Entendi, iniciar!",
    },
  },
  modals: {
    missingConfig: {
      title: "Configuração incompleta",
      advice:
        "Dica: você pode abrir credenciais pelo ícone do cabeçalho e o seletor pelo cartão superior.",
      messages: {
        missingCredentials:
          "Suas credenciais de acesso estão faltando (usuário e/ou senha).",
        missingServer: "Você não selecionou um servidor.",
        missingSetup:
          "Faltam dados para conectar: selecione um servidor e complete suas credenciais.",
      },
      buttons: {
        configureCredentials: "Configurar credenciais",
        chooseServer: "Escolher servidor",
        server: "Servidor",
        credentials: "Credenciais",
      },
    },
    cleanData: {
      title: "Limpar Dados",
      attention: "Atenção!",
      permanent:
        "Esta ação removerá permanentemente todos os dados do aplicativo.",
      willRemove: "Os seguintes dados serão removidos:",
      items: {
        connectionConfigs: "Configurações de conexão",
        userCredentials: "Dados e credenciais do usuário",
        preferences: "Preferências do aplicativo",
        history: "Histórico de conexões",
      },
      requirementTitle: "Requisito importante",
      requirementText:
        "É necessária uma conexão estável para baixar as configurações novamente após a limpeza.",
      buttons: {
        confirm: "Confirmar - Limpar Dados",
        cancel: "Cancelar",
      },
    },
  },
  header: {
    protected: "Estou protegido",
    notProtected: "Não protegido",
    connecting: "Conectando...",
    noConnection: "Sem conexão",
    connected: "Conectado",
    disconnected: "Desconectado",
  },
  tutorial: {
    start: "Iniciar tutorial",
  },
  languages: {
    spanish: "Espanhol",
    english: "Inglês",
    portuguese: "Português",
  },
  common: {
    close: "Fechar",
    select: "Selecionar",
    cancel: "Cancelar",
    back: "Voltar",
    continue: "Continuar",
    accept: "Aceitar",
    decline: "Recusar",
    confirm: "Confirmar",
    loading: "Carregando",
    error: "Erro",
    success: "Sucesso",
    warning: "Aviso",
    info: "Informação",
  },
  support: {
    title: "Centro de Suporte",
    subtitle: "Estamos aqui para ajudá-lo a qualquer momento",
    directContact: "Contato Direto",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    recommended: "Recomendado",
    immediateResponse: "Resposta imediata",
    specializedSupport: "Suporte especializado",
    fastChat: "Chat rápido",
    efficientChat: "Chat eficiente",
    communities: "Comunidades",
    joinCommunities: "Junte-se às nossas comunidades",
    whatsappGroup: "Grupo WhatsApp",
    telegramChannel: "Canal Telegram",
    telegramGroup: "Grupo Telegram",
    userCommunity: "Comunidade de usuários",
    newsUpdates: "Notícias e atualizações",
    discussionsHelp: "Discussões e ajuda",
  },
  welcome: {
    title: "Bem-vindo ao JJSecure VPN",
    subtitle: "Sua privacidade e segurança são nossa prioridade",
    description: "Proteja sua conexão e navegue com segurança",
    buy: "Comprar Premium",
    resell: "Planos Revendedor",
    termsAcceptance: "Ao continuar, você aceita nossos",
    termsAndConditions: "Termos e Condições",
    certifiedVpn: "VPN Certificado",
    simpleMode: "Modo Simples",
    simpleModeDesc: "Interface limpa e fácil de usar",
    advancedMode: "Modo Avançado",
    advancedModeDesc: "Controle total e configuração detalhada",
    chooseMode: "Escolha como deseja usar o app",
    mobileMode: "Modo Móvel",
    mobileModeDesc: "Interface vertical otimizada para telefone",
    tvMode: "Modo SmartTV",
    tvModeDesc: "Interface horizontal para TV com botões grandes",
    startMobile: "Iniciar em Modo Móvel",
    openTvMode: "Abrir Modo SmartTV",
    termsText: "Ao continuar, você aceita nossos",
    termsLink: "Termos e Condições",
    privacyLink: "Política de Privacidade",
  },
  settings: {
    title: "Configurações",
    general: "Geral",
    support: "Suporte",
    account: "Conta",
    about: "Sobre",
    quickActions: "Ações Rápidas",
    tools: "Ferramentas",
    configurations: "Configurações",
    update: "Atualizar Aplicativo",
    updateDesc: "Verificar e instalar a atualização mais recente disponível",
    autoConnect: "Conexão Automática",
    autoConnectDesc: "Conectar automaticamente ao iniciar",
    hotspot: "Hotspot",
    apn: "Configurar APN",
    apnDesc: "Configurações do ponto de acesso da rede",
    battery: "Otimizar Bateria",
    batteryDesc: "Configurar otimização de bateria",
    credentials: "Credenciais de Acesso",
    credentialsDesc: "Configurar usuário e senha",
    cleanData: "Limpar Dados",
    cleanDataDesc: "Remover configurações e cache",
    viewPremiumPlans: "Ver Planos Premium",
    resellerProgram: "Programa de Revendedores",
    affiliateProgram: "Programa de Afiliados",
    supportCommunitiesLabel: "Suporte & Comunidades",
    supportCommunitiesDesc: "Suporte 24/7 - Comunidades",
    downloadApp: "Baixar App",
    downloadAppDesc: "Baixe o app oficial do Google Play",
    termsAndConditions: "Termos e Condições",
    privacyPolicy: "Política de Privacidade",
  },
  hotspot: {
    title: "Compartilhar VPN",
    sharing: "Compartilhando Conexão VPN",
    notSharing: "Hotspot Desativado",
    sharingDescription: "Outros dispositivos podem conectar e usar sua VPN",
    notSharingDescription:
      "Ative o hotspot para compartilhar sua conexão VPN segura",
    start: "Iniciar Hotspot",
    stop: "Parar Hotspot",
    processing: "Processando...",
    activeConnectionTitle: "✅ Conexão VPN Compartilhada Ativa",
    activeConnectionDescription:
      "Os dispositivos conectados ao seu hotspot estão protegidos pela VPN",
    howToConfigure: "📋 Guia Passo a Passo",
    whatYouWillAchieve: "🎯 O que você conseguirá?",
    whatYouWillAchieveDesc:
      "Transformar seu dispositivo em um ponto de acesso WiFi que compartilha sua conexão VPN segura com outros dispositivos (celulares, tablets, laptops, etc.)",
    proxyGuide: {
      title: "📌 Como compartilhar internet via VPN com Proxy",
      steps: [
        "1️⃣ Abra o aplicativo VPN no seu celular e ative a opção Hotspot interno (do app).",
        "2️⃣ Ao ativá-lo, na barra de notificações aparecerão os dados de Proxy e Porta → anote-os porque vai precisar deles.",
        "3️⃣ Agora ative o Hotspot normal do Android (zona Wi‑Fi portátil) e defina uma senha.",
        "4️⃣ No celular receptor (que vai receber a internet):\n• Conecte-se à rede Wi‑Fi que você acabou de criar.\n• Nas configurações avançadas da rede, coloque o Proxy e a Porta que anotou antes.",
        "5️⃣ Salve as alterações e conecte-se.",
      ],
      finalMessage:
        "✅ Pronto! Agora você pode aproveitar a internet compartilhada através da VPN com Proxy.",
    },
    importantTips: {
      title: "💡 Dicas Importantes",
      battery:
        "Bateria: O hotspot consome mais bateria, mantenha seu dispositivo carregado",
      speed:
        "Velocidade: A velocidade será compartilhada entre todos os dispositivos conectados",
      security:
        "Segurança: Todos os dispositivos conectados estarão protegidos pela sua VPN automaticamente",
    },
    footerTip:
      "💡 Dica: Certifique-se de estar conectado à VPN antes de iniciar o hotspot",
    tip: "Dica:",
    tipDescription: 'Para navegar sem VPN, mude o proxy para "Automático"',
  },
  autoConnect: {
    title: "Conexão Automática",
    settingsTitle: "Configurações",
    searchTitle: "Busca",
    subtitle: "Encontre a melhor configuração automaticamente",
    description: "Teste todas as configurações até encontrar uma que funcione",
    startTest: "Iniciar Teste",
    stopTest: "Parar Teste",
    clearResults: "Limpar Resultados",
    settings: "Configurações",
    backToMain: "Voltar ao Principal",
    mainScreen: {
      subtitle: "Encontre automaticamente a melhor configuração disponível",
      description:
        "O JJSecure testará automaticamente todas as configurações disponíveis para encontrar a que funciona melhor na sua localização.",
      lastSuccessful: "Última conexão bem-sucedida:",
      noSuccessful: "Nenhuma conexão bem-sucedida anterior",
      startButton: "Iniciar Busca Automática",
      settingsButton: "Configurar Filtros",
    },
    status: {
      idle: "Pronto para começar",
      running: "Testando configurações...",
      success: "Configuração encontrada",
      failed: "Nenhuma configuração funcionou",
      cancelled: "Teste cancelado",
      testing: "Testando",
      error: "Erro",
      timeout: "Tempo esgotado",
    },
    progress: {
      testing: "Testando",
      of: "de",
      configurations: "configurações",
      current: "Atual:",
      success: "Sucesso:",
      failed: "Falharam:",
      status: "Status da Busca",
      completed: "Busca concluída",
      cancelled: "Busca cancelada",
      error: "Erro na busca",
      currentTest: "Testando:",
      tested: "Testadas",
      successful: "Bem-sucedidas:",
      detailedLogs: "Logs Detalhados",
      showLogs: "Mostrar Logs",
      hideLogs: "Ocultar Logs",
      startButton: "Iniciar",
      stopButton: "Parar",
      backButton: "Voltar",
      showDetails: "Ver Detalhes",
      noTests: "Nenhum teste executado",
      testResults: "Resultados dos Testes",
    },
    settingsScreen: {
      title: "Configurações de Conexão Automática",
      filters: "Filtros de Busca",
      categories: "Categorias a Incluir",
      selectCategories: "Selecionar categorias",
      allCategories: "Todas as categorias",
      advanced: "Configurações Avançadas",
      timeout: "Tempo limite por configuração",
      timeoutSeconds: "segundos",
      seconds: "segundos",
      maxRetries: "Máximo de tentativas",
      retries: "tentativas",
      retryAttempts: "tentativas",
      testOrder: "Ordem de teste",
      sequential: "Sequencial",
      random: "Aleatório",
      parallel: "Testes paralelos",
      enableParallel: "Habilitar testes paralelos",
      parallelDesc:
        "Testar múltiplas configurações simultaneamente (mais rápido)",
      maxParallel: "Máximo de testes paralelos",
      tests: "testes",
      enableLogs: "Habilitar logs detalhados",
      autoStop: "Parar automaticamente quando encontrar",
      saveSettings: "Salvar Configurações",
    },
    logs: {
      title: "Registro de Testes",
      clear: "Limpar",
      empty: "Nenhum log disponível",
      testing: "Testando configuração:",
      success: "Configuração bem-sucedida:",
      failed: "Configuração falhou:",
      timeout: "Tempo esgotado para:",
      cancelled: "Teste cancelado",
      completed: "Teste concluído",
      connecting: "Estabelecendo conexão...",
      verifying: "Verificando conectividade...",
      connectionTimeout: "Tempo de conexão esgotado",
      internetTestFailed: "Teste de internet falhou",
      connectionError: "Erro de conexão",
      noCategory: "Sem categoria",
    },
    messages: {
      confirmClose:
        "Tem certeza de que deseja fechar? A busca será interrompida.",
      searchCompleted: "Busca automática concluída",
      configurationFound: "Configuração encontrada:",
      noConfigurationFound: "Nenhuma configuração válida encontrada",
      searchCancelled: "Busca cancelada pelo usuário",
    },
  },
  terms: {
    title: "Termos e Condições",
    alreadyAccepted: "Termos já aceitos",
    alreadyAcceptedDesc:
      "Você já aceitou nossos termos e condições anteriormente.",
    readToEnd: "Informações importantes",
    readToEndDesc:
      "Leia até o final para aceitar os termos e continuar usando o aplicativo.",
    welcome: {
      title: "Bem-vindo ao JJSecure VPN",
      subtitle:
        "Ao usar nosso aplicativo, você aceita os seguintes termos e condições",
    },
    buttons: {
      accepted: "Termos aceitos - Continuar",
      accept: "Aceito os Termos e Condições",
      readToEndFirst: "Leia até o final para continuar",
    },
    sections: {
      acceptance: {
        title: "Aceitação dos Termos",
        content:
          "Ao acessar e utilizar o JJSecure VPN, você confirma que leu, entendeu e aceita estes termos. Se não concorda, não deve usar o serviço.",
      },
      service: {
        title: "Descrição do Serviço",
        intro: "JJSecure VPN é um serviço de proxy/VPN que permite:",
        features: [
          "Navegar de forma mais privada e segura",
          "Acessar conteúdo com restrições geográficas",
          "Proteger sua conexão em redes WiFi públicas",
        ],
      },
      usage: {
        title: "Uso Responsável",
        commitmentLabel: "Compromisso do usuário:",
        commitment:
          "Você se compromete a usar o serviço de forma responsável e legal.",
        prohibited: "É proibido usar o serviço para:",
        prohibitedItems: [
          "Atividades ilegais ou maliciosas",
          "Spam, phishing ou distribuição de malware",
          "Ataques contra outros serviços ou usuários",
        ],
      },
      limitations: {
        title: "Limitações do Serviço",
        intro:
          'O serviço é fornecido "como está", com as seguintes considerações:',
        items: [
          "Pode haver interrupções ocasionais para manutenção",
          "A velocidade pode variar dependendo do congestionamento da rede",
          "Reservamo-nos o direito de limitar conexões simultâneas",
        ],
      },
      responsibility: {
        title: "Responsabilidade e Garantias",
        limitationLabel: "Limitação de responsabilidade:",
        limitation:
          "JJSecure VPN não se responsabiliza por danos diretos ou indiretos decorrentes do uso do serviço.",
        userResponsibility:
          "O usuário é o único responsável por suas atividades enquanto usa o serviço.",
      },
      refund: {
        title: "Reembolso e Compra de Logins",
        policyLabel: "Política de reembolso:",
        policy:
          "Caso um usuário compre um login para acessar o serviço, terá direito ao reembolso somente se for comprovado que o problema está relacionado aos nossos servidores e não a bloqueios das operadoras.",
        process:
          "Para solicitar o reembolso, o usuário deve fornecer provas do problema e aguardar a análise de nossa equipe técnica.",
        freezingTitle: "Congelamento de planos",
        freezingDesc:
          "Em casos de bloqueios por parte das operadoras telefônicas, os planos serão congelados automaticamente até que um novo método funcional seja encontrado. Uma vez resolvido o bloqueio, todos os dias restantes em seu plano serão reintegrados.",
        importantLabel: "Importante:",
        important:
          "Não serão feitos reembolsos por problemas relacionados a bloqueios de operadoras ou problemas de conectividade do usuário, mas os dias pagos serão preservados através do sistema de congelamento.",
      },
      modifications: {
        title: "Modificações",
        content:
          "Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.",
      },
      contact: {
        title: "Contato e Suporte",
        content:
          "Para consultas ou suporte, entre em contato conosco via Telegram",
        supportLink: "@SoporteJHS_bot",
      },
    },
    footer: {
      lastUpdate: "Última atualização:",
      company: "JJSECURE VPN",
    },
  },
  privacy: {
    title: "Política de Privacidade",
    alreadyAccepted: "Política já aceita",
    alreadyAcceptedDesc:
      "Você já aceitou nossa política de privacidade anteriormente.",
    readToEnd: "Informações importantes",
    readToEndDesc:
      "Leia até o final para aceitar a política e continuar usando o aplicativo.",
    intro: {
      title: "Sua privacidade é importante",
      subtitle:
        "Esta política explica como coletamos, usamos e protegemos suas informações ao usar o JJSecure VPN",
    },
    buttons: {
      accepted: "Política já aceita - Continuar",
      accept: "Aceito a Política de Privacidade",
      readToEndFirst: "Leia até o final para continuar",
    },
    sections: {
      collection: {
        title: "Informações que Coletamos",
        intro:
          "Para o funcionamento do serviço, coletamos informações mínimas:",
        items: [
          "Device ID (removido automaticamente a cada 24 horas)",
          "Informações básicas de conexão para controle de limites",
          "Dados técnicos necessários para o funcionamento do proxy",
        ],
      },
      usage: {
        title: "Uso das Informações",
        intro: "As informações coletadas são usadas exclusivamente para:",
        items: [
          "Controlar limites de conexões simultâneas",
          "Manter a estabilidade do serviço",
          "Fornecer suporte técnico quando necessário",
        ],
      },
      protection: {
        title: "Proteção de Dados",
        commitmentLabel: "Compromisso de segurança:",
        commitment:
          "Não armazenamos histórico de navegação, conteúdo de comunicações ou dados pessoais identificáveis.",
        autoDelete:
          "Os dados temporários (como Device ID) são excluídos automaticamente de nossos servidores a cada 24 horas.",
      },
      sharing: {
        title: "Compartilhamento de Informações",
        policyLabel: "Política rigorosa:",
        policy:
          "Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros.",
        legalRequirement:
          "Só poderíamos divulgar informações se exigido por lei e com ordem judicial válida.",
      },
      rights: {
        title: "Seus Direitos",
        intro: "Como usuário, você tem o direito de:",
        items: [
          "Solicitar informações sobre os dados que armazenamos",
          "Pedir a exclusão de seus dados",
          "Parar de usar o serviço a qualquer momento",
        ],
      },
      contact: {
        title: "Contato",
        content:
          "Para consultas sobre privacidade, entre em contato conosco via Telegram",
        supportLink: "@SoporteJHS_bot",
      },
    },
    footer: {
      lastUpdate: "Última atualização:",
      company: "JJSECURE VPN",
    },
  },
  bottomSheetServerSelector: {
    serverInfo: {
      selectServer: "SELECIONAR SERVIDOR",
      selectServerDesc: "Toque para escolher uma configuração",
      freeServersTooltip: "Ver servidores gratuitos disponíveis",
    },
    connectionButtons: {
      vpnStates: {
        connected: "DESCONECTAR",
        connecting: "CANCELAR",
        stopping: "PARANDO",
        auth: "CANCELAR",
        noNetwork: "TENTAR NOVAMENTE",
        authFailed: "TENTAR NOVAMENTE",
        disconnected: "CONECTAR",
      },
      logsButton: "LOGS",
      logsTooltip: "Ver logs de conexão",
    },
  },
  footer: {
    tabs: {
      home: "INÍCIO",
      servers: "SERVIDORES",
      logs: "LOGS",
      profile: "PERFIL",
      settings: "CONFIGURAÇÕES",
    },
  },
  credentialsPanel: {
    header: {
      hysteria: "Protocolo HYSTERIA",
      v2ray: "Protocolo V2Ray",
      ssh: "Autenticação SSH",
    },
    headerDesc: {
      hysteria: "Combina automaticamente usuário e senha",
      ssh: "Configure as credenciais de acesso",
    },
    hysteriaTitle: "Credenciais HYSTERIA",
    usernameLabel: "Usuário",
    passwordLabel: "Senha",
    usernamePlaceholder: "Digite seu usuário",
    passwordPlaceholder: "Digite sua senha",
    uuidLabel: "UUID V2Ray",
    uuidPlaceholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    connecting: "Conectando ao servidor...",
    errors: {
      userRequired: "O usuário é obrigatório",
      passwordRequired: "A senha é obrigatória",
      uuidRequired: "O UUID é obrigatório",
      uuidInvalid: "Formato de UUID inválido",
    },
    buttons: {
      saving: "Salvando...",
      save: "Salvar Credenciais",
    },
    secureInfo: {
      title: "Credenciais seguras:",
      desc: "Armazenadas localmente no seu dispositivo",
      connectNote: "Para conectar, use o botão CONECTAR na tela principal",
    },
    preconfigured: {
      title: "Conexão direta",
      description:
        "Este servidor está configurado para conexão direta. Pode falhar se não estiver habilitado ou disponível. Se não conectar, tente outro servidor.",
      actionLabel: "Ir para Conectar",
      readyBadge: "Pronto",
      changeServerLabel: "Mudar servidor",
    },
  },
  userProfileScreen: {
    header: {
      myAccount: "Minha Conta",
      configuration: "Configuração",
      connected: "Conectado",
      configureCredentials: "Configurar credenciais",
    },
    disconnectedContent: {
      configureAccess: "Configurar Acesso",
      configureAccessDesc: "Digite suas credenciais para conectar",
      secureConnection: "Conexão segura",
      secureConnectionDesc:
        "Suas credenciais são armazenadas com segurança no seu dispositivo e usadas apenas para autenticação VPN.",
    },
    accountPanel: {
      days: "dias",
      active: "Ativa",
      expired: "Expirada",
      aboutToExpire: "Prestes a expirar",
      expiresOn: "Expira",
      expiredLabel: "expirada",
      inDays: "em {count} dia{plural}",
      connections: "Conexões",
      activeConnections: "Ativas",
      limit: "Limite",
      renewWarningTitle: "Sua conta está prestes a expirar",
      renewWarningDesc: "Renove agora para manter seu acesso sem interrupções.",
      renewSubscription: "Renovar assinatura",
      contactSupport: "Contactar suporte",
    },
    sessionStats: {
      session: "Sessão",
      ping: "Ping",
      download: "Download",
      upload: "Upload",
      downloadSpeed: "Vel. Down",
      uploadSpeed: "Vel. Up",
      network: "Rede",
      localIP: "IP local",
    },
    deviceInfo: {
      device: "Dispositivo",
      deviceId: "ID",
      version: "Versão",
      copyIdLabel: "Copiar ID",
    },
    recentConfigs: {
      recent: "Recentes",
      config: "Config",
    },
    errors: {
      serverError: "Erro do servidor",
      userNotFound: "Usuário não encontrado neste servidor",
      processingError: "Erro ao processar dados do usuário",
      dtunnelNotAvailable: "Função DTunnel não disponível",
      timeout: "Timeout: Nenhuma resposta recebida do servidor",
      queryError: "Erro ao executar consulta de usuário",
    },
  },
  serverSelectorScreen: {
    header: {
      selectServer: "Selecionar Servidor",
      categories: "Categorias",
      backToCategories: "Voltar às Categorias",
      nativeMode: "NATIVO",
      customMode: "CUSTOM",
    },
    searchBar: {
      placeholder: "Buscar servidores...",
      clearSearch: "Limpar busca",
    },
    categoryView: {
      activeConfig: "Configuração ativa",
      serverCount: "{count} servidor{plural}",
      selectCategory: "Selecionar categoria",
    },
    flowGuide: {
      title: "1. Escolha uma categoria",
      subtitle: "2. A lista abaixo mostra os servidores disponíveis",
      helper: "Selecione uma categoria no topo para exibir os servidores e toque em um deles para conectar.",
    },
    descriptionToggle: {
      show: "Mostrar descrições",
      hide: "Ocultar descrições",
      hint: "Apenas o nome e o protocolo são exibidos; ative para ver mais detalhes.",
    },
    serverView: {
      serversList: "Lista de Servidores",
      noServersFound: "Nenhum servidor encontrado",
      retrySearch: "Tentar novamente",
      configuring: "Configurando...",
      connecting: "Conectando...",
      descriptionToggle: {
        show: "Ver descrição",
        hide: "Ocultar descrição",
      },
    },
    loadingView: {
      loadingServers: "Carregando servidores...",
      updating: "Atualizando...",
      noServersAvailable: "Nenhum servidor disponível",
      updateConfigs: "Atualizar configurações",
    },
    errorView: {
      loadError: "Erro ao carregar",
      connectionFailed: "Falha na conexão",
      retry: "Tentar novamente",
      useNativeSelector: "Usar seletor nativo",
      errorDetails: "Detalhes do erro",
    },
    serverCard: {
      premium: "Premium",
      free: "Grátis",
      recommended: "Recomendado",
      connecting: "Conectando",
      connected: "Conectado",
      select: "Selecionar",
      ping: "Ping",
      load: "Carga",
      unavailable: "Indisponível",
    },
    filters: {
      allServers: "Todos os servidores",
      freeServers: "Servidores gratuitos",
      premiumServers: "Servidores premium",
      recommendedServers: "Servidores recomendados",
    },
    actions: {
      refresh: "Atualizar",
      settings: "Configurações",
      help: "Ajuda",
      close: "Fechar",
    },
    countries: {
      MX: "México",
      PE: "Peru",
      ES: "Espanha",
      NL: "Holanda",
      CA: "Canadá",
      JP: "Japão",
      US: "Estados Unidos",
      GB: "Reino Unido",
      FR: "França",
      DE: "Alemanha",
      BR: "Brasil",
      AR: "Argentina",
    },
    subcategories: {
      premiumSsh: {
        title: "🏆 PRINCIPAL",
        description: "Configuração recomendada • Internet ilimitada",
      },
      premiumCm: {
        title: "CONGELA DADOS",
        description: "Use com precaução",
      },
      udpHysteria: {
        title: "UDP HYSTERIA",
        description: "Protocolo UDP otimizado",
      },
      premiumVpn: {
        title: "PREMIUM VPN",
        description: "Camuflagem de IP com dados",
      },
      premiumDns: {
        title: "PREMIUM DNS",
        description: "Sem Anúncios",
      },
      premiumGames: {
        title: "PREMIUM GAMES",
        description: "Suporte para Jogos",
      },
      others: {
        title: "Outros",
      },
    },
    categoryTypes: {
      premium: "PREMIUM",
      free: "GRATUITO",
      emergency: "EMERGÊNCIA",
    },
  },
};
