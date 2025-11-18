// Utilidad para interceptar y controlar los modales nativos de DTunnel
// Este archivo ayuda a prevenir que se abran modales nativos cuando queremos usar nuestros modales personalizados

export class DtunnelModalInterceptor {
  private static instance: DtunnelModalInterceptor;
  private originalMethods: { [key: string]: any } = {};
  private isIntercepting = false;

  static getInstance(): DtunnelModalInterceptor {
    if (!DtunnelModalInterceptor.instance) {
      DtunnelModalInterceptor.instance = new DtunnelModalInterceptor();
    }
    return DtunnelModalInterceptor.instance;
  }

  // Intercepta el modal nativo de check user
  interceptCheckUserModal(): void {
    if (this.isIntercepting) return;

    try {
      // Guardamos el método original si existe
      if ((window as any).DtStartCheckUser?.execute) {
        this.originalMethods.DtStartCheckUser = (
          window as any
        ).DtStartCheckUser.execute;

        // Reemplazamos con una función que solo dispara los eventos pero no abre modal
        (window as any).DtStartCheckUser.execute = () => {
          console.log("🔄 ModalInterceptor - DtStartCheckUser interceptado");
          
          // Simulamos los eventos que normalmente dispararía el modal nativo
          if ((window as any).DtCheckUserStartedEvent) {
            console.log("🚀 ModalInterceptor - Disparando DtCheckUserStartedEvent");
            (window as any).DtCheckUserStartedEvent();
          }

          // Aquí podrías hacer la llamada real a la API si tienes acceso directo
          // o usar datos de prueba mientras desarrollas
          setTimeout(() => {
            if ((window as any).DtCheckUserModelEvent) {
              const testData = {
                expiration_days: "28",
                limit_connections: "05",
                expiration_date: "04/08/2025",
                username: "JHServices-Intercepted",
                count_connections: "01",
                server_region: "LatAm",
                plan_type: "Premium",
                user_id: "test_user_123"
              };
              console.log("📤 ModalInterceptor - Enviando datos:", testData);
              (window as any).DtCheckUserModelEvent(JSON.stringify(testData));
            } else {
              console.warn("⚠️ ModalInterceptor - DtCheckUserModelEvent no disponible");
            }
          }, 500);
        };

        this.isIntercepting = true;
      }
    } catch (error) {
      // Error interceptando modal CheckUser
    }
  }

  // Restaura el comportamiento original
  restoreOriginalBehavior(): void {
    try {
      if (
        this.originalMethods.DtStartCheckUser &&
        (window as any).DtStartCheckUser
      ) {
        (window as any).DtStartCheckUser.execute =
          this.originalMethods.DtStartCheckUser;
        this.isIntercepting = false;
      }
    } catch (error) {
      // Error restaurando comportamiento original
    }
  }

  // Verifica si está interceptando
  isInterceptingModals(): boolean {
    return this.isIntercepting;
  }
}

// Función de conveniencia para activar/desactivar interceptor
export const interceptDtunnelModals = {
  start: () => DtunnelModalInterceptor.getInstance().interceptCheckUserModal(),
  stop: () => DtunnelModalInterceptor.getInstance().restoreOriginalBehavior(),
  isActive: () => DtunnelModalInterceptor.getInstance().isInterceptingModals(),
};
