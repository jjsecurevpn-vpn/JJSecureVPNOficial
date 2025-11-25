# SettingsScreen Component

Componente de pantalla de configuraciones refactorizado en una estructura modular y mantenible.

## Estructura

```
SettingsScreen/
├── index.ts                 # Barrel exports
├── types.ts                 # Definiciones de tipos TypeScript
├── SettingsScreen.tsx       # Componente principal
├── README.md               # Documentación
├── components/             # Componentes específicos
│   ├── AccountSection.tsx   # Sección de información de cuenta
│   ├── MenuSection.tsx      # Sección de categorías del menú
│   ├── MenuItem.tsx         # Componente individual de item de menú
│   └── FooterSection.tsx    # Sección de footer con enlaces legales
├── hooks/                  # Hooks personalizados
│   └── useSettingsScreen.ts # Lógica principal del componente
└── utils/                  # Utilidades y datos
    └── menuData.tsx        # Configuración de datos del menú
```

## Componentes

### SettingsScreen (Principal)
- Componente principal que orquesta toda la pantalla
- Maneja el estado general y la navegación
- Renderiza overlay, header y contenido principal

### AccountSection
- Muestra información de la cuenta del usuario
- Incluye logo de la app con efectos visuales
- Botones para planes premium y programa de revendedores
- Botón de información que abre modal premium

### MenuSection
- Renderiza las categorías del menú
- Delega el renderizado de items individuales a MenuItem

### MenuItem
- Componente individual para cada opción del menú
- Incluye icono, texto, descripción opcional y chevron
- Efectos hover y focus integrados

### FooterSection
- Enlaces a términos y condiciones y política de privacidad
- Copyright information
- Estilo consistente con el resto de la aplicación

## Hooks

### useSettingsScreen
- Maneja el estado de safe areas (status bar, navigation bar)
- Estado de scroll y modal premium
- Funciones para manejar eventos de scroll y modales

## Utilidades

### menuData.tsx
- Configuración centralizada de todas las categorías del menú
- Funciones onClick para cada item
- Iconos y textos organizados por categorías

## Tipos

Todas las interfaces TypeScript están definidas en `types.ts` para mantener consistencia y facilitar mantenimiento.

## Uso

```typescript
import { SettingsScreen } from './components/screens/SettingsScreen';

// En el componente padre
<SettingsScreen
  isOpen={isSettingsOpen}
  onClose={() => setIsSettingsOpen(false)}
  onNavigate={handleNavigation}
  onOpenPricingScreen={openPricingScreen}
/>
```

## Beneficios de esta estructura

1. **Mantenibilidad**: Cada componente tiene una responsabilidad específica
2. **Reutilización**: Componentes como MenuItem pueden reutilizarse fácilmente
3. **Testeo**: Cada componente puede testearse independientemente
4. **Legibilidad**: Código más limpio y fácil de entender
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar otros componentes

## Redesign 2025-09 (Inspiración Proton VPN)

Este rediseño se enfocó en mejorar legibilidad, jerarquía visual y claridad de acciones principales orientado a uso en móvil.

### Objetivos Clave
- Separar claramente el CTA de Upgrade Premium del resto de acciones utilitarias.
- Reducir ruido visual en la lista de configuraciones usando superficies suaves y espaciado consistente.
- Mejorar affordance de los elementos: cada item luce claramente interactivo sin sobresaturar color.
- Introducir micro-accesibilidad: roles ARIA, focus ring consistente y navegación por teclado.

### Cambios Principales
1. Nueva `PremiumUpgradeCard` reemplaza botones sueltos (planes / reseller / afiliados) con:
  - Gradiente sutil brand → accent
  - Fondo translúcido + blur ligero
  - Ícono Crown destacado dentro de figura circular
  - CTA principal (planes) + enlaces secundarios estilo texto
2. `AccountSection` simplificada: título app + botón info → card premium.
3. `MenuItem` ahora:
  - Wrapper circular para icono
  - Fondo translúcido (`--settings-surface`) y hover (`--settings-surface-hover`)
  - Borde suave escalable y chevron más sutil
  - Mejor separación tipográfica (label 14 / descripción 11.5)
4. Variables CSS nuevas en `index.css`:
  - `--settings-surface`, `--settings-surface-hover`, `--settings-surface-border`, `--settings-surface-border-strong`
5. Accesibilidad:
  - `role="list"` en contenedor de items
  - `role="listitem"` por item
  - `aria-label` semántico en la tarjeta premium

### Racional de Diseño
Inspirado en patrones de apps VPN modernas (Proton, Mullvad): capas neutrales, interacciones suaves y destacar sólo la acción estratégica (upgrade). Se evita saturación de color púrpura/verde aplicando acentos controlados.

### Próximas Mejores Opcionales
- Añadir modo translúcido dinámico según scroll.
- Suporte de toggles inline (switch) en items de configuración avanzada.
- Sistema de badges dinámicos (ej: "Nuevo", "Beta").
- Lazy loading de secciones avanzadas para reducir peso inicial.

---
Última actualización: 2025-09-14
