/**
 * @file LoadingView.tsx
 * @description Vista de carga y estados vacíos para ServerSelectorScreen - Simplificada
 */

import React from "react";
import { Spinner } from "../../../ui/Spinner";
import { EmptyState, Text } from "../ui";
import { LoadingViewProps } from "../types";
import { useTranslations } from "../../../../context/LanguageContext";

// Componente customizado de loading para mejor control del texto
const CustomLoadingState: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-6">
      <div className="relative">
  <Spinner size="xl" color="brand" thickness="thick" />
        <div className="absolute inset-0 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-center space-y-3">
        <Text variant="h3" color="primary">
          {title}
        </Text>
        <Text variant="body" color="tertiary" className="max-w-sm block">
          {description}
        </Text>
      </div>
    </div>
  );
};

export const LoadingView: React.FC<LoadingViewProps> = ({
  loading,
  hasConfigs,
  handleUpdate
}) => {
  const t = useTranslations();
  if (loading) {
    return (
      <CustomLoadingState 
        title={t.serverSelectorScreen.loadingView.loadingServers}
        description={t.serverSelectorScreen.loadingView.updating}
        icon={<span style={{ fontSize: '20px' }}>⟳</span>}
      />
    );
  }

  if (!hasConfigs) {
    return (
      <EmptyState
        title={t.serverSelectorScreen.loadingView.noServersAvailable}
        description={t.serverSelectorScreen.errorView.errorDetails}
        icon={<span style={{ fontSize: '40px' }}>⚠</span>}
        action={{
          label: loading ? t.serverSelectorScreen.loadingView.updating : t.serverSelectorScreen.loadingView.updateConfigs,
          onClick: handleUpdate
        }}
      />
    );
  }

  return null;
};
