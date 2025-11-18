import React from 'react';

interface InputFieldProps {
  type?: 'text' | 'password';
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  showToggle?: boolean;
  shown?: boolean;
  onToggle?: () => void;
  sizeConfig: any;
  mono?: boolean;
  compact?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  type = 'text', value, placeholder, onChange,
  showToggle, shown, onToggle, sizeConfig, mono, compact
}) => (
  <div className={showToggle ? 'relative' : ''}>
    <input
      className={`w-full ${sizeConfig.padding} ${showToggle ? 'pr-10' : ''} ${compact ? 'text-xs' : sizeConfig.textSize} ${sizeConfig.borderRadius} ${mono ? 'font-mono' : ''} bg-surface/50 border border-surface-border focus:border-brand focus:outline-none text-neutral-strong placeholder-neutral-text`}
      type={showToggle && shown ? 'text' : type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {showToggle && onToggle && (
      <button
        type="button"
        className={`absolute right-2 top-1/2 -translate-y-1/2 ${sizeConfig.buttonPadding} rounded hover:bg-surface-border/50`}
        onClick={onToggle}
      >
        {shown ? sizeConfig.icons.eyeOff : sizeConfig.icons.eye}
      </button>
    )}
  </div>
);
