import { useState } from 'react';
import { useVpn } from '../context/VpnContext';
import { useSafeArea } from '../hooks/useSafeArea';
import { formatProtocol } from '../utils/formatUtils';
import type { Category, ServerConfig } from '../types';

const SUBCATEGORY_KEYWORDS = [
  { key: 'PRINCIPAL', label: 'Principal' },
  { key: 'JUEGOS', label: 'Juegos' },
  { key: 'STREAM', label: 'Streaming' },
  { key: 'SOCIAL', label: 'Social' },
];
const DEFAULT_SUBCATEGORY = 'Otros';

const resolveSubcategory = (name?: string | null): string => {
  if (!name) return DEFAULT_SUBCATEGORY;
  const upper = name.toUpperCase();
  const match = SUBCATEGORY_KEYWORDS.find(({ key }) => upper.includes(key));
  return match ? match.label : DEFAULT_SUBCATEGORY;
};

const orderSubcategories = (labels: string[]): string[] => {
  const order = SUBCATEGORY_KEYWORDS.map(({ label }) => label);
  return labels.sort((a, b) => {
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    const rankA = idxA === -1 ? order.length : idxA;
    const rankB = idxB === -1 ? order.length : idxB;
    if (rankA === rankB) return a.localeCompare(b);
    return rankA - rankB;
  });
};

interface ServersScreenProps {
  onShowToast: (msg: string) => void;
  autoMode: boolean;
}

export function ServersScreen({ onShowToast, autoMode }: ServersScreenProps) {
  const { categorias, config: currentConfig, setConfig, setScreen, startAutoConnect, loadCategorias } = useVpn();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { statusBarHeight, navigationBarHeight } = useSafeArea();
  const sectionStyle = {
    paddingTop: `calc(${statusBarHeight}px + 16px)`,
    paddingBottom: `calc(${navigationBarHeight}px + 24px)`,
  };

  // Refresh on mount
  useState(() => { loadCategorias(); });

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
  };

  const handleServerClick = (srv: ServerConfig, cat: Category) => {
    if (autoMode) {
      startAutoConnect(cat);
      onShowToast(`Auto: probando ${cat.name || 'categoría'}`);
      return;
    }
    setConfig(srv);
    setScreen('home');
    onShowToast('Servidor seleccionado');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  return (
    <section className="screen" style={sectionStyle}>
      <div className="section-header">
        <div className="panel-title">{selectedCategory ? selectedCategory.name : 'Servidores'}</div>
        {selectedCategory && (
          <div className="category-backlink" onClick={handleBackToCategories}>
            <i className="fa fa-chevron-left" aria-hidden="true" />
            Volver a categorías
          </div>
        )}
      </div>

      <div>
        {!selectedCategory ? (
          // Lista de categorías
          categorias.length === 0 ? (
            <div className="pad">
              Ningún servidor disponible.
              <br />
              <small className="muted">Verifica si las configs fueron cargadas</small>
            </div>
          ) : (
            <div className="category-list">
              {categorias.map((cat) => (
                cat.items?.length ? (
                  <div
                    key={cat.name}
                    className="list-item category-list-item"
                    onClick={() => handleCategoryClick(cat)}
                  >
                    <div className="li-left">
                      <strong>{cat.name}</strong>
                      <small>{cat.items.length} servidores</small>
                    </div>
                    <div className="li-right">
                      <i className="fas fa-chevron-right" />
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          )
        ) : (
          // Lista de servidores de la categoría
          (() => {
            const groupMap = new Map<string, ServerConfig[]>();
            selectedCategory.items?.forEach((srv) => {
              const label = resolveSubcategory(srv.name);
              const list = groupMap.get(label) || [];
              list.push(srv);
              groupMap.set(label, list);
            });
            const orderedLabels = orderSubcategories(Array.from(groupMap.keys()));
            return orderedLabels.map((label) => (
              <div key={label} className="subcategory-block">
                <div className="subcategory-title">{label}</div>
                {groupMap.get(label)?.map((srv) => (
                  <div
                    key={srv.id}
                    className={`server-item ${currentConfig?.id === srv.id ? 'selected' : ''}`}
                    onClick={() => handleServerClick(srv, selectedCategory)}
                  >
                    <div className="item-main">
                      <div className="name">{srv.name}</div>
                      <div className="meta">{formatProtocol(srv.mode) || srv.mode} • {srv.description || ''}</div>
                    </div>
                  </div>
                ))}
              </div>
            ));
          })()
        )}
      </div>
    </section>
  );
}
