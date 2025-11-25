/**
 * @file serverUtils.ts
 * @description Utilidades reutilizables para lógica de servidores
 */

// Función para normalizar colores RGBA incorrectos
export const normalizeColor = (color: string): string => {
  if (!color || !color.startsWith("#")) return color;

  // Si es un color de 8 caracteres (#RRGGBBAA) pero está mal ordenado
  if (color.length === 9) {
    // Detectar si el alpha está al principio en lugar del final
    const hex = color.slice(1); // Quitar el #

    // Si parece que el alpha está al principio (formato incorrecto #AARRGGBB)
    if (hex.length === 8) {
      const alpha = hex.slice(0, 2);
      const rgb = hex.slice(2);

      // Reorganizar al formato correcto #RRGGBBAA
      return `#${rgb}${alpha}`;
    }
  }

  return color;
};

// Detectar protocolo desde el modo
export const getProtocol = (mode: string): string => {
  const m = mode?.toUpperCase?.() || "";
  if (!m) return "";
  if (m.startsWith("SSH")) return "SSH";
  if (m.startsWith("SSL")) return "SSL";
  if (m.startsWith("OVPN") || m.startsWith("OPENVPN")) return "OVPN";
  if (m.startsWith("V2") || m.includes("V2RAY")) return "V2RAY";
  return m;
};



// Heurística de estado basada en palabras clave
export const getStatusInfo = (name?: string, description?: string) => {
  const text = `${name || ""} ${description || ""}`.toLowerCase();
  const busy = /(busy|ocupado|congestion|congested|full|saturado|alta\s*carga|down)/.test(text);
  if (busy) {
    return {
      label: "Ocupado",
      dotClass: "bg-amber-500",
    } as const;
  }
  return {
    label: "Disponible",
    dotClass: "bg-slate-400",
  } as const;
};

// Función de filtrado genérica para búsquedas
export const filterByQuery = <T extends { name?: string; description?: string; mode?: string }>(
  items: T[],
  query: string
): T[] => {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter((item) =>
    [item.name, item.description, item.mode]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q))
  );
};

// Función para filtrar categorías que contengan items que coincidan con la búsqueda
export const filterCategoriesWithItems = <T extends { 
  name?: string; 
  items?: Array<{ name?: string; description?: string; mode?: string }> 
}>(
  categories: T[],
  query: string
): T[] => {
  const q = query.trim().toLowerCase();
  if (!q) return categories;
  
  return categories.filter((cat) => {
    if (cat.name?.toLowerCase().includes(q)) return true;
    // También filtra si algún servidor dentro coincide con la búsqueda
    return cat.items?.some((it) =>
      [it.name, it.description, it.mode]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  });
};
