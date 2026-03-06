'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';
import { Corp } from '@/types';

interface SearchBarProps {
  onSelect: (corp: Corp) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Corp[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [corpList, setCorpList] = useState<Corp[]>([]);
  const [fuseInstance, setFuseInstance] = useState<Fuse<Corp> | null>(null);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('/corp_list.json')
      .then((res) => res.json())
      .then((data: Corp[]) => {
        setCorpList(data);
        const fuse = new Fuse(data, {
          keys: [
            { name: 'corp_name', weight: 0.6 },
            { name: 'corp_eng_name', weight: 0.3 },
            { name: 'stock_code', weight: 0.1 },
          ],
          threshold: 0.3,
          includeScore: true,
          minMatchCharLength: 1,
        });
        setFuseInstance(fuse);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      setHighlighted(-1);
      if (!value.trim() || !fuseInstance) {
        setResults([]);
        setIsOpen(false);
        return;
      }
      const fuseResults = fuseInstance.search(value, { limit: 10 });
      const corps = fuseResults.map((r) => r.item);
      setResults(corps);
      setIsOpen(corps.length > 0);
    },
    [fuseInstance]
  );

  const handleSelect = (corp: Corp) => {
    setQuery(corp.corp_name);
    setIsOpen(false);
    setResults([]);
    onSelect(corp);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      handleSelect(results[highlighted]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={
            isLoading
              ? '기업 목록 로딩 중...'
              : `기업명 또는 종목코드로 검색 (${corpList.length.toLocaleString()}개 기업)`
          }
          disabled={isLoading}
          className="w-full pl-12 pr-4 py-4 text-lg bg-white border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:cursor-wait"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-80 overflow-y-auto">
          {results.map((corp, idx) => (
            <button
              key={corp.corp_code}
              onClick={() => handleSelect(corp)}
              className={`w-full text-left px-5 py-3 flex items-center justify-between transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                idx === highlighted ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div>
                <span className="font-semibold text-gray-900">{corp.corp_name}</span>
                {corp.corp_eng_name && (
                  <span className="ml-2 text-sm text-gray-400">{corp.corp_eng_name}</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {corp.stock_code?.trim() && (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-mono">
                    {corp.stock_code}
                  </span>
                )}
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full font-mono">
                  {corp.corp_code}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
