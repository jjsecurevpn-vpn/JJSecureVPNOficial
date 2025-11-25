/**
 * @file index.ts
 * @description Barrel export para UserProfileScreen y sus componentes
 */

// Componente principal
export { UserProfileScreen } from "./UserProfileScreen";

// Tipos
export type { 
  UserData 
} from "./types";

// Hooks
export { useUserProfile } from "./hooks/useUserProfile";

// Componentes específicos
export { AccountPanel } from "./components/AccountPanel";
export { UserProfileHeader } from "./components/UserProfileHeader";
export { DisconnectedContent } from "./components/DisconnectedContent";
