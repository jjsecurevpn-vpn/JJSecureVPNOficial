/**
 * @file VPNLockIcons.tsx
 * @description Iconos de candado para estados de VPN
 */

import type { SVGProps } from "react";

interface VPNLockIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const DisconnectedLockIcon = ({ 
  size = 22, 
  className = "", 
  ...rest 
}: VPNLockIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 26 26"
    className={className}
    {...rest}
  >
    <path
      fill="currentColor"
      d="M7 0C4.79 0 2.878.917 1.687 2.406C.498 3.896 0 5.826 0 7.906V11h3V7.906c0-1.58.389-2.82 1.031-3.625C4.674 3.477 5.541 3 7 3c1.463 0 2.328.45 2.969 1.25c.64.8 1.031 2.06 1.031 3.656V9h3V7.906c0-2.092-.527-4.044-1.719-5.531C11.09.888 9.206 0 7 0m2 10c-1.656 0-3 1.344-3 3v10c0 1.656 1.344 3 3 3h14c1.656 0 3-1.344 3-3V13c0-1.656-1.344-3-3-3zm7 5a2 2 0 0 1 2 2c0 .738-.404 1.372-1 1.719V21c0 .551-.449 1-1 1s-1-.449-1-1v-2.281c-.596-.347-1-.98-1-1.719a2 2 0 0 1 2-2"
    />
  </svg>
);

export const ConnectedLockIcon = ({ 
  size = 22, 
  className = "", 
  ...rest 
}: VPNLockIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...rest}
  >
    <g fill="none" fillRule="evenodd">
      <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
      <path
        fill="currentColor"
        d="M6 8a6 6 0 1 1 12 0h1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2zm6-4a4 4 0 0 1 4 4H8a4 4 0 0 1 4-4m2 10a2 2 0 0 1-1 1.732V17a1 1 0 1 1-2 0v-1.268A2 2 0 0 1 12 12a2 2 0 0 1 2 2"
      />
    </g>
  </svg>
);

export type { VPNLockIconProps };
