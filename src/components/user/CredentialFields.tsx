import React from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Key } from "lucide-react";
import type { Translations } from "../../translations/types";

interface CredentialFieldsProps {
  t: Translations;
  showHysteriaInput: boolean;
  showUsernameInput: boolean;
  showPasswordInput: boolean;
  showUUIDInput: boolean;
  showPassword: boolean;
  toggleShowPassword: () => void;
  showUUID: boolean;
  toggleShowUUID: () => void;
  username: string;
  onUsernameChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  uuid: string;
  onUuidChange: (value: string) => void;
  hysteriaUser: string;
  onHysteriaUserChange: (value: string) => void;
  hysteriaPass: string;
  onHysteriaPassChange: (value: string) => void;
  fieldErrors: { [k: string]: string };
  isHysteriaGratuito?: boolean;
}

export const CredentialFields: React.FC<CredentialFieldsProps> = ({
  t,
  showHysteriaInput,
  showUsernameInput,
  showPasswordInput,
  showUUIDInput,
  showPassword,
  toggleShowPassword,
  showUUID,
  toggleShowUUID,
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  uuid,
  onUuidChange,
  hysteriaUser,
  onHysteriaUserChange,
  hysteriaPass,
  onHysteriaPassChange,
  fieldErrors,
  isHysteriaGratuito = false,
}) => {
  // Placeholders especiales para Hysteria Gratuito
  const usernamePlaceholder = isHysteriaGratuito 
    ? 'Usuario: secure' 
    : t.credentialsPanel.usernamePlaceholder;
  const passwordPlaceholder = isHysteriaGratuito 
    ? 'Clave: secure' 
    : t.credentialsPanel.passwordPlaceholder;

  return (
    <>
      {showHysteriaInput && (
        <div className="space-y-4">
          <div className="text-neutral-strong flex items-center gap-2.5 text-[14px] font-semibold leading-5 tracking-[0.2px]">
            <Key className="w-4 h-4 text-brand" strokeWidth={1.5} />
            {t.credentialsPanel.hysteriaTitle}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <div className="relative">
                <input
                  className={`input-base text-[14px] font-medium leading-5 ${
                    fieldErrors.hysteriaUser
                      ? "input-error"
                      : hysteriaUser
                      ? "input-valid"
                      : "input-brand"
                  }`}
                  type="text"
                  placeholder={t.credentialsPanel.usernamePlaceholder}
                  value={hysteriaUser}
                  onChange={(e) => onHysteriaUserChange(e.target.value)}
                />
                {!fieldErrors.hysteriaUser && hysteriaUser && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00b96b]" strokeWidth={1.5} />
                )}
              </div>
              {fieldErrors.hysteriaUser && (
                <div className="field-error-text" style={{ fontSize: "12px", lineHeight: "16px" }}>
                  <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                  {fieldErrors.hysteriaUser}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 text-[#6d4aff] text-xl font-semibold px-2 font-mono">:</div>

            <div className="flex-1 space-y-2">
              <div className="relative">
                <input
                  className={`input-base pr-12 text-[14px] font-medium leading-5 ${
                    fieldErrors.hysteriaPass
                      ? "input-error"
                      : hysteriaPass
                      ? "input-valid"
                      : "input-brand"
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder={t.credentialsPanel.passwordPlaceholder}
                  value={hysteriaPass}
                  onChange={(e) => onHysteriaPassChange(e.target.value)}
                />
                <button type="button" className="icon-button-inline" onClick={toggleShowPassword}>
                  {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                </button>
              </div>
              {fieldErrors.hysteriaPass && (
                <div className="field-error-text" style={{ fontSize: "12px", lineHeight: "16px" }}>
                  <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                  {fieldErrors.hysteriaPass}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showUsernameInput && (
        <div className="space-y-2">
          <label className="text-neutral-strong flex items-center gap-2.5 text-[14px] font-semibold leading-5 tracking-[0.2px]">
            <span className="inline-flex w-4 h-4 items-center justify-center text-brand">@</span>
            {t.credentialsPanel.usernameLabel}
          </label>
          <div className="relative">
            <input
              className={`input-base text-[14px] font-medium leading-5 ${
                fieldErrors.username
                  ? "input-error"
                  : username
                  ? "input-valid"
                  : "input-brand"
              }`}
              type="text"
              placeholder={usernamePlaceholder}
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
            />
            {!fieldErrors.username && username && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00b96b]" strokeWidth={1.5} />
            )}
          </div>
          {fieldErrors.username && (
            <div className="field-error-text" style={{ fontSize: "12px", lineHeight: "16px" }}>
              <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
              {fieldErrors.username}
            </div>
          )}
        </div>
      )}

      {showPasswordInput && (
        <div className="space-y-2">
          <label className="text-neutral-strong flex items-center gap-2.5 text-[14px] font-semibold leading-5 tracking-[0.2px]">
            <Key className="w-4 h-4 text-brand" strokeWidth={1.5} />
            {t.credentialsPanel.passwordLabel}
          </label>
          <div className="relative">
            <input
              className={`input-base pr-12 text-[14px] font-medium leading-5 ${
                fieldErrors.password
                  ? "input-error"
                  : password
                  ? "input-valid"
                  : "input-brand"
              }`}
              type={showPassword ? "text" : "password"}
              placeholder={passwordPlaceholder}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
            <button type="button" className="icon-button-inline" onClick={toggleShowPassword}>
              {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
          {fieldErrors.password && (
            <div className="field-error-text" style={{ fontSize: "12px", lineHeight: "16px" }}>
              <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
              {fieldErrors.password}
            </div>
          )}
        </div>
      )}

      {showUUIDInput && (
        <div className="space-y-2">
          <label className="text-neutral-strong flex items-center gap-2.5 text-[14px] font-semibold leading-5 tracking-[0.2px]">
            <Key className="w-4 h-4 text-brand" strokeWidth={1.5} />
            {t.credentialsPanel.uuidLabel}
          </label>
          <div className="relative">
            <input
              className={`input-base pr-12 text-[14px] font-medium leading-5 ${
                fieldErrors.uuid
                  ? "input-error"
                  : uuid
                  ? "input-valid"
                  : "input-brand"
              }`}
              type={showUUID ? "text" : "password"}
              placeholder={t.credentialsPanel.uuidPlaceholder}
              value={uuid}
              onChange={(e) => onUuidChange(e.target.value)}
            />
            <button type="button" className="icon-button-inline" onClick={toggleShowUUID}>
              {showUUID ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
          {fieldErrors.uuid && (
            <div className="field-error-text" style={{ fontSize: "12px", lineHeight: "16px" }}>
              <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
              {fieldErrors.uuid}
            </div>
          )}
        </div>
      )}
    </>
  );
};
