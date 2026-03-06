'use client';

import { useState } from 'react';
import { Corp, FinancialAccount, ReportCode, REPORT_CODE_LABELS } from '@/types';
import BalanceSheetChart from './BalanceSheetChart';
import IncomeStatementChart from './IncomeStatementChart';
import AIAnalysis from './AIAnalysis';

interface FinancialDashboardProps {
  corp: Corp;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 2015 + 1 }, (_, i) =>
  String(CURRENT_YEAR - i)
);

type FsDivType = 'CFS' | 'OFS';

export default function FinancialDashboard({ corp }: FinancialDashboardProps) {
  const [bsnsYear, setBsnsYear] = useState(String(CURRENT_YEAR - 1));
  const [reprtCode, setReprtCode] = useState<ReportCode>('11011');
  const [fsDiv, setFsDiv] = useState<FsDivType>('CFS');
  const [activeTab, setActiveTab] = useState<'BS' | 'IS'>('BS');

  const [financialData, setFinancialData] = useState<FinancialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const fetchFinancialData = async () => {
    setIsLoading(true);
    setError('');
    setFinancialData([]);
    setHasFetched(false);

    try {
      const params = new URLSearchParams({
        corp_code: corp.corp_code,
        bsns_year: bsnsYear,
        reprt_code: reprtCode,
      });

      const response = await fetch(`/api/financial?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '데이터를 불러오는 중 오류가 발생했습니다.');
        return;
      }

      if (!data.list || data.list.length === 0) {
        setError('해당 연도/보고서의 재무 데이터가 없습니다.');
        return;
      }

      setFinancialData(data.list);
      const hasCfs = data.list.some((d: FinancialAccount) => d.fs_div === 'CFS');
      setFsDiv(hasCfs ? 'CFS' : 'OFS');
      setHasFetched(true);
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = financialData.filter((d) => d.fs_div === fsDiv);
  const bsData = filteredData.filter((d) => d.sj_div === 'BS');
  const isData = filteredData.filter((d) => d.sj_div === 'IS');
  const hasCfs = financialData.some((d) => d.fs_div === 'CFS');
  const hasOfs = financialData.some((d) => d.fs_div === 'OFS');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{corp.corp_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              {corp.stock_code?.trim() && (
                <span className="text-sm px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-mono">
                  {corp.stock_code}
                </span>
              )}
              <span className="text-sm px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-mono">
                {corp.corp_code}
              </span>
              {corp.corp_eng_name && (
                <span className="text-sm text-gray-400">{corp.corp_eng_name}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">사업연도</label>
            <select
              value={bsnsYear}
              onChange={(e) => setBsnsYear(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">보고서 종류</label>
            <select
              value={reprtCode}
              onChange={(e) => setReprtCode(e.target.value as ReportCode)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
            >
              {(Object.entries(REPORT_CODE_LABELS) as [ReportCode, string][]).map(([code, label]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchFinancialData}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                조회 중...
              </span>
            ) : (
              '재무 데이터 조회'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {hasFetched && financialData.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {(hasCfs && hasOfs) && (
                <>
                  <button
                    onClick={() => setFsDiv('CFS')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      fsDiv === 'CFS'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    연결재무제표
                  </button>
                  <button
                    onClick={() => setFsDiv('OFS')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      fsDiv === 'OFS'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    재무제표(별도)
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setShowAIAnalysis(true)}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI 분석
              </span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('BS')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'BS'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                재무상태표
              </button>
              <button
                onClick={() => setActiveTab('IS')}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                  activeTab === 'IS'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                손익계산서
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'BS' && bsData.length > 0 && (
                <BalanceSheetChart data={bsData} />
              )}
              {activeTab === 'IS' && isData.length > 0 && (
                <IncomeStatementChart data={isData} />
              )}
              {activeTab === 'BS' && bsData.length === 0 && (
                <p className="text-center text-gray-400 py-8">재무상태표 데이터가 없습니다.</p>
              )}
              {activeTab === 'IS' && isData.length === 0 && (
                <p className="text-center text-gray-400 py-8">손익계산서 데이터가 없습니다.</p>
              )}
            </div>
          </div>

          {showAIAnalysis && (
            <AIAnalysis
              corpName={corp.corp_name}
              bsnsYear={bsnsYear}
              reprtCode={reprtCode}
              financialData={financialData.filter((d) => d.fs_div === fsDiv)}
              triggerAnalysis={showAIAnalysis}
              onAnalysisComplete={() => {
                // Analysis complete
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
