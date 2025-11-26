/**
 * @file nativeConnectionRecovery.ts
 * @description Sistema de recuperación automática cuando se pierde conexión con APIs nativas
 */

interface NativeConnectionState {
  isConnected: boolean;
  lastHeartbeat: number;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

class NativeConnectionRecovery {
  private state: NativeConnectionState = {
    isConnected: true,
    lastHeartbeat: Date.now(),
    reconnectAttempts: 0,
    maxReconnectAttempts: 10  // Aumentado de 5 a 10 para mayor resiliencia
  };

  private heartbeatInterval: NodeJS.Timeout | null = null;
  private onConnectionLost?: () => void;
  private onConnectionRestored?: () => void;
  private isNativeEnvironment: boolean;

  constructor(
    onConnectionLost?: () => void,
    onConnectionRestored?: () => void
  ) {
    this.onConnectionLost = onConnectionLost;
    this.onConnectionRestored = onConnectionRestored;
    
    // Detectar si estamos en un entorno nativo (Android WebView)
    this.isNativeEnvironment = this.detectNativeEnvironment();
    
    if (this.isNativeEnvironment) {
      console.log('🔧 Entorno nativo detectado - Activando sistema de recuperación de conexión');
      this.startHeartbeat();
      this.setupErrorHandlers();
    } else {
      // Entorno de desarrollo/desktop detectado - Sistema de recuperación de conexión deshabilitado
    }
  }

  /**
   * Detectar si estamos en un entorno nativo (Android WebView)
   */
  private detectNativeEnvironment(): boolean {
    try {
      // Verificar si hay APIs nativas disponibles
      const hasNativeAPIs = !!(
        window.DtGetVpnState?.execute ||
        window.DtExecuteVpnStart?.execute ||
        window.DtExecuteVpnStop?.execute
      );
      
      // Verificar si estamos en localhost o desarrollo
      const isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.port !== '';

      // Solo activar en entorno nativo con APIs disponibles
      return hasNativeAPIs && !isDevelopment;
    } catch (error) {
      console.warn('⚠️ Error detectando entorno nativo:', error);
      return false;
    }
  }

  /**
   * Configurar manejadores de errores globales
   */
  private setupErrorHandlers() {
    // Solo configurar manejadores en entorno nativo
    if (!this.isNativeEnvironment) {
      return;
    }

    // Interceptar TODOS los errores globales
    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      const errorMessage = String(message);
      
      // Detectar varios tipos de errores de conexión nativa
      if (
        errorMessage.includes('Java object is gone') ||
        errorMessage.includes('Error invoking execute') ||
        errorMessage.includes('DtGetVpnState') ||
        errorMessage.includes('DtExecuteVpnStart') ||
        errorMessage.includes('DtExecuteVpnStop') ||
        errorMessage.includes('Cannot read properties of undefined') && source?.includes('webview')
      ) {
        console.error('🚨 ERROR NATIVO DETECTADO:', { 
          message: errorMessage, 
          source, 
          lineno, 
          colno,
          timestamp: new Date().toISOString()
        });
        this.handleConnectionLoss();
        
        // Prevenir que el error se propague y cause más problemas
        return true;
      }
      
      return originalError?.(message, source, lineno, colno, error) || false;
    };

    // Interceptar errores de Promise no capturadas MÁS AGRESIVAMENTE
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      let reasonMessage = '';
      
      if (reason && typeof reason === 'object') {
        reasonMessage = reason.message || reason.toString();
      } else {
        reasonMessage = String(reason);
      }
      
      if (
        reasonMessage.includes('Java object is gone') ||
        reasonMessage.includes('Error invoking execute') ||
        reasonMessage.includes('DtGetVpnState') ||
        reasonMessage.includes('DtExecuteVpnStart') ||
        reasonMessage.includes('DtExecuteVpnStop')
      ) {
        console.error('🚨 PROMISE REJECTION NATIVA DETECTADA:', {
          reason: reasonMessage,
          timestamp: new Date().toISOString(),
          stack: reason?.stack
        });
        this.handleConnectionLoss();
        event.preventDefault(); // Prevenir que se muestre en consola
      }
    });

    // Interceptar errores de console.error para capturar errores que se loguean directamente
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (
        message.includes('Java object is gone') ||
        message.includes('Error invoking execute')
      ) {
        console.warn('🚨 CONSOLE ERROR NATIVO DETECTADO:', args);
        this.handleConnectionLoss();
      }
      originalConsoleError.apply(console, args);
    };

    // Wrapper para todas las llamadas a APIs nativas
    this.wrapNativeAPIs();
  }

  /**
   * Envolver todas las APIs nativas para detectar errores
   */
  private wrapNativeAPIs() {
    const nativeAPIs = [
      'DtGetVpnState',
      'DtExecuteVpnStart', 
      'DtExecuteVpnStop',
      'DtGetLogs',
      'DtClearLogs',
      'DtGetConfigs',
      'DtSetConfig',
      'DtGetNetworkDownloadBytes',
      'DtGetNetworkUploadBytes',
      'DtGetLocalIP',
      'DtGetPingResult'
    ];

    const w = window as unknown as Record<string, unknown>;
    nativeAPIs.forEach(apiName => {
      const api = w[apiName] as { execute: (...args: unknown[]) => unknown } | undefined;
      if (api && api.execute) {
        const originalExecute = api.execute;
        
        api.execute = (...args: unknown[]) => {
          try {
            const result = originalExecute.apply(api, args);
            return result;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            
            if (
              errorMessage.includes('Java object is gone') ||
              errorMessage.includes('Error invoking execute')
            ) {
              console.error(`🚨 API NATIVA FALLÓ: ${apiName}`, {
                error: errorMessage,
                args,
                timestamp: new Date().toISOString()
              });
              this.handleConnectionLoss();
              
              // Retornar un valor por defecto según la API
              return this.getDefaultValueForAPI(apiName);
            }
            
            // Re-lanzar otros errores
            throw error;
          }
        };
      }
    });
  }

  /**
   * Obtener valor por defecto para APIs que fallan
   */
  private getDefaultValueForAPI(apiName: string): string | number | null {
    switch (apiName) {
      case 'DtGetVpnState':
        return 'UNKNOWN';
      case 'DtGetLogs':
        return 'Conexión nativa perdida - No se pueden obtener logs';
      case 'DtGetConfigs':
        return '[]';
      case 'DtGetNetworkDownloadBytes':
      case 'DtGetNetworkUploadBytes':
      case 'DtGetPingResult':
        return 0;
      case 'DtGetLocalIP':
        return null;
      default:
        return null;
    }
  }

  /**
   * Iniciar heartbeat para verificar conexión
   */
  private startHeartbeat() {
    // Solo iniciar heartbeat en entorno nativo
    if (!this.isNativeEnvironment) {
      return;
    }

    this.heartbeatInterval = setInterval(() => {
      this.checkConnection();
    }, 3000); // Cada 3 segundos
  }

  /**
   * Verificar si la conexión nativa está activa
   */
  private checkConnection(): boolean {
    // Si no estamos en entorno nativo, siempre retornar true
    if (!this.isNativeEnvironment) {
      return true;
    }

    try {
      // Intentar una operación nativa simple que siempre esté disponible
      if (window.DtGetVpnState?.execute) {
        window.DtGetVpnState.execute();
        this.state.lastHeartbeat = Date.now();
        
        if (!this.state.isConnected) {
          // Conexión restaurada
          this.handleConnectionRestored();
        }
        
        return true;
      } else {
        throw new Error('API nativa no disponible');
      }
    } catch (error) {
      if (this.state.isConnected) {
        console.warn('⚠️ Heartbeat falló, verificando conexión:', error);
        this.handleConnectionLoss();
      }
      return false;
    }
  }

  /**
   * Manejar pérdida de conexión
   */
  private handleConnectionLoss() {
    if (this.state.isConnected) {
      console.error('🔴 Conexión nativa perdida');
      this.state.isConnected = false;
      this.state.reconnectAttempts = 0;
      this.onConnectionLost?.();
      this.attemptReconnection();
    }
  }

  /**
   * Manejar restauración de conexión
   */
  private handleConnectionRestored() {
    console.log('🟢 Conexión nativa restaurada');
    this.state.isConnected = true;
    this.state.reconnectAttempts = 0;
    this.onConnectionRestored?.();
  }

  /**
   * Intentar reconexión
   */
  private attemptReconnection() {
    if (this.state.reconnectAttempts >= this.state.maxReconnectAttempts) {
      console.error('❌ Máximo de intentos de reconexión alcanzado');
      this.showCriticalError();
      return;
    }

    this.state.reconnectAttempts++;
    console.log(`🔄 Intento de reconexión ${this.state.reconnectAttempts}/${this.state.maxReconnectAttempts}`);

    setTimeout(() => {
      if (this.checkConnection()) {
        this.handleConnectionRestored();
      } else {
        this.attemptReconnection();
      }
    }, Math.pow(2, this.state.reconnectAttempts) * 1000); // Backoff exponencial
  }

  /**
   * Mostrar error crítico al usuario
   */
  private showCriticalError() {
    // Solo registrar el error en consola, sin mostrar modal al usuario
    console.error('❌ Conexión nativa perdida permanentemente. Modal de reinicio deshabilitado por configuración.');
    
    // Opcionalmente, emitir un evento personalizado que la aplicación puede manejar
    window.dispatchEvent(new CustomEvent('nativeConnectionCriticalError', {
      detail: {
        message: 'Conexión nativa perdida permanentemente',
        attempts: this.state.reconnectAttempts,
        maxAttempts: this.state.maxReconnectAttempts,
        timestamp: Date.now()
      }
    }));
  }

  /**
   * Limpiar recursos
   */
  public cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Obtener estado de conexión
   */
  public getConnectionState(): NativeConnectionState {
    return { ...this.state };
  }

  /**
   * Verificar si el sistema de recuperación está activo
   */
  public isActive(): boolean {
    return this.isNativeEnvironment;
  }
}

export { NativeConnectionRecovery };
export type { NativeConnectionState };
