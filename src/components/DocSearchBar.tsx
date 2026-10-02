'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchContext } from './SearchContext';
import { SearchAutocomplete } from './SearchAutocomplete';

interface DocSearchBarProps {
  basePath: string;
  placeholder: string;
  initialValue?: string | null;
}

export function DocSearchBar({ basePath, placeholder, initialValue }: DocSearchBarProps) {
  const router = useRouter();
  const { searchValue, setSearchValue } = useSearchContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialValue) {
      setSearchValue(initialValue);
    }
  }, [initialValue, setSearchValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    } else if (e.key === 'Enter') {
      setIsOpen(false);
      const trimmed = searchValue.trim();
      if (trimmed) {
        router.push(`${basePath}/${encodeURIComponent(trimmed)}`);
      } else {
        setSearchValue('');
        router.push(basePath);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative z-50 w-full max-w-[600px] mx-auto text-left">
      <input
        type="text"
        id="search_bar"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => {
          if (searchValue.trim()) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className="w-full block"
      />

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
