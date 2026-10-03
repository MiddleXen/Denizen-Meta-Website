'use client';

import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="book-page-turn w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
