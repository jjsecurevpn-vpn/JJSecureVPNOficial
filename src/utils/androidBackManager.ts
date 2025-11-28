import { setAndroidBackButtonListener } from './appFunctions';

export interface AndroidBackHandlerOptions {
  priority?: number;
  intercept?: () => boolean;
  ignoreIfBottomSheet?: boolean;
}

export interface BackStackEntry {
  id: number;
  priority: number;
  handler: () => void;
  intercept?: () => boolean;
  ignoreIfBottomSheet: boolean;
}

interface BackManager {
  stack: BackStackEntry[];
  dispatcher?: () => void;
  keydownListener?: (e: KeyboardEvent) => void;
  popstateListener?: (ev: PopStateEvent) => void;
  historyLocked?: boolean;
}

type BackWindow = Window & {
  __BACK_MANAGER__?: BackManager;
  __BACK_DISPATCHER__?: () => void;
  __GLOBAL_APP_BACK?: boolean;
};

const getBackManager = (): BackManager => {
  const w = window as BackWindow;
  if (!w.__BACK_MANAGER__) {
    w.__BACK_MANAGER__ = { stack: [] };
  }
  return w.__BACK_MANAGER__;
};

const isBottomSheetVisible = () => {
  const sheet = document.querySelector('.bottom-sheet');
  return Boolean(
    sheet &&
    !/(translateY\(100%|translateY\(\d+px\))/i.test(sheet.getAttribute('style') || '') &&
    sheet.className.includes('translate-y-0')
  );
};

const ensureDispatcher = (manager: BackManager) => {
  const w = window as BackWindow;
  if (w.__GLOBAL_APP_BACK || manager.dispatcher) return;

  const dispatcher = () => {
    const sheetVisible = isBottomSheetVisible();
    for (const item of [...manager.stack]) {
      if (sheetVisible && item.ignoreIfBottomSheet) continue;
      try {
        if (item.intercept && item.intercept()) return;
        item.handler();
        return;
      } catch {
        // continuar con siguiente handler si uno falla
      }
    }
  };

  const keydownListener = (e: KeyboardEvent) => {
    if (e.key === 'Escape') dispatcher();
  };
  const popstateListener = (ev: PopStateEvent) => {
    ev.preventDefault();
    window.history.pushState(null, '', window.location.href);
    dispatcher();
  };

  manager.dispatcher = dispatcher;
  manager.keydownListener = keydownListener;
  manager.popstateListener = popstateListener;
  w.__BACK_DISPATCHER__ = dispatcher;

  setAndroidBackButtonListener(dispatcher);
  window.addEventListener('keydown', keydownListener);
  window.addEventListener('popstate', popstateListener);
  if (!manager.historyLocked) {
    window.history.pushState(null, '', window.location.href);
    manager.historyLocked = true;
  }
};

const teardownDispatcher = (manager: BackManager) => {
  const w = window as BackWindow;
  if (manager.stack.length || !manager.dispatcher) return;
  if (manager.keydownListener) window.removeEventListener('keydown', manager.keydownListener);
  if (manager.popstateListener) window.removeEventListener('popstate', manager.popstateListener);
  manager.dispatcher = undefined;
  manager.keydownListener = undefined;
  manager.popstateListener = undefined;
  delete w.__BACK_DISPATCHER__;
};

export const androidBackManager = {
  register(handler: () => void, options: AndroidBackHandlerOptions = {}) {
    const manager = getBackManager();
    const entry: BackStackEntry = {
      id: Date.now() + Math.random(),
      priority: options.priority ?? 0,
      ignoreIfBottomSheet: options.ignoreIfBottomSheet ?? false,
      handler,
      intercept: options.intercept ? () => options.intercept?.() === true : undefined,
    };

    manager.stack.push(entry);
    manager.stack.sort((a, b) => b.priority - a.priority || b.id - a.id);
    ensureDispatcher(manager);

    return () => {
      const idx = manager.stack.findIndex(item => item.id === entry.id);
      if (idx >= 0) manager.stack.splice(idx, 1);
      teardownDispatcher(manager);
    };
  },

  registerManual(handler: () => void, priority = 0) {
    return this.register(handler, { priority });
  },
};
