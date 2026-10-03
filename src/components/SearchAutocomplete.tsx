'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Code, Tag, Zap, Cpu, Sparkles, Terminal } from 'lucide-react';
import { SearchSuggestion, filterSuggestions } from '@/lib/suggestions';

interface SearchAutocompleteProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: () => void;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  categoryFilter?: string;
  className?: string;
}

let memorySuggestions: SearchSuggestion[] | null = null;
let fetchPromise: Promise<SearchSuggestion[]> | null = null;

async function getSuggestionsData(): Promise<SearchSuggestion[]> {
  if (memorySuggestions) return memorySuggestions;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('/data/search-suggestions.json', { cache: 'force-cache' });
      if (res.ok) {
        const data = await res.json();
        memorySuggestions = data;
        return data;
      }
    } catch (e) {
      console.warn('Failed to load search suggestions json, fallback to API:', e);
    }
    return [];
  })();

  return fetchPromise;
}

export function SearchAutocomplete({
  query,
  isOpen,
  onClose,
  onSelect,
  activeIndex,
  setActiveIndex,
  categoryFilter,
  className = '',
}: SearchAutocompleteProps) {
  const router = useRouter();
  const [allSuggestions, setAllSuggestions] = useState<SearchSuggestion[]>(memorySuggestions || []);

  useEffect(() => {
    if (!memorySuggestions) {
      getSuggestionsData().then((data) => {
        if (data && data.length > 0) {
          setAllSuggestions(data);
        }
      });
    }
  }, []);

  const matches = useMemo(() => {
    if (!query || query.trim().length === 0) return [];
    return filterSuggestions(allSuggestions, query, 7, categoryFilter);
  }, [allSuggestions, query, categoryFilter]);

  if (!isOpen || !query.trim()) {
    return null;
  }

  const getTypeBadge = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'Command':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Terminal className="w-2.5 h-2.5" />
            CMD
          </span>
        );
      case 'Tag':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            <Tag className="w-2.5 h-2.5" />
            TAG
          </span>
        );
      case 'Event':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Zap className="w-2.5 h-2.5" />
            EVENT
          </span>
        );
      case 'Mechanism':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <Cpu className="w-2.5 h-2.5" />
            MECH
          </span>
        );
      case 'ObjectType':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            <Code className="w-2.5 h-2.5" />
            TYPE
          </span>
        );
      case 'Language':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
            <BookOpen className="w-2.5 h-2.5" />
            LANG
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30">
            <Sparkles className="w-2.5 h-2.5" />
            {type}
          </span>
        );
    }
  };

  const highlightMatch = (text: string, q: string) => {
    const cleanQ = q.trim();
    if (!cleanQ) return text;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(cleanQ.toLowerCase());
    if (idx === -1) return text;

    const before = text.slice(0, idx);
    const matched = text.slice(idx, idx + cleanQ.length);
    const after = text.slice(idx + cleanQ.length);

    return (
      <>
        {before}
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          {matched}
        </span>
        {after}
      </>
    );
  };

  const handleItemClick = (href: string) => {
    onClose();
    if (onSelect) onSelect();
    router.push(href);
  };

  return (
    <div
      className={`search-autocomplete-panel absolute left-0 right-0 top-full mt-1.5 rounded-xl bg-white dark:bg-[#1a1d24] backdrop-blur-xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden z-[100] text-left ${className}`}
    >
      <div className="px-3.5 py-2 text-[11px] font-semibold text-slate-400 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-200/60 dark:border-white/[0.08] bg-slate-50/80 dark:bg-black/25">
        <span>Quick Suggestions</span>
        <span className="hidden sm:inline-block text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
          ↑↓ navigate &bull; ↵ select
        </span>
      </div>

      <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.06] py-1">
        {matches.length > 0 ? (
          matches.map((item, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <div
                key={item.href}
                onMouseMove={() => setActiveIndex(idx)}
                onClick={() => handleItemClick(item.href)}
                className={`px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-100 ${
                  isSelected
                    ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-950 dark:text-emerald-300'
                    : 'text-slate-800 dark:text-zinc-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10 hover:text-emerald-900 dark:hover:text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {getTypeBadge(item.type)}
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs font-semibold truncate">
                      {highlightMatch(item.name, query)}
                    </div>
                    {item.description && (
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>

                <ArrowRight
                  className={`w-3.5 h-3.5 flex-shrink-0 text-slate-400 transition-transform ${
                    isSelected ? 'translate-x-1 text-emerald-500 dark:text-emerald-400' : 'opacity-40'
                  }`}
                />
              </div>
            );
          })
        ) : (
          <div className="px-4 py-5 text-xs text-center text-slate-500 dark:text-zinc-400">
            No direct matches for &ldquo;<strong>{query}</strong>&rdquo;. Press{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-[10px] border border-slate-200 dark:border-white/10">
              Enter
            </kbd>{' '}
            to search full documentation.
          </div>
        )}
      </div>

      {/* Footer link to full search */}
      <div className="p-2 border-t border-slate-200/60 dark:border-white/[0.08] bg-slate-50/80 dark:bg-black/35">
        <Link
          href={`/Docs/Search/${encodeURIComponent(query.trim())}`}
          onClick={() => {
            onClose();
            if (onSelect) onSelect();
          }}
          className="w-full px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/50 dark:hover:bg-white/5 flex items-center justify-between transition-colors no-underline hover:no-underline"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span>Search all results for</span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
              &ldquo;{query}&rdquo;
            </span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-zinc-400 flex-shrink-0">
            ↵ Enter
          </span>
        </Link>
      </div>
    </div>
  );
}
