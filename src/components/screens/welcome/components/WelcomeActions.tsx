import React from 'react';

interface WelcomeActionsProps {
  onEnterApp?: () => void;
  onEnterTvMode?: () => void;
}

export const WelcomeActions: React.FC<WelcomeActionsProps> = ({ onEnterApp, onEnterTvMode }) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto mt-4">
      <button
        onClick={onEnterApp}
        data-vc-focusable
        className="wel-btn-primary-contrast"
        style={{height: 58}}
      >
        Entrar
      </button>
      <button
        onClick={onEnterTvMode}
        data-vc-focusable
        className="wel-btn-secondary"
        style={{height: 54}}
      >
        Modo TV
      </button>
    </div>
  );
};
