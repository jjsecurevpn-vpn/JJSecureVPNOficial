export function openApnSettings(): void {
  if (window?.DtStartApnActivity?.execute && typeof window.DtStartApnActivity.execute === 'function') {
    window.DtStartApnActivity.execute();
  }
}