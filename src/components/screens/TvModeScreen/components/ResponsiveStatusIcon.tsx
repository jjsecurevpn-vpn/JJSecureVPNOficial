
export function ResponsiveStatusIcon({ state, connected, size }: { state: string; connected: boolean; size: number }) {
  if (state === 'STOPPING') return <div className="spinner-lg" />;
  if (state === 'AUTH_FAILED' || state === 'NO_NETWORK') {
    return (
      <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: size, height: size }}>
        <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
      </svg>
    );
  }
  if (state === 'CONNECTING' || state === 'AUTH') {
    return (
      <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: size, height: size }}>
        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
      </svg>
    );
  }
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: size, height: size }}>
      {connected ? (
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.58L10,14.17L16.59,7.58L18,9L10,17Z" />
      ) : (
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.1V11.1C15.4,11.4 16,12 16,12.8V16.2C16,17.1 15.1,18 14.2,18H9.8C8.9,18 8,17.1 8,16.2V12.8C8,12 8.6,11.4 9.2,11.1V10.1C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10.1V11.1H13.5V10.1C13.5,8.7 12.8,8.2 12,8.2Z" />
      )}
    </svg>
  );
}
