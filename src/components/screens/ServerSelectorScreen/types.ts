/**
 * @file types.ts
 * @description Tipos para ServerSelectorScreen y sus componentes
 */

import { ConfigCategory, ConfigItem } from "../../../types/config";

export interface ServerSelectorScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ServerHeaderProps {
  selectedCategory: ConfigCategory | null;
  setSelectedCategory: (category: ConfigCategory | null) => void;
  statusBarHeight: number;
  headerTitle: string;
  useNativeSelector?: boolean;
  onToggleNativeSelector?: () => void;
}

export interface CategoryViewProps {
  activeConfig: ConfigItem | null;
  activeCategory: ConfigCategory | null;
  query: string;
  setQuery: (query: string) => void;
  filteredCategories: ConfigCategory[];
  handleCategorySelect: (category: ConfigCategory) => void;
  normalizeColor: (color: string) => string;
  loadingCategoryId: number | null;
}

export interface ServerViewProps {
  query: string;
  setQuery: (query: string) => void;
  groupedItems: Group<ConfigItem>[];
  activeConfig: ConfigItem | null;
  pendingConfigId: number | null;
  toggleGroup: (groupKey: string) => void;
  isGroupExpanded: (groupKey: string) => boolean;
  handleConfigSelect: (config: ConfigItem) => void;
  // Navegación remota opcional
  onRegisterFocusable?: (el: HTMLElement | null, meta: { index: number; col: number; row: number; role?: string }) => void;
  baseIndex?: number;
  baseCol?: number;
  navActive?: boolean;
  focusedIndex?: number;
  // TV Mode compactación
  isTv?: boolean;
  compact?: boolean;
  fontSize?: 'small' | 'base' | 'large';
}

export interface LoadingViewProps {
  loading: boolean;
  hasConfigs: boolean;
  handleUpdate: () => void;
}

// Re-export tipos necesarios
export interface Group<T> {
  key: string;
  title: string;
  description?: string;
  items: T[];
}
