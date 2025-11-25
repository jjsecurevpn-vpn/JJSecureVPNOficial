/**
 * @file MenuSection.tsx
 * @description Sección de menú con tarjetas fluidas
 */

import React from "react";
import { MenuSectionProps } from "../types";
import { MenuItem } from "./MenuItem";

export const MenuSection: React.FC<MenuSectionProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {categories.map((category) => (
        <div key={category.title} className="card-base w-full gap-4 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="max-w-xs text-pretty text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-muted sm:max-w-none sm:text-[11px] sm:tracking-[0.3em]">
                {category.title}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3" role="list" aria-label={category.title}>
            {category.items.map((item, index) => (
              <MenuItem key={`${category.title}-${index}`} {...item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
