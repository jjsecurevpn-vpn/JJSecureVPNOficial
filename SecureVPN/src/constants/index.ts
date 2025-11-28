// Constantes de la aplicación

export const MINIMUM_REQUIRED_VERSION = '4.5.8';
export const DOWNLOAD_URL_APK = 'https://jhservices.com.ar/secure/SecureTunnel_v4.5.8.apk';
export const DOWNLOAD_URL_SITE = 'https://jhservices.com.ar/loja';
export const UPDATE_TITLE = 'Actualización obligatoria';

export const LS_KEYS = {
  user: 'vpn_user',
  pass: 'vpn_pass',
  uuid: 'vpn_uuid',
  auto: 'vpn_auto_on',
  terms: 'vpn_terms_accepted',
} as const;

export const SCREENS = ['home', 'servers', 'menu', 'logs', 'terms', 'account'] as const;

