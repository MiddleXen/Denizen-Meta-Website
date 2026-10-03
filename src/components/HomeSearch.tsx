'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { useSearchContext } from './SearchContext';
import { SearchAutocomplete } from './SearchAutocomplete';

export function HomeSearch() {
  const router = useRouter();
  const { searchValue, setSearchValue, triggerSearch } = useSearchContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    triggerSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => prev + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full z-50">
      <form onSubmit={handleSearch} className="relative w-full group">
        <div className="relative flex items-center transition-all duration-300">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-[#00bc8c] transition-colors pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              if (searchValue.trim()) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, tags, events, mechanisms... (e.g. async, narrate, player.name)"
            className="w-full pl-11 pr-28 py-3 rounded-xl bg-white dark:bg-[#282b32] hover:dark:bg-[#2e323a] focus:dark:bg-[#2e323a] border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00bc8c]/40 focus:border-[#00bc8c] focus:shadow-[0_0_25px_rgba(0,188,140,0.22)] transition-all duration-300 shadow-inner"
          />

          <button
            type="submit"
            className="absolute right-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-[#00bc8c] dark:hover:bg-[#00d8a0] text-white font-medium text-xs flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,188,140,0.4)] active:scale-95 cursor-pointer shadow-sm group/btn"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </form>

      <SearchAutocomplete
        query={searchValue}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
}
