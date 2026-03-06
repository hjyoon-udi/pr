'use client';

import { useState, useEffect } from 'react';
import { FinancialAccount } from '@/types';
import { REPORT_CODE_LABELS, ReportCode } from '@/types';

interface AIAnalysisProps {
  corpName: string;
  bsnsYear: string;
  reprtCode: string;
  financialData: FinancialAccount[];
  triggerAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}

export default function AIAnalysis({
  corpName,
  bsnsYear,
  reprtCode,
  financialData,
  triggerAnalysis = false,
  onAnalysisComplete,
}: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('');

  const reprtName = REPORT_CODE_LABELS[reprtCode as ReportCode] || reprtCode;

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError('');
    setAnalysis('');
    setModel('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          corp_name: corpName,
          bsns_year: bsnsYear,
          reprt_name: reprtName,
          financialData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'AI 분석 중 오류가 발생했습니다.');
        return;
      }

      setAnalysis(data.analysis);
      setModel(data.model);
      onAnalysisComplete?.();
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (triggerAnalysis && !isLoading && !analysis) {
      handleAnalyze();
    }
  }, [triggerAnalysis]);

  const formatAnalysis = (text: string) => {
    return text
      .split('\n')
      .map((line, idx) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h4 key={idx} className="font-bold text-gray-900 mt-4 mb-2 text-base">
              {line.replace(/\*\*/g, '')}
            </h4>
          );
        }
        if (/^\*\*.*\*\*/.test(line)) {
          return (
            <p key={idx} className="mb-1 text-sm leading-relaxed text-gray-700">
              {line.split(/\*\*(.*?)\*\*/).map((part, i) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </p>
          );
        }
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={idx} className="ml-5 mb-2 text-sm text-gray-700 list-decimal leading-relaxed">
              {line.replace(/^\d+\.\s/, '')}
            </li>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <li key={idx} className="ml-5 mb-1 text-sm text-gray-700 list-disc leading-relaxed">
              {line.replace(/^- /, '')}
            </li>
          );
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-1" />;
        }
        return (
          <p key={idx} className="mb-1 text-sm text-gray-700 leading-relaxed">
            {line}
          </p>
        );
      });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">투자자 관점 분석</h3>
            <p className="text-xs text-gray-500">Gemini AI가 제공하는 투자 인사이트</p>
          </div>
        </div>
        {analysis && (
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="px-4 py-2 bg-white text-indigo-600 text-sm font-medium rounded-xl border border-indigo-200 hover:bg-indigo-50 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '분석 중...' : '다시 분석'}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-indigo-700">AI가 투자 분석을 진행하는 중...</p>
            <p className="text-xs text-gray-500 mt-1">{corpName}의 {bsnsYear}년 {reprtName} 분석</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <p className="font-medium mb-1">오류 발생</p>
          <p>{error}</p>
          <button
            onClick={handleAnalyze}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}

      {analysis && !isLoading && (
        <div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-indigo-100">
            <div className="prose prose-sm max-w-none">
              {formatAnalysis(analysis)}
            </div>
          </div>
          {model && (
            <p className="text-xs text-gray-400 mt-2 text-right">
              Powered by {model}
            </p>
          )}
        </div>
      )}

      {!isLoading && !analysis && !error && !triggerAnalysis && (
        <div className="text-center py-6 text-gray-400 text-sm">
          <p>위의 [AI 분석] 버튼을 클릭하면 투자 분석을 시작합니다.</p>
          <p className="mt-1 text-xs">전문 용어 없이 투자자 관점에서 쉽게 설명해드립니다.</p>
        </div>
      )}
    </div>
  );
}
