type FlushHandler = () => boolean;

let currentHandler: FlushHandler | null = null;

export function registerCredentialFlushHandler(handler: FlushHandler) {
  currentHandler = handler;
  return () => {
    if (currentHandler === handler) {
      currentHandler = null;
    }
  };
}

export function flushPendingCredentials(): boolean {
  try {
    return currentHandler?.() ?? false;
  } catch {
    return false;
  }
}
