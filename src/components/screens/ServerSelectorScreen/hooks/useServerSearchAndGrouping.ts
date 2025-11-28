import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfigCategory, ConfigItem } from '../../../../types/config';
import { filterByQuery } from '../../../../utils/serverUtils';
import {
  extractPremiumNumber,
  getSubcategorySpecs,
  groupItemsByCategory,
  Group,
} from '../../../../utils/serverGrouping';
import type { Translations } from '../../../../translations/types';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

interface UseServerSearchAndGroupingParams {
  selectedCategory: ConfigCategory | null;
  t: Translations;
}

export function useServerSearchAndGrouping({ selectedCategory, t }: UseServerSearchAndGroupingParams) {
  const [query, setQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ 'premium-ssh': true });
  const debouncedQuery = useDebouncedValue(query.trim(), 250);

  const filteredItems = useMemo<ConfigItem[]>(() => {
    if (!selectedCategory) return [];
    return filterByQuery(selectedCategory.items, debouncedQuery);
  }, [debouncedQuery, selectedCategory]);

  const groupedItems = useMemo<Group<ConfigItem>[]>(() => {
    const translationRecord = t as unknown as Record<string, unknown>;
    const specs = getSubcategorySpecs(translationRecord);
    const groups = groupItemsByCategory<ConfigItem>(filteredItems, specs, translationRecord);
    groups.forEach((group) => {
      group.items.sort((a, b) => {
        if (group.key === 'premium-ssh') {
          return extractPremiumNumber(a) - extractPremiumNumber(b);
        }
        return (a.name || '').localeCompare(b.name || '');
      });
    });
    return groups;
  }, [filteredItems, t]);

  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  }, []);

  const isGroupExpanded = useCallback(
    (groupKey: string) => expandedGroups[groupKey] ?? false,
    [expandedGroups]
  );

  return {
    query,
    setQuery,
    groupedItems,
    filteredItems,
    expandedGroups,
    toggleGroup,
    isGroupExpanded,
  } as const;
}
