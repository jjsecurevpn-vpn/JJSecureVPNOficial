# Sistema Responsivo Unificado

Este sistema reemplaza a:
- `hooks/useResponsive.ts`
- `hooks/useResponsiveScale.ts`
- `utils/responsiveScale.ts`
- Parte de `constants/responsiveLayout.ts`

## Objetivos
- Un único origen de verdad para **breakpoints**, **tokens** y **escalado**.
- API simple y memorable.
- Reducir archivos y duplicaciones.
- Facilitar ajustes: editar solo TOKENS o FACTORES.

## Uso Básico
```tsx
import { UnifiedResponsiveProvider, useResponsiveUI } from '../responsive/unifiedResponsive';

// En tu root (por ejemplo main.tsx)
<UnifiedResponsiveProvider>
  <App />
</UnifiedResponsiveProvider>

// En un componente
function Card() {
  const { bp, flags, tokens, scale, spacePx, fontPx, value } = useResponsiveUI();
  return (
    <div style={{
      padding: spacePx(4),
      fontSize: fontPx('body'),
      minHeight: tokens.height.button,
    }}>
      Breakpoint actual: {bp} {flags.gteMd && '(>= md)'}
    </div>
  );
}
```

## API del Hook `useResponsiveUI()`
Devuelve:
- Dimensiones: `width`, `height`, `bp`
- Flags: `isPortrait`, `isLandscape`, `isTouch`
- Flags derivados: `flags.xs|sm|md|lg|xl|ltMd|gteMd|gteLg`
- Tokens actuales: `tokens.font`, `tokens.spacing`, `tokens.height`
- Helpers:
  - `scale(category, number)` donde category = `text|icon|button|spacing|component`
  - `scaleStyles(styles, category?)`
  - `spacePx(mult)` -> spacing unit escalado * mult
  - `fontPx(token)` -> tamaño de fuente en px (h1,h2,h3,body,caption)
  - `value(map, fallback?)` -> selecciona valor según breakpoint

## Ejemplos
```tsx
const { scale, scaleStyles, tokens } = useResponsiveUI();
const iconSize = scale('icon', 24); // retorna número escalado
const buttonStyles = scaleStyles({ padding: 12, fontSize: 14 }, 'button');
```

```tsx
// Valores responsivos declarativos
const columns = value({ xs: 1, sm: 2, md: 3, lg: 4 }, 1);
```

## Migración rápida
| Antes | Después |
|-------|---------|
| `useResponsive()` | `useResponsiveUI()` |
| `useResponsiveScale({ type: 'text' })` | `const { scale } = useResponsiveUI(); scale('text', base)` |
| `useResponsiveValue(map)` | `useResponsiveValue(map)` (nuevo export) |
| `getResponsiveFontSize` | `fontPx(token)` o `scale('text', px)` |
| `getResponsiveSpacing` | `spacePx(mult)` o `scale('spacing', px)` |

## Personalización
- Editar factores en `SCALE_MAP` para alterar escalado por tipo.
- Editar tokens base en `BASE_TOKENS` para spacing/fonts/heights.

## Limpieza futura
Una vez adaptados todos los componentes:
1. Eliminar archivos legacy mencionados arriba.
2. Buscar usos de `useResponsive` y reemplazar.
3. Ajustar documentación externa.

--
Cualquier duda o ajuste adicional: editar este README o `unifiedResponsive.tsx`.
