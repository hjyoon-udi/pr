'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FinancialDashboard from '@/components/FinancialDashboard';
import { Corp } from '@/types';

export default function HomePage() {
  const [selectedCorp, setSelectedCorp] = useState<Corp | null>(null);

  const handleSelect = (corp: Corp) => {
    setSelectedCorp(corp);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          기업 재무 데이터 분석
        </h1>
        <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          국내 상장·비상장 기업의 재무제표를 시각화하고
          AI로 쉽게 분석해드립니다
        </p>

        <div className="flex justify-center">
          <SearchBar onSelect={handleSelect} />
        </div>

        {!selectedCorp && (
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {['삼성전자', '카카오', 'SK하이닉스', 'NAVER', '현대자동차'].map((name) => (
              <span key={name} className="text-xs px-3 py-1.5 bg-white border border-gray-200 text-gray-500 rounded-full shadow-sm">
                예: {name}
              </span>
            ))}
          </div>
        )}
      </div>

      {selectedCorp && (
        <div>
          <FinancialDashboard corp={selectedCorp} />
        </div>
      )}

      {!selectedCorp && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">기업 검색</h3>
            <p className="text-xs text-gray-500">3,864개 기업을 이름 또는 종목코드로 빠르게 검색</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">재무 시각화</h3>
            <p className="text-xs text-gray-500">재무상태표·손익계산서를 직관적인 차트로 표현</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI 분석</h3>
            <p className="text-xs text-gray-500">Gemini AI가 전문 용어 없이 쉽게 재무 상태를 설명</p>
          </div>
        </div>
      )}
    </div>
  );
}
