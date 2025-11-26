/**
 * @file serverGrouping.ts
 * @description Utilidades para agrupar servidores por subcategorías
 */

// Tipos para agrupación
export type GroupMeta = { 
  key: string; 
  title: string; 
  description?: string; 
  order: number; 
};

export type Group<T = Record<string, unknown>> = GroupMeta & { items: T[] };

export type SubcategorySpec = {
  key: string;
  title: string;
  description?: string;
  order: number;
  match: (name: string, desc: string) => boolean | number;
};

// Función para obtener traducciones de subcategorías
export const getSubcategoryTranslations = (t?: Record<string, unknown>) => {
  const translations = t?.serverSelectorScreen as Record<string, unknown> | undefined;
  const subcategories = translations?.subcategories as Record<string, Record<string, string | undefined>> | undefined;
  
  return {
    "premium-ssh": {
      title: (subcategories?.premiumSsh?.title as string | undefined) || "🏆 PRINCIPAL",
      description: (subcategories?.premiumSsh?.description as string | undefined) || "Configuración recomendada • Internet ilimitado",
    },
    "premium-cm": {
      title: (subcategories?.premiumCm?.title as string | undefined) || "CONGELA MEGAS",
      description: (subcategories?.premiumCm?.description as string | undefined) || "Usar con precaución",
    },
    "udp-hysteria": {
      title: (subcategories?.udpHysteria?.title as string | undefined) || "UDP HYSTERIA",
      description: (subcategories?.udpHysteria?.description as string | undefined) || "Protocolo UDP optimizado",
    },
    "premium-vpn": {
      title: (subcategories?.premiumVpn?.title as string | undefined) || "PREMIUM VPN",
      description: (subcategories?.premiumVpn?.description as string | undefined) || "Camuflaje de IP con datos",
    },
    "premium-dns": {
      title: (subcategories?.premiumDns?.title as string | undefined) || "PREMIUM DNS",
      description: (subcategories?.premiumDns?.description as string | undefined) || "Sin Anuncios",
    },
    "premium-games": {
      title: (subcategories?.premiumGames?.title as string | undefined) || "PREMIUM GAMES",
      description: (subcategories?.premiumGames?.description as string | undefined) || "Soporte para Juegos",
    },
    "otros": {
      title: (subcategories?.others?.title as string | undefined) || "Otros",
      description: undefined,
    }
  };
};

// Especificaciones de subcategorías PREMIUM (con traducciones por defecto)
export const getSubcategorySpecs = (t?: Record<string, unknown>): SubcategorySpec[] => {
  const translations = getSubcategoryTranslations(t);
  
  return [
    {
      key: "premium-ssh",
      title: translations["premium-ssh"].title,
      description: translations["premium-ssh"].description,
      order: 10,
      match: (n, d) => {
        const rx = /premium\s*#\s*(\d+)/i;
        const m = rx.exec(n) || rx.exec(d);
        return m ? Number(m[1]) : false;
      },
    },
    {
      key: "premium-cm",
      title: translations["premium-cm"].title,
      description: translations["premium-cm"].description,
      order: 20,
      match: (n, d) => /congela\s*megas/i.test(n) || /congela\s*megas/i.test(d),
    },
    {
      key: "udp-hysteria",
      title: translations["udp-hysteria"].title,
      description: translations["udp-hysteria"].description,
      order: 30,
      match: (n, d) => /udp\s*hysteria/.test(n) || /hysteria/.test(n) || /udp\s*hysteria/.test(d) || /hysteria/.test(d),
    },
    {
      key: "premium-vpn",
      title: translations["premium-vpn"].title,
      description: translations["premium-vpn"].description,
      order: 40,
      match: (n, d) => /premium\s*vpn/.test(n) || /\bsolo\s*vpn\b/.test(d),
    },
    {
      key: "premium-dns",
      title: translations["premium-dns"].title,
      description: translations["premium-dns"].description,
      order: 50,
      match: (n, d) => /premium\s*dns/.test(n) || /dns\s*sin\s*ads|sin\s*anuncios|ad\s*block/.test(d),
    },
    {
      key: "premium-games",
      title: translations["premium-games"].title,
      description: translations["premium-games"].description,
      order: 60,
      match: (n, d) => /premium\s*games?/.test(n) || /\bjuegos?\b|\bgaming\b|\bgames?\b/.test(d),
    },
  ];
};

// Especificaciones por defecto (mantener compatibilidad)
export const SUBCATEGORY_SPECS: SubcategorySpec[] = getSubcategorySpecs();

// Función para clasificar un item en una subcategoría
export const classifyItem = <T extends { name?: string; description?: string }>(
  item: T,
  specs?: SubcategorySpec[],
  t?: Record<string, unknown>
): GroupMeta => {
  const translations = getSubcategoryTranslations(t);
  const useSpecs = specs || getSubcategorySpecs(t);
  const name = String(item.name || "").toLowerCase();
  const desc = String(item.description || "").toLowerCase();

  for (const spec of useSpecs) {
    const matched = spec.match(name, desc);
    if (matched !== false) {
      return { 
        key: spec.key, 
        title: spec.title, 
        description: spec.description, 
        order: spec.order 
      };
    }
  }
  return { 
    key: "otros", 
    title: translations["otros"].title, 
    order: 100 
  };
};

// Función para agrupar items por subcategorías
export const groupItemsByCategory = <T extends { name?: string; description?: string }>(
  items: T[],
  specs?: SubcategorySpec[],
  t?: Record<string, unknown>
): Group<T>[] => {
  const useSpecs = specs || getSubcategorySpecs(t);
  const map = new Map<string, Group<T>>();
  
  for (const item of items) {
    const meta = classifyItem(item, useSpecs, t);
    const existing = map.get(meta.key);
    if (existing) {
      existing.items.push(item);
    } else {
      map.set(meta.key, { 
        key: meta.key, 
        title: meta.title, 
        description: meta.description, 
        order: meta.order, 
        items: [item] 
      });
    }
  }

  // Ordenar grupos por order y luego por título
  return Array.from(map.values()).sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
};

// Función auxiliar para extraer número premium de un item
export const extractPremiumNumber = <T extends { name?: string; description?: string }>(
  item: T
): number => {
  const name = String(item.name || "");
  const desc = String(item.description || "");
  const rx = /premium\s*#\s*(\d+)/i;
  const match = rx.exec(name) || rx.exec(desc);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};
