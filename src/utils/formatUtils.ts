/**
 * @file formatUtils.ts
 * @description Utilidades comunes de formateo para evitar duplicación
 */

/**
 * Formatea bytes a una representación legible
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Formatea duración en milisegundos a formato legible
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Formatea velocidad de red
 */
export function formatSpeed(bytesPerSecond: number): string {
  return formatBytes(bytesPerSecond) + "/s";
}

/**
 * Formatea timestamp a hora legible
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString();
}

/**
 * Formatea porcentaje
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%";
  const percentage = Math.round((value / total) * 100);
  return `${percentage}%`;
}
