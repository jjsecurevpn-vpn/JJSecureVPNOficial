// BottomSheetServerSelector: panel superior con info servidor, estado y acciones.

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "../../hooks/useTranslations";
import { useNetSpeeds } from "../../hooks/useNetSpeeds";
import { useUnifiedVpn } from "../../hooks/useUnifiedVpn";
import { useActiveConfig } from "../../context/ActiveConfigContext";
import { nativeAPI } from "../../utils";
import { flushPendingCredentials } from "../../utils/credentialSync";
import { getNavigationBarHeight } from "../../utils/deviceUtils";

import { useBottomSheetGestures } from "./hooks";
import { ServerInfo, ConnectionButtons, SpeedStats } from "./components";
import type { ModalType } from "../../App";

interface BottomSheetServerSelectorProps {
  onNavigate?: (modal: ModalType) => void;
  onError?: (error: string | null) => void;
  /** Activa el modo compacto: textos e iconos más pequeños y menor padding */
  compact?: boolean;
  /** Permite ajustar manualmente el gap (separación) inferior cuando está en modo compacto */
  compactGap?: number;
}

// Dimensiones base mejoradas para móviles pequeños
const SHEET_DIM = {
  expandedConnected: 600,
  expandedDefault: 550,
  collapsedConnected: 250,
  collapsedDefault: 180,
  baseFooter: 64,
  gap: 8,
};

// Hook personalizado para detectar tamaño de pantalla
function useResponsiveDimensions(compact: boolean, compactGap?: number) {
  const computeDims = () => {
    if (typeof window === "undefined") {
      return {
        expandedConnected: SHEET_DIM.expandedConnected,
        expandedDefault: SHEET_DIM.expandedDefault,
        collapsedConnected: SHEET_DIM.collapsedConnected,
        collapsedDefault: SHEET_DIM.collapsedDefault,
        baseFooter: SHEET_DIM.baseFooter,
        gap: compact
          ? typeof compactGap === "number"
            ? Math.max(0, compactGap)
            : 7
          : SHEET_DIM.gap,
        isVerySmall: false,
        isSmall: false,
        liftOffset: 0,
      };
    }

    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const isVerySmall = vh < 640 || vw < 360;
    const isSmall = !isVerySmall && vh < 740;

    const widthScale = vw / 480;
    const heightScale = vh / 760;
  const rawScale = Math.min(widthScale, heightScale, 1);
  const scale = Math.max(0.75, rawScale); // evita saltos bruscos cuando el ancho cruza 360px
  const liftOffset = Math.round((1 - scale) * 120);

    return {
      expandedConnected: Math.round(SHEET_DIM.expandedConnected * scale),
      expandedDefault: Math.round(SHEET_DIM.expandedDefault * scale),
      collapsedConnected: Math.round(SHEET_DIM.collapsedConnected * scale),
      collapsedDefault: Math.round(SHEET_DIM.collapsedDefault * scale),
      baseFooter: SHEET_DIM.baseFooter,
      gap: compact
        ? typeof compactGap === "number"
          ? Math.max(0, compactGap)
          : 7
        : SHEET_DIM.gap,
      isVerySmall,
      isSmall,
      liftOffset,
    };
  };

  const [dims, setDims] = useState(computeDims);

  useEffect(() => {
    let frame: number | null = null;
    const onResize = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setDims(computeDims());
      });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [compact, compactGap]);

  return dims;
}

function getTranslateY(
  isExpanded: boolean,
  isConnected: boolean,
  footerHeight: number,
  gap: number,
  dims: {
    expandedConnected: number;
    expandedDefault: number;
    collapsedConnected: number;
    collapsedDefault: number;
    liftOffset?: number;
  }
) {
  const liftOffset = dims.liftOffset ?? 0;
  if (isExpanded) {
    const h = isConnected ? dims.expandedConnected : dims.expandedDefault;
    return `translateY(calc(100vh - ${footerHeight + gap + liftOffset}px - ${h}px))`;
  }
  const collapsed = isConnected
    ? dims.collapsedConnected
    : dims.collapsedDefault;
  return `translateY(calc(100% - ${collapsed + liftOffset}px))`;
}

export function BottomSheetServerSelector({
  onNavigate,
  onError,
  compact = false,
  compactGap,
}: BottomSheetServerSelectorProps) {
  const { t } = useTranslations();
  const vpn = useUnifiedVpn();
  const { activeConfig } = useActiveConfig();
  const [formError, setFormError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { handleTouchStart } = useBottomSheetGestures({
    isExpanded,
    setIsExpanded,
  });

  // Hook de dimensiones responsivas
  const responsiveDims = useResponsiveDimensions(compact, compactGap);

  const [footerHeight, setFooterHeight] = useState(() =>
    SHEET_DIM.baseFooter + getNavigationBarHeight()
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const computeFooterHeight = () => {
      const base = SHEET_DIM.baseFooter + getNavigationBarHeight();
      const computed = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--app-footer-height")
        .trim();
      const parsed = parseFloat(computed.replace(/px$/, ""));
      const next = Number.isFinite(parsed) && parsed > 0 ? Math.max(parsed, base) : base;
      setFooterHeight((prev) => (Math.abs(prev - next) > 0.5 ? next : prev));
    };

    computeFooterHeight();

    window.addEventListener("resize", computeFooterHeight);
    window.addEventListener("orientationchange", computeFooterHeight);

    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(computeFooterHeight);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["style"],
      });
    }

    return () => {
      window.removeEventListener("resize", computeFooterHeight);
      window.removeEventListener("orientationchange", computeFooterHeight);
      observer?.disconnect();
    };
  }, []);

  // Validar precondiciones antes de conectar
  const validatePreconditions = (): {
    ok: boolean;
    type?: "missingserver" | "missingcredentials" | "missingsetup";
    message?: string;
  } => {
    flushPendingCredentials();
    const active = nativeAPI.config.getActive();
    const hasServer = Boolean(active);
    const needsUsername = nativeAPI.auth.shouldShowInput("username");
    const needsPassword = nativeAPI.auth.shouldShowInput("password");

    const hasEmbeddedCredsFlag =
      active?.has_embedded_credentials === true ||
      active?.embedded_auth === true ||
      active?.auto_auth === true;

    const namePatterns = [
      /gratuito/i,
      /gratis/i,
      /free/i,
      /auto/i,
      /predefinid/i,
      /preconfig/i,
      /embedded/i,
      /sin\s*credencial/i,
      /no\s*auth/i,
      /emergencia/i,
      /solo\s*emergencias/i,
      /emergency/i,
    ];
    const nameIndicatesEmbedded = namePatterns.some(
      (pattern) =>
        pattern.test(active?.name || "") ||
        pattern.test(active?.description || "")
    );

    if (hasEmbeddedCredsFlag || nameIndicatesEmbedded) {
      return { ok: true };
    }

    let username = nativeAPI.auth.getUsername()?.trim();
    let password = nativeAPI.auth.getPassword()?.trim();

    if (active?.auth) {
      if (!username && active.auth.username) {
        nativeAPI.auth.setUsername(active.auth.username);
        username = active.auth.username.trim();
      }
      if (!password && active.auth.password) {
        nativeAPI.auth.setPassword(active.auth.password);
        password = active.auth.password.trim();
      }
    }

    let missingCreds = false;
    const missingParts: string[] = [];
    if (needsUsername && !username) {
      missingCreds = true;
      missingParts.push(
        t.credentialsPanel?.usernameLabel?.toLowerCase() || "usuario"
      );
    }
    if (needsPassword && !password) {
      missingCreds = true;
      missingParts.push(
        t.credentialsPanel?.passwordLabel?.toLowerCase() || "contraseña"
      );
    }

    if (hasServer && !missingCreds) return { ok: true };

    if (!hasServer && missingCreds) {
      return {
        ok: false,
        type: "missingsetup",
        message:
          t.modals?.missingConfig?.messages?.missingSetup ||
          `Falta seleccionar servidor y ${missingParts.join(" y ")}.`,
      };
    }
    if (!hasServer) {
      return {
        ok: false,
        type: "missingserver",
        message:
          t.tvMode?.validation?.noServer ||
          t.modals?.missingConfig?.messages?.missingServer ||
          "No hay ninguna configuración seleccionada",
      };
    }
    return {
      ok: false,
      type: "missingcredentials",
      message:
        missingParts.length > 0
          ? `${
              t.tvMode?.validation?.missingCredentials?.split(":")[0] || "Falta"
            } ${missingParts.join(" y ")}`
          : t.tvMode?.validation?.missingCredentials || "Faltan credenciales",
    };
  };

  const handleConnection = async () => {
    try {
      setFormError(null);

      if (vpn.state === "CONNECTED") return vpn.disconnect();

      if (["DISCONNECTED", "AUTH_FAILED", "NO_NETWORK"].includes(vpn.state)) {
        const validation = validatePreconditions();
        if (!validation.ok) {
          setFormError(
            validation.message ||
              t.tvMode?.validation?.incomplete ||
              "Configuración incompleta"
          );
          if (validation.type) onNavigate?.(validation.type);
          return;
        }
        return vpn.connect();
      }

      if (["CONNECTING", "AUTH", "STOPPING"].includes(vpn.state)) {
        return vpn.disconnect();
      }
    } catch {
      setFormError(
        t.tvMode?.validation?.processError || "Error al procesar la conexión"
      );
    }
  };

  useEffect(() => {
    if (vpn.state === "CONNECTED") {
      setFormError(null);
      onError?.(null);
    }
  }, [vpn.state, onError]);

  useEffect(() => {
    onError?.(formError);
  }, [formError, onError]);

  const netSpeeds = useNetSpeeds({ enabled: vpn.isConnected });

  // Clases responsivas mejoradas
  const getResponsiveClasses = () => {
    const { isVerySmall } = responsiveDims;

    return {
      containerPadding: compact
        ? isVerySmall
          ? "pt-3 px-2 pb-1.5"
          : "pt-4 px-2.5 pb-2"
        : isVerySmall
        ? "pt-5 px-3 pb-2"
        : "pt-8 px-4 pb-3",
      cardPadding: compact
        ? isVerySmall
          ? "p-2"
          : "p-2.5"
        : isVerySmall
        ? "p-3"
        : "p-4",
      speedLabelClass: compact
        ? isVerySmall
          ? "text-[8px]"
          : "text-[9px]"
        : isVerySmall
        ? "text-[9px]"
        : "text-[10px]",
      speedValueClass: compact
        ? isVerySmall
          ? "text-base"
          : "text-lg"
        : isVerySmall
        ? "text-lg"
        : "text-xl",
      speedsGapClass: compact
        ? isVerySmall
          ? "mt-1.5 mb-1.5"
          : "mt-2 mb-2"
        : isVerySmall
        ? "mt-2 mb-2"
        : "mt-3 mb-3",
      speedsSpacing: compact
        ? isVerySmall
          ? "gap-4"
          : "gap-6"
        : isVerySmall
        ? "gap-6"
        : "gap-10",
      speedMinWidth: compact
        ? isVerySmall
          ? "min-w-[70px]"
          : "min-w-[80px]"
        : isVerySmall
        ? "min-w-[80px]"
        : "min-w-[96px]",
      borderRadius: isVerySmall ? "rounded-lg" : "rounded-xl",
    };
  };

  const classes = getResponsiveClasses();

  // Altura dinámica del bloque de velocidades
  const speedsRef = useRef<HTMLDivElement | null>(null);
  const [speedsHeight, setSpeedsHeight] = useState(0);
  const prevConnectedRef = useRef<boolean>(vpn.isConnected);
  const [, setSpeedsBootstrapped] = useState(false);

  useEffect(() => {
    const prev = prevConnectedRef.current;
    if (!prev && vpn.isConnected) {
      const estimated = compact
        ? responsiveDims.isVerySmall
          ? 40
          : 48
        : responsiveDims.isVerySmall
        ? 50
        : 60;
      setSpeedsHeight(estimated);
      setSpeedsBootstrapped(true);
    }
    prevConnectedRef.current = vpn.isConnected;
    if (!vpn.isConnected) {
      setSpeedsBootstrapped(false);
    }
  }, [vpn.isConnected, compact, responsiveDims.isVerySmall]);

  useEffect(() => {
    if (!vpn.isConnected) {
      const t = setTimeout(() => setSpeedsHeight(0), 120);
      return () => clearTimeout(t);
    }
    const el = speedsRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (h !== speedsHeight) setSpeedsHeight(h);
    };
    requestAnimationFrame(measure);
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [vpn.isConnected, compact]);

  // Ajuste de dimensiones colapsadas con altura de speeds
  const collapsedBase = compact
    ? responsiveDims.collapsedDefault - (responsiveDims.isVerySmall ? 50 : 40)
    : responsiveDims.collapsedDefault;

  const collapsedConnectedDynamic =
    collapsedBase + (vpn.isConnected ? speedsHeight : 0);

  const dimOverrides = {
    expandedConnected: responsiveDims.expandedConnected,
    expandedDefault: responsiveDims.expandedDefault,
    collapsedConnected: collapsedConnectedDynamic,
    collapsedDefault: collapsedBase,
    liftOffset: responsiveDims.liftOffset ?? 0,
  };

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-[998] transition-transform duration-300 ease-out"
        style={{
          bottom: `${footerHeight + responsiveDims.gap}px`,
          transform: getTranslateY(
            isExpanded,
            vpn.isConnected,
            footerHeight,
            responsiveDims.gap,
            dimOverrides
          ),
        }}
      >
        <div className="pointer-events-none absolute -top-[120px] inset-x-0 h-[120px] z-10 bg-gradient-to-b from-transparent via-[#1D1A23]/20 to-[#1D1A23]" />

        <div
          className="relative h-full shadow-[0_-8px_32px_rgba(0,0,0,0.25),0_-4px_16px_rgba(0,0,0,0.15)]"
          style={{ backgroundColor: '#1D1A23' }}
          onTouchStart={handleTouchStart}
        >
          <div
            className={classes.containerPadding}
            onTouchStart={handleTouchStart}
          >
            <div
              className={`${classes.borderRadius} ${classes.cardPadding} border border-surface-border flex flex-col`}
              style={{ backgroundColor: '#292734' }}
            >
              <div>
                <ServerInfo
                  activeConfig={activeConfig}
                  compact={compact || responsiveDims.isVerySmall}
                />
                <div ref={speedsRef}>
                  <SpeedStats
                    netSpeeds={netSpeeds}
                    isConnected={vpn.isConnected}
                  />
                </div>
              </div>
              <div className="mt-auto pt-1">
                <ConnectionButtons
                  vpn={vpn}
                  onConnection={handleConnection}
                  compact={compact || responsiveDims.isVerySmall}
                />
              </div>
            </div>
          </div>
          <div
            className={`${
              isExpanded
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 translate-y-5 invisible"
            } transition-all duration-300 ease-out`}
          >
          </div>
        </div>
      </div>
    </>
  );
}
