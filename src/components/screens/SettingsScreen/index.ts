/**
 * @file index.ts
 * @description Barrel export para SettingsScreen y sus componentes
 */

// Componente principal
export { SettingsScreen } from "./SettingsScreen.tsx";

// Tipos
export * from "./types.ts";

// Utilidades
export * from "./utils/menuData.tsx";

// Hooks
export * from "./hooks/useSettingsScreen.ts";

// Componentes
export * from "./components/AccountSection.tsx";
export * from "./components/MenuSection.tsx";
export * from "./components/MenuItem.tsx";
export * from "./components/FooterSection.tsx";
