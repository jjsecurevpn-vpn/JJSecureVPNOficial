/**
 * @file ErrorView.tsx
 * @description Vista de error para ServerSelectorScreen
 */

import React from "react";
import { AlertCircle, RefreshCw, Settings } from "lucide-react";
import { Text } from "../ui";
import { colors } from "../../../../constants/theme";
import { useTranslations } from "../../../../context/LanguageContext";

export interface ErrorViewProps {
  error: string;
  onRetry: () => void;
  onUseNative: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  error,
  onRetry,
  onUseNative
}) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="text-center mb-8">
        <AlertCircle 
          className="w-16 h-16 mx-auto mb-4" 
          style={{ color: colors.status.error }} 
        />
        <div className="mb-4">
          <Text variant="h2" color="primary">
            {t.serverSelectorScreen.errorView.loadError}
          </Text>
        </div>
        <div className="max-w-sm mx-auto">
          <Text variant="body" color="tertiary">
            {error}
          </Text>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg transition-colors duration-200 hover:brightness-110 active:scale-[0.98]"
          style={{
            backgroundColor: colors.brand.primary,
            color: '#ffffff'
          }}
        >
          <RefreshCw className="w-4 h-4" />
          <Text variant="body" className="font-medium" style={{ color: '#ffffff' }}>
            {t.serverSelectorScreen.errorView.retry}
          </Text>
        </button>

        <button
          onClick={onUseNative}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-surface-border/50 active:scale-[0.98]"
          style={{
            backgroundColor: colors.background.tertiary,
            color: colors.text.primary,
            border: `1px solid ${colors.border.primary}`
          }}
        >
          <Settings className="w-4 h-4" />
          <Text variant="body" className="font-medium">
            {t.serverSelectorScreen.errorView.useNativeSelector}
          </Text>
        </button>
      </div>
    </div>
  );
};
