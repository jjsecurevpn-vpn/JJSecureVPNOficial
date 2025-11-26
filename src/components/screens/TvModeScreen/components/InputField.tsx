import React from 'react';

interface InputFieldProps {
  type?: 'text' | 'password';
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  showToggle?: boolean;
  shown?: boolean;
  onToggle?: () => void;
  sizeConfig: Record<string, unknown>;
  mono?: boolean;
  compact?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  type = 'text', value, placeholder, onChange,
  showToggle, shown, onToggle, sizeConfig, mono, compact
}) => {
  const config = sizeConfig as Record<string, unknown>;
  return (
  <div className={showToggle ? 'relative' : ''}>
    <input
      className={`w-full ${config.padding} ${showToggle ? 'pr-10' : ''} ${compact ? 'text-xs' : config.textSize} ${config.borderRadius} ${mono ? 'font-mono' : ''} bg-surface/50 border border-surface-border focus:border-brand focus:outline-none text-neutral-strong placeholder-neutral-text`}
      type={showToggle && shown ? 'text' : type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {showToggle && onToggle && (
      <button
        type="button"
        className={`absolute right-2 top-1/2 -translate-y-1/2 ${config.buttonPadding} rounded hover:bg-surface-border/50`}
        onClick={onToggle}
      >
        {shown ? ((config.icons as Record<string, unknown>).eyeOff as React.ReactNode) : ((config.icons as Record<string, unknown>).eye as React.ReactNode)}
      </button>
    )}
  </div>
);
};
