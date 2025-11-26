const STORAGE_PREFIX = "@sshproject:";

export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setStorageItem(key: string, value: unknown): void {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
}

// Tipos y utilidades para historial de conexiones recientes
export interface RecentConnection {
  configId: number;
  configName: string;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  lastConnected: number;
  successCount: number; // Cuántas veces se conectó exitosamente
  configType: "ssh" | "v2ray" | "other"; // Tipo de configuración
}

// Obtener conexiones recientes ordenadas por último uso
export function getRecentConnections(): RecentConnection[] {
  const recent = getStorageItem<RecentConnection[]>("recent_connections") || [];
  return recent
    .sort((a, b) => b.lastConnected - a.lastConnected) // Más recientes primero
    .slice(0, 20); // Mantener solo las últimas 20
}

// Guardar una conexión exitosa en el historial
export function saveRecentConnection(config: {
  id: number;
  name: string;
  category_id: number;
  categoryName: string;
  categoryColor: string;
  mode?: string;
}): void {
  if (!config.id || !config.name) return;

  const recent = getStorageItem<RecentConnection[]>("recent_connections") || [];
  const existing = recent.find((conn) => conn.configId === config.id);

  // Determinar tipo de configuración
  const mode = config.mode?.toLowerCase() || "";
  let configType: "ssh" | "v2ray" | "other" = "other";
  if (mode.includes("v2ray") || mode.includes("vmess") || mode.includes("vless")) {
    configType = "v2ray";
  } else if (mode.includes("ssh") || mode.includes("proxy") || mode.includes("socks")) {
    configType = "ssh";
  }

  if (existing) {
    // Actualizar conexión existente
    existing.lastConnected = Date.now();
    existing.successCount += 1;
    existing.configName = config.name; // Actualizar nombre por si cambió
    existing.categoryName = config.categoryName;
    existing.categoryColor = config.categoryColor;
    existing.configType = configType;
  } else {
    // Agregar nueva conexión
    recent.push({
      configId: config.id,
      configName: config.name,
      categoryId: config.category_id,
      categoryName: config.categoryName,
      categoryColor: config.categoryColor,
      lastConnected: Date.now(),
      successCount: 1,
      configType,
    });
  }

  // Mantener solo las últimas 20 conexiones más usadas
  const updated = recent
    .sort((a, b) => b.lastConnected - a.lastConnected)
    .slice(0, 20);

  setStorageItem("recent_connections", updated);
}

// Limpiar historial de conexiones recientes
export function clearRecentConnections(): void {
  localStorage.removeItem(`${STORAGE_PREFIX}recent_connections`);
}

// Obtener conexiones recientes filtradas por tipo
export function getRecentConnectionsByType(type: "ssh" | "v2ray" | "all"): RecentConnection[] {
  const recent = getRecentConnections();
  if (type === "all") return recent;
  return recent.filter((conn) => conn.configType === type);
}

// Verificar si una configuración está en el historial reciente
export function isRecentConnection(configId: number): boolean {
  const recent = getRecentConnections();
  return recent.some((conn) => conn.configId === configId);
}

// Funciones para gestionar la pantalla de bienvenida
export function resetWelcomeScreen(): void {
  // Función para desarrollo/testing - resetea la pantalla de bienvenida
  localStorage.removeItem(`${STORAGE_PREFIX}app-welcome-completed`);
  localStorage.removeItem(`${STORAGE_PREFIX}user-has-account`);
  localStorage.removeItem(`${STORAGE_PREFIX}user-guest-mode`);
  localStorage.removeItem(`${STORAGE_PREFIX}terms-accepted-23-03-2025`);
  localStorage.removeItem(`${STORAGE_PREFIX}privacy-accepted-23-03-2025`);
}

export function hasCompletedWelcome(): boolean {
  return getStorageItem<boolean>("app-welcome-completed") || false;
}

export function getUserOnboardingStatus(): {
  hasAccount: boolean;
  isGuest: boolean;
  welcomeCompleted: boolean;
} {
  return {
    hasAccount: getStorageItem<boolean>("user-has-account") || false,
    isGuest: getStorageItem<boolean>("user-guest-mode") || false,
    welcomeCompleted: hasCompletedWelcome(),
  };
}
