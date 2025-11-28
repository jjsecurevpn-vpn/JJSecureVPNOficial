const NATIVE_EVENT_NAMES = [
  'DtVpnStateEvent',
  'DtCheckUserResultEvent',
  'DtCheckUserModelEvent',
  'DtConfigSelectedEvent',
  'DtNewDefaultConfigEvent',
  'DtCheckUserStartedEvent',
] as const;

type NativeEventName = typeof NATIVE_EVENT_NAMES[number];

type NativeHandler = (payload: unknown) => void;

const listenerMap = new Map<NativeEventName, Set<NativeHandler>>();
let initialized = false;

function dispatchEvent(name: NativeEventName, payload: unknown) {
  const listeners = listenerMap.get(name);
  if (!listeners || !listeners.size) return;
  listeners.forEach(handler => {
    try {
      handler(payload);
    } catch (error) {
      console.error(`Error al manejar ${name}`, error);
    }
  });
}

export function initNativeEvents() {
  if (initialized || typeof window === 'undefined') return;
  const win = window as unknown as Record<string, unknown>;

  NATIVE_EVENT_NAMES.forEach(name => {
    const proxy: NativeHandler = payload => {
      dispatchEvent(name, payload);
    };

    win[name] = proxy;
  });

  initialized = true;
}

export function onNativeEvent<T = unknown>(name: NativeEventName, handler: (payload: T) => void) {
  if (!initialized) initNativeEvents();
  if (!listenerMap.has(name)) listenerMap.set(name, new Set());
  listenerMap.get(name)!.add(handler as unknown as NativeHandler);
  return () => {
    const listeners = listenerMap.get(name);
    if (!listeners) return;
    listeners.delete(handler as unknown as NativeHandler);
    if (!listeners.size) listenerMap.delete(name);
  };
}

