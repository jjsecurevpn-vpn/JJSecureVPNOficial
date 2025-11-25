/**
 * @file UserProfileScreen.tsx
 * @description Pantalla de perfil de usuario refactorizada con ScreenLayout
 */

import { ErrorState } from "../../ui";
import { colors } from "../../../constants/theme";
import { ScreenLayout } from "../../layouts";
import { useTranslations } from "../../../context/LanguageContext";

// Componentes específicos
import { DisconnectedContent } from "./components/DisconnectedContent";
import { AccountPanel } from "./components/AccountPanel";
import { SessionStatsCard } from "./components/cards/SessionStatsCard";
import { DeviceInfoCard } from "./components/cards/DeviceInfoCard";
import { RecentConfigsCard } from "./components/cards/RecentConfigsCard";
import { CardSkeleton } from "./components/skeletons/CardSkeleton";
import { SupportCard } from "./components/cards/SupportCard";

// Hook específico
import { useUserProfile } from "./hooks/useUserProfile";

export function UserProfileScreen() {
  const t = useTranslations();
  const {
    userData,
    isLoading,
    error,
    isConnected,
    isConnecting,
    fetchUserData,
    handleRenew,
    handleContactSupport,
  } = useUserProfile();

  return (
    <ScreenLayout
      title={t.userProfileScreen.header.myAccount}
      backgroundColor={colors.background.primary}
      enableScrollEffect={true}
      horizontalPadding={24}
      verticalPadding={16}
    >
      {/* Banner renovación simplificado */}
      {userData && userData.expiration_days <= -5 && (
        <div className="relative mb-6 -mt-3">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-600/30 via-fuchsia-600/20 to-orange-500/10 shadow-[0_18px_40px_rgba(98,38,133,0.25)]">
            <div className="flex flex-wrap items-center gap-4 px-5 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[13px] font-semibold uppercase tracking-wide text-white">
                VIP
              </div>
              <div className="min-w-0 flex-1 text-sm leading-5 text-white">
                <p className="font-semibold">
                  {t.userProfileScreen.accountPanel.expired} · {Math.abs(userData.expiration_days)} {t.userProfileScreen.accountPanel.days}
                </p>
                <p className="text-white/70">
                  {t.userProfileScreen.accountPanel.renewWarningDesc}
                </p>
              </div>
              <button
                onClick={handleRenew}
                className="btn-base-sm bg-white text-[#181826] shadow-[0_12px_24px_rgba(255,255,255,0.18)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {t.userProfileScreen.accountPanel.renewSubscription}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
  {/* Se reduce pb para evitar solapamiento con footer dinámico */}
  <div className="space-y-6 pb-4">
        {isConnected ? (
          error ? (
            <ErrorState 
              error={error} 
              onRetry={fetchUserData}
            />
          ) : userData ? (
            <div className="w-full mx-auto max-w-5xl space-y-6">
              <AccountPanel data={userData} onRenew={handleRenew} />
              
              {/* Grid reorganizado */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                <div className="flex flex-col gap-6">
                  <SessionStatsCard isConnected={isConnected} isLoading={isLoading} />
                  <RecentConfigsCard />
                </div>
                <div className="flex flex-col gap-6">
                  <DeviceInfoCard />
                  <SupportCard onContactSupport={handleContactSupport} />
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="w-full mx-auto max-w-5xl space-y-6">
              <div className="mx-auto max-w-4xl space-y-4">
                <CardSkeleton lines={4} tall />
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
                <div className="flex flex-col gap-6">
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
                <div className="flex flex-col gap-6">
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              </div>
            </div>
          ) : null
        ) : (
          <DisconnectedContent isConnecting={isConnecting} />
        )}
      </div>
    </ScreenLayout>
  );
}