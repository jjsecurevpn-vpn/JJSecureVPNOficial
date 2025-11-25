# JJSecure VPN WebView

Aplicación React + TypeScript construida con Vite y Tailwind, pensada para ejecutarse dentro de una Android WebView como cliente gráfico de la plataforma VPN de JJSecure. El proyecto incluye un selector de servidores optimizado para dispositivos móviles, integración con APIs nativas DTunnel y soporte multilenguaje (es/en/pt).

---

## Tabla de contenidos

- [Visión general](#visión-general)
- [Características principales](#características-principales)
- [Arquitectura y organización](#arquitectura-y-organización)
- [Contextos, hooks y utilidades clave](#contextos-hooks-y-utilidades-clave)
- [Integración con el entorno nativo](#integración-con-el-entorno-nativo)
- [Internacionalización](#internacionalización)
- [Entorno de desarrollo](#entorno-de-desarrollo)
- [Scripts disponibles](#scripts-disponibles)
- [Empaquetado inline para Android WebView](#empaquetado-inline-para-android-webview)
- [Estilos y sistema responsive](#estilos-y-sistema-responsive)
- [Buenas prácticas y pendientes](#buenas-prácticas-y-pendientes)
- [Créditos](#créditos)

---

## Visión general

- **Stack**: React 19.1 · TypeScript 5.5 · Vite 7 · Tailwind 3.4
- **Objetivo**: entregar una interfaz táctil moderna para gestionar conexiones VPN, optimizada para teléfonos y tablets Android.
- **Enfoque**: UI de una sola página con navegación por tabs, mapa interactivo de servidores en Latinoamérica, selector de servidores con bottom sheet y pantallas dedicadas para ajustes, perfil y modo TV.
- **Integración nativa**: consumo centralizado de las APIs DTunnel (`window.Dt*`) mediante `src/utils/unifiedNativeAPI.ts` y sistema de eventos unificado (`src/utils/unifiedEventsSystem.ts`).

---

## Características principales

- 🗺️ **Mapa LATAM en tiempo real** (`MapLatAmVPN`) con detección geográfica, transiciones suaves y foco automático según estado de conexión.
- 📶 **Panel inferior de conexión** (`BottomSheetServerSelector`) con validaciones de credenciales, velocidades en vivo (`useNetSpeeds`) y accesos rápidos a planes premium.
- 🧭 **Navegación por tabs** (`Footer`) con soporte para gestos de swipe (`useFooterSwipeNavigation`) y detección de modo TV.
- 🔐 **Gestión de credenciales y protocolos** integrada al flujo de conexión, con lógica para detectar credenciales embebidas y casos especiales (ej. V2Ray).
- 📂 **Pantallas dedicadas**: ajustes (`SettingsScreen`), selector de servidores (`ServerSelectorScreen`), perfil (`UserProfileScreen`), modo TV (`TvModeScreen`) y onboarding (`WelcomeScreen`).
- 📡 **Sistema VPN unificado** (`useUnifiedVpn`) para conectar, desconectar y reaccionar a cambios emitidos por DTunnel.
- 🌐 **Soporte multilenguaje** (español, inglés y portugués) gestionado por `LanguageContext` y archivos de traducciones en `src/translations`.
- 🧑‍🏫 **Tutorial contextual** (`TutorialOverlay` + `useAutoTutorial`) y recordatorios de bienvenida para nuevos usuarios.
- 📱 **Optimizaciones WebView**: bloqueo de gestos no deseados, ajuste de colores de status/navigation bar y safe areas inferidas.

---

## Arquitectura y organización

```
src/
├─ App.tsx                     # Orquestación principal: pestañas, modales y providers
├─ main.tsx                    # Entrada de la app + inicialización de eventos
├─ components/
│  ├─ BottomSheetServerSelector/  # Panel de conexión
│  ├─ MapLatAmVPN/                # Mapa interactivo
│  ├─ modals/                     # Modales reutilizables
│  ├─ screens/                    # Pantallas (Settings, Servers, Profile, Welcome, TV)
│  ├─ tutorial/                   # Overlay y dinámicas del tutorial
│  └─ ui/                         # Building blocks (botones, indicators, layouts)
├─ context/                   # Providers (config activa, idioma, tema, tutorial)
├─ hooks/                     # Hooks custom (VPN, responsive, navegación, geolocalización)
├─ responsive/                # Provider y helpers para layout adaptativo
├─ translations/              # Textos y tipos de i18n
├─ utils/                     # API nativa, eventos unificados, formatos, storage
└─ constants/                 # Config global (tema, navegación, breakpoints)
```

Otros archivos relevantes:

- `build-inline.ts`: empaquetado en un único `index.html` con CSS/JS inline para distribución rápida.
- `tailwind.config.js`: tema dark personalizado, escalas y plugins habilitados.
- `vite.config.ts`: build pensada para Android (target `es2015`, `cssCodeSplit: false`, límites de chunk).

---

## Contextos, hooks y utilidades clave

| Recurso | Propósito |
|---------|-----------|
| `ActiveConfigContext` | Comparte la configuración VPN seleccionada y permite refrescar desde nativo. |
| `LanguageContext` | Gestiona idioma actual, persistencia en `localStorage` y acceso a traducciones. |
| `ThemeContext` | Expone tokens de color y helpers para sincronizar con Tailwind.
| `TutorialContext` | Controla pasos del tutorial y estados de overlays.
| `useUnifiedVpn` | Unifica eventos DTunnel + polling ligero, expone helpers `connect` y `disconnect`.
| `useNetSpeeds` | Calcula velocidades promedio a partir de contadores nativos.
| `useAppLayout` | Ajusta paddings y safe areas según tamaño y orientación del dispositivo.
| `useAppNavigation` | Manejo del botón back de Android para tabs/modales.
| `useTranslations` | Atajo para acceder a textos traducidos.
| `storageUtils` | Persistencia local (welcome screen, conexiones recientes, etc.).

---

## Integración con el entorno nativo

Toda la comunicación con DTunnel se centraliza en `src/utils/unifiedNativeAPI.ts`:

- **`vpnAPI`**: obtener estado (`getState`), iniciar y detener conexión (`connect`, `stop`), suscribirse a cambios (`onStateChange`).
- **`configAPI`**: leer categorías y servidores, establecer la configuración activa y enriquecer datos embebidos.
- **`authAPI`**: lectura y escritura de credenciales, detección de inputs requeridos según protocolo (ej. V2Ray, Hysteria).
- **`networkAPI`**: bytes acumulados, IP local y metadatos de red para métricas.
- **`eventsAPI`**: registrar listeners nativos y limpiar suscripciones cuando corresponda.
- Helpers adicionales para hotspot, modo avión, logs, UI, información del dispositivo y sistema.

El archivo `src/utils/unifiedEventsSystem.ts` inicializa listeners globales DTunnel dentro de `main.tsx` y expone utilidades (`initializeEvents`, `useVpnStateEvent`, etc.) para integrarse con React.

---

## Internacionalización

- Idiomas soportados: **es** (por defecto), **en**, **pt**.
- Archivos de traducción en `src/translations/{es,en,pt}.ts`.
- `LanguageProvider` detecta el idioma del navegador o reusa el último guardado en `localStorage`.
- Componentes como `Header`, `Footer`, pantallas y modales consumen `useTranslations()` para obtener textos contextuales.

Para añadir un idioma:
1. Crear `src/translations/<nuevo>.ts` siguiendo la interfaz `Translations`.
2. Registrar el idioma en `src/translations/index.ts` (`translations` y `AVAILABLE_LANGUAGES`).
3. Actualizar `LanguageContext` si fuese necesario.

---

## Entorno de desarrollo

Requisitos recomendados:

- **Node.js ≥ 20.x** (React 19 + Vite 7).
- **npm** (v10+) o **bun** (hay `bun.lock`, pero los scripts están pensados para npm).
- Opcional: herramientas DTunnel/local para probar APIs nativas (se proveen mocks parciales en la capa de utilidades).

Instalación inicial:

```bash
# Clonar el repositorio

cd JJSecureVP-N_Oficial

# Instalar dependencias
npm install
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR, expuesto en la red local (`--host`). |
| `npm run build` | Compila TypeScript y genera el build de producción en `dist/`. |
| `npm run preview` | Sirve el build generado en el puerto 80 (útil para pruebas en WebView). |
| `npm run build:inline` | Ejecuta `build-inline.ts` con `tsx` para producir un `index.html` auto contenido. |

> ℹ️ Los comandos adicionales definidos en `package.json` (auditorías, limpieza, análisis) dependen de scripts que no están incluidos actualmente en `scripts/`. Verifica su presencia antes de utilizarlos o incorpora los archivos faltantes.

---

## Empaquetado inline para Android WebView

1. Ejecuta el build estándar: `npm run build`.
2. Genera la versión inline: `npm run build:inline`.
3. El script utilizará la salida de Vite y construirá un `index.html` con CSS y JS embebidos, ideal para distribuir como asset único dentro de la app Android.

El proceso utiliza `cssnano` para minificar estilos y deshabilita `cssCodeSplit` desde `vite.config.ts` para facilitar la incrustación.

---

## Estilos y sistema responsive

- **Tailwind CSS** se combina con utilidades personalizadas (`src/components/layouts`, `src/responsive`) para crear componentes con escala adaptable.
- `UnifiedResponsiveProvider` calcula breakpoints, ratios y safe areas basados en dimensiones del dispositivo.
- `Footer`, `BottomSheetServerSelector` y otros componentes consultan `useResponsive`/`useResponsiveScale` para ajustar espaciados e iconografía.
- Hojas CSS adicionales (`src/styles/animations-map.css`, `src/styles/responsive.css`) concentran animaciones del mapa y ajustes específicos para WebView.

---

## Buenas prácticas y pendientes

- Mantener la lógica de comunicación con DTunnel en `nativeAPI` y evitar llamadas directas a `window.Dt*` desde componentes.
- Al agregar nuevos modales o pantallas, registrarlos en `modalComponents` y `navigationConfig` para mantener consistencia.
- Revisar y versionar los scripts mencionados en `package.json` si son necesarios para automatizaciones futuras.
- Implementar pruebas unitarias o stories para componentes críticos (mapa, bottom sheet, pantallas principales) cuando se defina una infraestructura de testing.
- Documentar los endpoints/APIs nativos disponibles desde DTunnel conforme evolucionen.

---

## Créditos

Proyecto desarrollado por **JJSecureVPN (@JHServices)**. Diseñado para ofrecer una experiencia VPN moderna, orientada a usuarios de Android en Latinoamérica.
```typescript
