/**
 * @file CardSkeleton.tsx
 */
import React from 'react';

export const CardSkeleton: React.FC<{ lines?: number; tall?: boolean } > = ({ lines = 3, tall }) => {
  return (
  <div className={`card-skeleton ${tall ? 'h-48' : ''}`}> 
      <div className='space-y-2'>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`h-3 rounded bg-[#2f2f3c] ${i === 0 ? 'w-1/3' : i === 1 ? 'w-2/3' : 'w-full'}`}></div>
        ))}
      </div>
    </div>
  );
};
