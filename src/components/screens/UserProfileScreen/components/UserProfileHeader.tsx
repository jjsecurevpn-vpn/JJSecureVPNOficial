/**
 * @file UserProfileHeader.tsx
 * @description Header específico para UserProfileScreen
 */

import { RefreshCw, User, Shield } from "lucide-react";
import { Button, Text, StatusIndicator } from "../../../ui";
import { colors } from "../../../../constants/theme";
import { getStatusBarHeight } from "../../../../utils/deviceUtils";
import { useTranslations } from "../../../../context/LanguageContext";

interface UserProfileHeaderProps {
  isConnected: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export function UserProfileHeader({ isConnected, isLoading, onRefresh }: UserProfileHeaderProps) {
  const statusBarHeight = getStatusBarHeight();
  const t = useTranslations();

  return (
    <div className="relative" style={{ paddingTop: `${statusBarHeight}px` }}>
      <div 
        className="absolute inset-0 border-b" 
        style={{ 
          top: `-${statusBarHeight}px`,
          backgroundColor: colors.background.secondary,
          borderBottomColor: colors.border.primary
        }}
      />
      
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              backgroundColor: colors.brand.primary
            }}
          >
            {isConnected ? (
              <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
            ) : (
              <User className="w-5 h-5 text-white" strokeWidth={1.5} />
            )}
          </div>
          
          <div className="flex flex-col">
            <Text variant="h2" color="primary" className="leading-tight">
              {isConnected ? t.userProfileScreen.header.myAccount : t.userProfileScreen.header.configuration}
            </Text>
            <div className="mt-0.5">
              <StatusIndicator
                status={isConnected ? 'connected' : 'disconnected'}
                label={isConnected ? t.userProfileScreen.header.connected : t.userProfileScreen.header.configureCredentials}
                size="small"
              />
            </div>
          </div>
        </div>

        {isConnected && (
          <Button
            variant="outline"
            size="small"
            onClick={onRefresh}
            disabled={isLoading}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} strokeWidth={1.5} />
          </Button>
        )}
      </div>
    </div>
  );
}
