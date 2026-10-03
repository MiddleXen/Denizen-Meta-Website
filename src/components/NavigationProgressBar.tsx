'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    setProgress(20);
    setVisible(true);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 85;
        }
        const remaining = 85 - prev;
        const inc = Math.max(1, remaining * 0.15);
        return prev + inc;
      });
    }, 100);
  };

  const completeProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);

    resetTimerRef.current = setTimeout(() => {
      setVisible(false);
      resetTimerRef.current = setTimeout(() => {
        setProgress(0);
      }, 300);
    }, 200);
  };

  // Complete progress whenever pathname changes (navigation finished)
  useEffect(() => {
    completeProgress();
  }, [pathname]);

  // Start progress on internal link clicks and popstate
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor || !anchor.href) return;
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      try {
        const url = new URL(anchor.href, window.location.origin);
        if (url.origin === window.location.origin) {
          if (
            url.pathname !== window.location.pathname ||
            (url.search && url.search !== window.location.search)
          ) {
            startProgress();
          }
        }
      } catch {
        // ignore invalid urls
      }
    };

    window.addEventListener('click', handleAnchorClick, true);
    window.addEventListener('popstate', startProgress);

    return () => {
      window.removeEventListener('click', handleAnchorClick, true);
      window.removeEventListener('popstate', startProgress);
      if (timerRef.current) clearInterval(timerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[99999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-emerald-500 via-[#00bc8c] to-teal-300 dark:from-[#00bc8c] dark:via-emerald-400 dark:to-teal-200 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(0,188,140,0.85),0_0_4px_rgba(0,188,140,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
