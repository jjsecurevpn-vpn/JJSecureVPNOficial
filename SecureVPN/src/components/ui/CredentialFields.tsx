import { useState } from 'react';

interface CredentialFieldsProps {
  username: string;
  password: string;
  uuid: string;
  showUuid: boolean;
  showUserPass: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onUuidChange: (value: string) => void;
}

export function CredentialFields({
  username,
  password,
  uuid,
  showUuid,
  showUserPass,
  onUsernameChange,
  onPasswordChange,
  onUuidChange,
}: CredentialFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!showUserPass && !showUuid) return null;

  return (
    <div className="fields">
      {showUserPass && (
        <>
          <div className="field">
            <i className="fa fa-user" />
            <input
              placeholder="Usuario"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
            />
          </div>
          <div className="field">
            <i className="fa fa-lock" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
            <i
              className={`fa fa-eye${showPassword ? '-slash' : ''} eye-icon`}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </>
      )}
      {showUuid && (
        <div className={`field ${showUserPass ? '' : 'full'}`}>
          <i className="fa fa-key" />
          <input
            placeholder="UUID (V2Ray)"
            value={uuid}
            onChange={(e) => onUuidChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
