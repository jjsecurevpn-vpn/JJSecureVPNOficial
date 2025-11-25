# Sistema de Diseño - Guía de Uso

## 🎨 Paleta de Colores

### Fondos
- **Principal**: `#1a1a24` - Pantallas principales
- **Tarjetas/Paneles**: `#23232f` -```tsx
import { useResponsiveValue } from '../hooks/useResponsiveScale';

function MyComponent() {tenedores y cards
- **Superficie elevada**: `#2d2d3a` - Hover y estados elevados

### Texto
- **Fuerte**: `#ffffff` - Títulos y texto principal
- **Normal**: `#e6e6eb` - Texto de cuerpo
- **Secundario**: `#b3b3ba` - Texto secundario
- **Deshabilitado**: `#7a7a85` - Estados disabled

### Colores de Marca
- **Morado principal**: `#6d4aff`
- **Morado fuerte**: `#4c1d95`
- **Morado suave**: `#b49dff`

### Colores de Acento (VPN)
- **Verde principal**: `#00b96b`
- **Verde fuerte**: `#008f51`
- **Verde suave**: `#6fe1b3`

## 📝 Tipografía

### Familias
- **Títulos**: ABC Arizona Flare
- **Cuerpo/UI**: ABC Arizona Sans
- **Fallbacks**: Inter, Roboto, system-ui

### Uso en Componentes

```tsx
import { Text } from '../components/ui';

// Títulos
<Text variant="h1" as="h1">Título Principal</Text>
<Text variant="h2" as="h2">Subtítulo</Text>

// Cuerpo
<Text variant="body">Texto normal</Text>
<Text variant="bodySmall" color="secondary">Texto secundario</Text>

// Etiquetas
<Text variant="label" color="accent">Etiqueta</Text>
```

## 🧩 Componentes Básicos

### Botones

```tsx
import { Button } from '../components/ui';

// Primario
<Button variant="primary">Conectar VPN</Button>

// Secundario
<Button variant="secondary">Cancelar</Button>

// Outline
<Button variant="outline">Más opciones</Button>
```

### Tarjetas

```tsx
import { Card } from '../components/ui';

// Card básica
<Card>
  <Text variant="h3">Contenido</Text>
</Card>

// Card interactiva
<Card variant="interactive" onClick={handleClick}>
  Contenido clickeable
</Card>

// Card seleccionada
<Card variant="selected">
  Opción seleccionada
</Card>
```

### Inputs

```tsx
import { Input } from '../components/ui';

// Input básico
<Input 
  placeholder="Buscar servidores..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// Input con label
<Input 
  label="Email"
  type="email"
  fullWidth
/>

// Input con error
<Input 
  label="Password"
  type="password"
  error="La contraseña es requerida"
/>
```

## 🎨 Sistema de Espaciado

Usa la escala de 8pt (múltiplos de 8):

```tsx
import { spacing } from '../constants/theme';

// 4, 8, 12, 16, 20, 24, 32, 40
const styles = {
  padding: spacing.lg,        // 16px
  margin: spacing['2xl'],     // 24px
  gap: spacing.xl,           // 20px
};
```

## 🌊 Animaciones

```tsx
import { animations } from '../constants/animations';

const styles = {
  transition: animations.transition.hover,  // 200ms para hover
  transition: animations.transition.micro,  // 150ms para micro
  transition: animations.transition.modal,  // 250ms para modales
};
```

## 🎯 Estados Interactivos

### Hover
- Elevar superficie al fondo hover
- Aumentar 4-8% el brillo del color base

### Focus
- Contorno 2px en marca o acento
- Buen contraste para accesibilidad

### Active/Pressed
- Bajar brillo 6-10%
- Reducir elevación

### Disabled
- Opacidad 40-50%
- Sin sombra ni efectos hover

## ⚙️ Utilidades Normalizadas (Tailwind + Clases Compuestas)

Estas clases viven en `src/index.css` bajo `@layer components` y reemplazan estilos inline / hex repetidos.

### Tarjetas
- `card-base`: Base para todas las cards (fondo surface, borde, sombra, padding estándar)
- `card-skeleton`: Igual que card-base pero con `animate-pulse`
- `selectable-card`: Card interactiva (hover + transición)
- `selectable-card-active`: Estado seleccionado (border + bg brand suave)

### Botones
- `btn-action`: Acción primaria (marca)
- `btn-danger`: Acción destructiva
- `btn-neutral`: Acción secundaria neutra
- `btn-sm-action` / `btn-sm-neutral`: Variantes compactas (altura 44px/45px aprox.)
- `icon-btn` / `icon-btn-sm`: Botones sólo icono (normal y compacto)

### Badges / Chips
- `badge-*` (brand|success|warn|danger): Outline fino
- `badge-soft-*` / `badge-outline-*`: Variantes rellenas suaves u outline normalizado
- `chip-soft-*`: Chips suaves (success, brand)

### Inputs
- `input-base`: Campo de texto base (usa tokens, sin hex inline)
- `input-valid` / `input-error` / `input-brand`: Estados de validación

### Interacciones
- `interactive-base`: Transiciones base
- `btn-hover-pop`: Elevación + translate en hover
- `btn-press`: Compresión sutil al presionar
- `surface-click`: Fondo hover/active para superficies neutrales
- `focus-ring` / `focus-ring-soft` / `focus-ring-danger` / `focus-ring-success`: Variantes de anillo de enfoque

### Icon Sizes
- `icon-xs|sm|md|lg`: Dimensiones fijas consistentes

### Spinners
- `spinner-sm|md`: Spinners predefinidos (usa brand + brand-accent)

### Fondos
- `bg-app-gradient`: Gradiente diagonal principal
- `bg-root-gradient`: Gradiente vertical raíz (pantallas / body)

## 🧪 Convenciones
- Evitar hex directos: preferir tokens (`text-neutral-text`, `bg-surface-border`, `border-surface-line`, etc.)
- Si un patrón se repite ≥3 veces, evaluarlo para nueva clase compuesta.
- Prefijo semántico > color directo (ej: `text-neutral-strong` mejor que `text-white`).

## 🚀 Próximos Ajustes Sugeridos
- Sustituir gradientes inline específicos repetidos por utilidades si aparecen en >1 componente.
- Unificar contenedores seleccionables existentes (PlanSelector, CategoryCard) con `selectable-card` si aplica.
- Segmentar documentación histórica obsoleta (componentes Button/Input antiguos) a un archivo LEGACY.md.

## 📱 Sistema Responsivo

### Hook useResponsive

```tsx
import { useResponsive } from '../hooks/useResponsive';

function MyComponent() {
  const { breakpoint, isSmall, isLarge, isTouchDevice } = useResponsive();
  
  return (
    <div>
      <Text variant={isSmall ? 'bodySmall' : 'body'}>
        Contenido adaptivo
      </Text>
    </div>
  );
}
```

### Componentes Responsivos

#### ResponsiveContainer
```tsx
import { ResponsiveContainer } from '../components/ui';

// Container básico con espaciado automático
<ResponsiveContainer variant="container">
  <Text>Contenido</Text>
</ResponsiveContainer>

// Modal con scroll automático
<ResponsiveContainer 
  variant="modal" 
  enableScroll 
  maxHeight="80vh"
>
  <Text>Contenido largo...</Text>
</ResponsiveContainer>

// Sección con espaciado de sección
<ResponsiveContainer variant="section">
  <Text>Sección</Text>
</ResponsiveContainer>
```

#### ResponsiveStack
```tsx
import { ResponsiveStack } from '../components/ui';

// Stack vertical con espaciado automático
<ResponsiveStack spacing="lg" align="center">
  <Button>Botón 1</Button>
  <Button>Botón 2</Button>
  <Button>Botón 3</Button>
</ResponsiveStack>
```

### Breakpoints

- **xs**: 280px+ (Dispositivos muy pequeños)
- **sm**: 360px+ (Dispositivos pequeños estándar) 
- **md**: 450px+ (Dispositivos medianos)
- **lg**: 500px+ (Dispositivos grandes)
- **xl**: 600px+ (Tablets pequeñas)

### Estados Responsivos

```tsx
const { 
  isSmall,    // <= 450px
  isMedium,   // 450-500px  
  isLarge,    // >= 500px
  isXSmall,   // <= 280px
  isPortrait,
  isLandscape,
  isTouchDevice 
} = useResponsive();
```

### Valores Responsivos

```tsx
import { useResponsiveValue } from '../hooks/useResponsiveScale';

// Obtener valores diferentes por breakpoint
const fontSize = useResponsiveValue({
  xs: '14px',
  sm: '16px',
  lg: '18px'
});
```

## 🌊 Manejo de Overflow

### Scroll Automático
Los componentes `ResponsiveContainer` con `enableScroll={true}` incluyen:
- Scroll suave
- Scrollbars estilizados para dark theme
- Overflow handling automático

### Prevención de Overflow
- Texto con truncado automático en pantallas pequeñas
- Espaciado adaptivo según el breakpoint
- Alturas máximas responsivas para modales

## 📱 Responsividad

Las tipografías se ajustan automáticamente:
- **Desktop**: Escalas más grandes
- **Mobile**: Escalas optimizadas para pantallas pequeñas

## 🛠️ Uso del Sistema Completo

```tsx
// Importar todo el sistema
import { 
  colors, 
  spacing, 
  borderRadius, 
  textStyles 
} from '../constants/designSystem';

// O importar componentes directamente
import { Button, Card, Text, Input } from '../components/ui';
```

## ♿ Accesibilidad

- Contraste mínimo: 4.5:1 para texto normal
- Contraste recomendado: 7:1 para mejor legibilidad
- Focus visible con contornos claros
- Estados disabled claramente identificables
