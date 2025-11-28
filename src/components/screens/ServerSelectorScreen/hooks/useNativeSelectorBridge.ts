import { useCallback, useState } from 'react';

type ErrorPublisher = (message: string) => void;

interface NativeSelectorMessages {
  missingApi: string;
  connectionFailed: string;
}

interface UseNativeSelectorBridgeParams {
  onError: ErrorPublisher;
  messages: NativeSelectorMessages;
}

export function useNativeSelectorBridge({ onError, messages }: UseNativeSelectorBridgeParams) {
  const [useNativeSelector, setUseNativeSelector] = useState(false);

  const openNativeSelector = useCallback(() => {
    try {
      if (window?.DtExecuteDialogConfig?.execute) {
        window.DtExecuteDialogConfig.execute();
      } else {
        console.warn('[SERVER_SELECTOR] API nativa no disponible');
        onError(messages.missingApi);
      }
    } catch (error) {
      console.error('[SERVER_SELECTOR] Error al abrir selector nativo:', error);
      onError(messages.connectionFailed);
    }
  }, [messages.connectionFailed, messages.missingApi, onError]);

  const toggleNativeSelector = useCallback(() => {
    setUseNativeSelector((prev) => {
      if (prev) {
        return false;
      }
      openNativeSelector();
      return true;
    });
  }, [openNativeSelector]);

  return {
    useNativeSelector,
    setUseNativeSelector,
    openNativeSelector,
    toggleNativeSelector,
  } as const;
}
