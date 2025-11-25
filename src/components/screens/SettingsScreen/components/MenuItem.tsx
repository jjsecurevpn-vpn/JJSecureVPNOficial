/**
 * @file MenuItem.tsx
 * @description Item individual estilizado con Tailwind
 */

import React from "react";
import { ChevronRight } from "lucide-react";
import { MenuItemProps } from "../types";

export const MenuItem: React.FC<MenuItemProps> = ({ icon, label, description, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-stretch gap-3 rounded-xl border border-surface-border/70 bg-surface/70 px-3 py-2.5 text-left transition hover:border-brand/40 hover:bg-surface-border/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 sm:px-4 sm:py-3"
      role="listitem"
      aria-label={label}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-border/70 text-neutral-text transition group-hover:text-white">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-pretty text-sm font-semibold leading-tight text-white">{label}</p>
        {description && (
          <p className="mt-1 text-pretty text-[11px] leading-4 text-neutral-muted">{description}</p>
        )}
      </div>
      <ChevronRight className="h-4 w-4 flex-shrink-0 self-center text-neutral-muted transition group-hover:text-white" strokeWidth={1.5} />
    </button>
  );
};
