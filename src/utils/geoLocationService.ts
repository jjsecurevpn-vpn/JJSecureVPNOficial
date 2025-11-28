export interface GeoLocationData {
  ip: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isp?: string;
  lastUpdated: number;
}

interface GeoCacheEntry {
  data: GeoLocationData;
  timestamp: number;
}

export interface GeoFetchOptions {
  targetIP?: string;
  maxRetries?: number;
  forceRefresh?: boolean;
}

const geoCache = new Map<string, GeoCacheEntry>();
const CACHE_DURATION = 300000; // 5 minutos

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type GeoService = (ip?: string) => Promise<GeoLocationData>;

const geoServices: GeoService[] = [
  async (ip) => {
    const timestamp = Date.now();
    const url = ip
      ? `http://ip-api.com/json/${ip}?t=${timestamp}&fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query`
      : `http://ip-api.com/json/?t=${timestamp}&fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.status !== 'success') throw new Error(data.message || 'API Error');
    if (!data.lat || !data.lon) throw new Error('Datos incompletos');
    return {
      ip: data.query || ip || '',
      country: data.country || '',
      country_code: data.countryCode || '',
      region: data.regionName || '',
      city: data.city || '',
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),
      timezone: data.timezone || '',
      isp: data.isp || '',
      lastUpdated: Date.now(),
    };
  },
  async (ip) => {
    const timestamp = Date.now();
    const url = ip ? `https://ipapi.co/${ip}/json/?t=${timestamp}` : `https://ipapi.co/json/?t=${timestamp}`;
    const response = await fetch(url, { method: 'GET', cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.error || data.reason) throw new Error(data.reason || 'API Error');
    if (!data.latitude || !data.longitude) throw new Error('Datos incompletos');
    return {
      ip: data.ip || ip || '',
      country: data.country_name || '',
      country_code: data.country_code || '',
      region: data.region || '',
      city: data.city || '',
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      timezone: data.timezone || '',
      isp: data.org || '',
      lastUpdated: Date.now(),
    };
  },
  async (ip) => {
    const timestamp = Date.now();
    const url = ip ? `http://ipwhois.app/json/${ip}?t=${timestamp}` : `http://ipwhois.app/json/?t=${timestamp}`;
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data.success) throw new Error('API Error');
    if (!data.latitude || !data.longitude) throw new Error('Datos incompletos');
    return {
      ip: data.ip || ip || '',
      country: data.country || '',
      country_code: data.country_code || '',
      region: data.region || '',
      city: data.city || '',
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      timezone: data.timezone || '',
      isp: data.isp || '',
      lastUpdated: Date.now(),
    };
  },
  async () => ({
    ip: '181.1.158.192',
    country: 'Argentina',
    country_code: 'AR',
    region: 'Buenos Aires',
    city: 'Buenos Aires',
    latitude: -34.6037,
    longitude: -58.3816,
    timezone: 'America/Argentina/Buenos_Aires',
    isp: 'Proveedor Local',
    lastUpdated: Date.now(),
  }),
];

export async function fetchGeoLocationWithRetry({
  targetIP,
  maxRetries = 5,
  forceRefresh = false,
}: GeoFetchOptions = {}): Promise<GeoLocationData | null> {
  const cacheKey = targetIP || 'auto';
  const now = Date.now();
  if (!forceRefresh && geoCache.has(cacheKey)) {
    const cached = geoCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    for (const [index, service] of geoServices.entries()) {
      try {
        const result = await service(targetIP);
        if (result) {
          geoCache.set(cacheKey, { data: result, timestamp: Date.now() });
          return result;
        }
      } catch {
        if (index < geoServices.length - 1) {
          await sleep(1000);
        }
      }
    }

    if (attempt < maxRetries) {
      const delay = Math.min(2000 * 2 ** attempt, 10000);
      await sleep(delay);
    }
  }

  return null;
}

export function clearGeoLocationCache() {
  geoCache.clear();
}
