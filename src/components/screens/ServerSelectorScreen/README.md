# ServerSelectorScreen Component

Componente de pantalla de selección de servidores refactorizado en una estructura modular y mantenible.

## Estructura

```
ServerSelectorScreen/
├── index.ts                      # Barrel exports
├── types.ts                      # Definiciones de tipos TypeScript
├── ServerSelectorScreen.tsx      # Componente principal
├── README.md                     # Documentación
├── components/                   # Componentes específicos
│   ├── ServerHeader.tsx          # Header con navegación y título
│   ├── CategoryView.tsx          # Vista de listado de categorías
│   ├── ServerView.tsx            # Vista de listado de servidores
│   └── LoadingView.tsx           # Estados de carga y error
├── hooks/                        # Hooks personalizados
│   └── useServerSelectorScreen.ts # Lógica principal del componente
└── utils/                        # Utilidades y datos
    └── serverUtils.tsx           # Utilidades específicas del servidor
```

## Componentes

### ServerSelectorScreen (Principal)
- Componente principal que orquesta toda la pantalla
- Maneja el estado general y la navegación entre vistas
- Renderiza el layout base y delega contenido a subcomponentes

### ServerHeader
- Header con botón de retroceso y título dinámico
- Maneja la navegación entre vista de categorías y servidores
- Adaptado a safe areas del dispositivo

### CategoryView
- Vista de listado de categorías de servidores
- Incluye buscador y tarjeta de servidor activo
- Maneja la selección de categorías

### ServerView
- Vista de listado de servidores dentro de una categoría
- Agrupación inteligente con servidores premium destacados
- Grupos colapsables para mejor organización
- Búsqueda dentro de servidores

### LoadingView
- Estados de carga con indicadores visuales
- Estado vacío con acciones para actualizar
- Manejo centralizado de estados de error

## Hooks

### useServerSelectorScreen
- Hook principal que maneja toda la lógica del componente
- Gestión de estado de configuraciones y selección
- Integración con contextos de configuración activa
- Manejo de efectos y computaciones complejas
- Estados de UI como grupos expandidos y búsquedas

## Utilidades

### serverUtils.tsx
- Re-exports de utilidades de servidor existentes
- Funciones auxiliares específicas del componente
- Cálculos de layout y UI

## Tipos

Todas las interfaces TypeScript están definidas en `types.ts` para mantener consistencia y facilitar mantenimiento.

## Uso

```typescript
import { ServerSelectorScreen } from './components/screens/ServerSelectorScreen';

// En el componente padre
<ServerSelectorScreen
  isOpen={isServerSelectorOpen}
  onClose={() => setIsServerSelectorOpen(false)}
/>
```

## Funcionalidades Principales

### 🔍 Búsqueda Inteligente
- Búsqueda en tiempo real con debounce
- Filtrado por categorías y servidores
- Reseteo automático al cambiar contexto

### 🏆 Grupos Dinámicos
- Servidores premium destacados automáticamente
- Grupos colapsables para mejor organización
- Ordenamiento inteligente por tipo y número

### 📱 Responsive & Mobile
- Adaptado para dispositivos móviles
- Safe areas para Android
- Optimizado para pantallas táctiles

### ⚡ Performance
- Memoización de computaciones pesadas
- Efectos optimizados con cleanup
- Estados derivados eficientes

## Beneficios de esta estructura

1. **Mantenibilidad**: Cada componente tiene una responsabilidad específica
2. **Reutilización**: Componentes pueden reutilizarse en otros contextos
3. **Testeo**: Cada parte puede testearse independientemente
4. **Legibilidad**: Código más limpio y fácil de entender
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades
6. **Performance**: Mejor control de re-renders y optimizaciones
