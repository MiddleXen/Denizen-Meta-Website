'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useSearchContext } from './SearchContext';
import { Search, BookOpen, ChevronDown, Check } from 'lucide-react';
import { SearchAutocomplete } from './SearchAutocomplete';

const NAV_LINKS = [
  { href: '/Docs/Commands', label: 'Commands' },
  { href: '/Docs/Tags', label: 'Tags' },
  { href: '/Docs/ObjectTypes', label: 'Object Types' },
  { href: '/Docs/Mechanisms', label: 'Mechanisms' },
  { href: '/Docs/Events', label: 'Events' },
  { href: '/Docs/Languages', label: 'Languages' },
  { href: '/Docs/Actions', label: 'NPC Actions' },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { searchValue, setSearchValue, triggerSearch } = useSearchContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchActiveIndex, setSearchActiveIndex] = useState(-1);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sliding active indicator state & refs
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    height: number;
    opacity: number;
  }>({ left: 0, width: 0, height: 32, opacity: 0 });

  const navLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const activeIndex = NAV_LINKS.findIndex((link) => pathname.startsWith(link.href));
  const targetIndex = clickedIndex !== null ? clickedIndex : activeIndex;

  useEffect(() => {
    setClickedIndex(null);
  }, [pathname]);

  useEffect(() => {
    const updateIndicator = () => {
      if (targetIndex >= 0 && navLinksRef.current[targetIndex] && navContainerRef.current) {
        const containerRect = navContainerRef.current.getBoundingClientRect();
        const elRect = navLinksRef.current[targetIndex]!.getBoundingClientRect();
        setIndicatorStyle({
          left: elRect.left - containerRect.left,
          width: elRect.width,
          height: elRect.height,
          opacity: 1,
        });
        setIsReady(true);
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    const rafId = requestAnimationFrame(updateIndicator);

    window.addEventListener('resize', updateIndicator);
    return () => {
      window.removeEventListener('resize', updateIndicator);
      cancelAnimationFrame(rafId);
    };
  }, [targetIndex, pathname, theme]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsSearchOpen(true);
      setSearchActiveIndex((prev) => prev + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchActiveIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchActiveIndex(-1);
    } else if (e.key === 'Enter') {
      setIsSearchOpen(false);
      triggerSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#222222]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-xs">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center flex-shrink-0 no-underline hover:no-underline">
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white hover:text-emerald-500 dark:hover:text-[#00bc8c] transition-colors no-underline">
              DenizenM Meta Documentation
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            <div
              ref={navContainerRef}
              className="relative flex items-center gap-1"
            >
              {/* Sliding Active Pill / Selection Outline */}
              <div
                className={`nav-sliding-pill absolute top-1/2 -translate-y-1/2 rounded-lg pointer-events-none ${
                  isReady ? 'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]' : ''
                }`}
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  height: `${indicatorStyle.height || 32}px`,
                  opacity: indicatorStyle.opacity,
                }}
                aria-hidden="true"
              />

              {NAV_LINKS.map((link, idx) => {
                const isActive = activeIndex === idx;
                const isSelected = targetIndex === idx;
                return (
                  <Link
                    key={link.href}
                    ref={(el) => {
                      navLinksRef.current[idx] = el;
                    }}
                    href={link.href}
                    onClick={() => setClickedIndex(idx)}
                    className={`relative z-10 px-3 py-1.5 rounded-lg text-sm font-medium no-underline hover:no-underline transition-colors duration-150 select-none ${
                      isActive || isSelected
                        ? 'text-emerald-600 dark:text-[#00bc8c] font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-[#00bc8c] hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Theme Dropdown (Like official Denizen Meta) */}
            <div className="relative" ref={themeMenuRef}>
              <button
                type="button"
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  themeMenuOpen
                    ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-[#00bc8c] hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>Theme</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${themeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-white dark:bg-[#282b32] border border-slate-200 dark:border-white/10 shadow-xl py-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    Select Theme
                  </div>

                  {/* 1. Pitch Black (Default) */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('black');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                      theme === 'black'
                        ? 'bg-white/15 text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="theme-dot theme-dot-black"></span>
                      <span>Pitch Black</span>
                    </div>
                    {theme === 'black' && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>

                  {/* 2. Emerald Dark */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('dark');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#00bc8c]/15 text-[#00bc8c] font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="theme-dot theme-dot-emerald"></span>
                      <span>Emerald Dark</span>
                    </div>
                    {theme === 'dark' && <Check className="w-3.5 h-3.5 text-[#00bc8c]" />}
                  </button>

                  {/* 3. Graphite Dark */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('graphite');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                      theme === 'graphite'
                        ? 'bg-zinc-700/30 text-zinc-200 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="theme-dot theme-dot-graphite"></span>
                      <span>Graphite Dark</span>
                    </div>
                    {theme === 'graphite' && <Check className="w-3.5 h-3.5 text-zinc-300" />}
                  </button>

                  <div className="my-1 border-t border-slate-200 dark:border-white/10" />

                  {/* 4. Light Theme */}
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('light');
                      setThemeMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-emerald-500/10 text-emerald-600 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="theme-dot theme-dot-light"></span>
                      <span>Light Theme</span>
                    </div>
                    {theme === 'light' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Search bar & Controls */}
          <div className="flex items-center gap-2 flex-1 max-w-sm justify-end">
            <div className="relative w-full max-w-xs z-[999]" ref={searchContainerRef}>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-300 pointer-events-none" />
              <input
                type="text"
                placeholder="Search meta..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setIsSearchOpen(true);
                  setSearchActiveIndex(-1);
                }}
                onFocus={() => {
                  if (searchValue.trim()) setIsSearchOpen(true);
                }}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-8 pr-8 py-1.5 rounded-xl text-sm bg-slate-100 dark:bg-[#282b32] hover:dark:bg-[#2e323a] focus:dark:bg-[#2e323a] border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00bc8c]/40 focus:border-[#00bc8c] transition-all shadow-inner"
              />
              <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.2 text-[9px] font-semibold text-slate-500 dark:text-slate-200 bg-slate-200 dark:bg-white/15 rounded">
                ↵
              </kbd>

              <SearchAutocomplete
                query={searchValue}
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                activeIndex={searchActiveIndex}
                setActiveIndex={setSearchActiveIndex}
              />
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-3 px-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
            <div className="flex flex-wrap gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-500/10 dark:bg-[#00bc8c]/15 text-emerald-600 dark:text-[#00bc8c] font-semibold border border-emerald-500/35 dark:border-[#00bc8c]/40'
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-[#00bc8c] hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Theme Switcher */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Theme:</span>
              <div className="flex items-center gap-1.5">
                {/* 1. Pitch Black (Default) */}
                <button
                  type="button"
                  onClick={() => setTheme('black')}
                  className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                    theme === 'black'
                      ? 'bg-white/20 text-white font-semibold border border-white/40'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="theme-dot-sm theme-dot-black"></span>
                  <span>Black</span>
                </button>

                {/* 2. Emerald Dark */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#00bc8c]/20 text-[#00bc8c] font-semibold border border-[#00bc8c]/40'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="theme-dot-sm theme-dot-emerald"></span>
                  <span>Emerald</span>
                </button>

                {/* 3. Graphite Dark */}
                <button
                  type="button"
                  onClick={() => setTheme('graphite')}
                  className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                    theme === 'graphite'
                      ? 'bg-zinc-700/40 text-zinc-100 font-semibold border border-zinc-500'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="theme-dot-sm theme-dot-graphite"></span>
                  <span>Graphite</span>
                </button>

                {/* 4. Light */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                    theme === 'light'
                      ? 'bg-amber-400/20 text-amber-600 font-semibold border border-amber-400/40'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="theme-dot-sm theme-dot-light"></span>
                  <span>Light</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
