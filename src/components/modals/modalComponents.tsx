import React from "react";

// import { Support } from "./Support"; // Removido - ahora se usa webview nativo
import { Hotspot } from "./Hotspot";
// import { Terms } from "./Terms"; // Removido - ahora se usa webview nativo
// import { Privacy } from "./Privacy"; // Removido - ahora se usa webview nativo
import { CleanDataConfirm } from "./CleanDataConfirm";

import { MissingConfigWarningModal } from "./MissingConfigWarningModal";
import { DownloadModal } from "./DownloadModal";
import type { ModalType } from "../../App";

export interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onNavigate?: (modal: ModalType) => void;
  notification?: {
    type: "missingcredentials" | "missingserver" | "missingsetup";
  }; // solo advertencias
}
type AllowedModals = Exclude<
  ModalType,
  | null
  | "welcome"
  | "buy"
  | "autoconnect"
  | "terms"
  | "privacy"
  | "support"
  | "checkuser"
  | "credentials"
  | "serverselector"
>;

export const modalComponents: Record<
  AllowedModals,
  React.ComponentType<ModalComponentProps>
> = {
  // support: Support, // Removido - ahora se usa webview nativo
  // terms: Terms, // Removido - ahora se usa webview nativo
  // privacy: Privacy, // Removido - ahora se usa webview nativo
  cleandata: CleanDataConfirm,
  hotspot: Hotspot,
  download: DownloadModal,
  missingcredentials: MissingConfigWarningModal,
  missingserver: MissingConfigWarningModal,
  missingsetup: MissingConfigWarningModal,
};
