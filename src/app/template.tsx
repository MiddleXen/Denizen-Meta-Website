'use client';

import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full flex-1 flex flex-col page-transition"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.classList.remove('page-transition');
        }
      }}
    >
      {children}
    </div>
  );
}
