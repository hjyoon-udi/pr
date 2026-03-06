import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '재무 데이터 시각화 분석',
  description: '누구나 쉽게 이해할 수 있는 국내 기업 재무 데이터 시각화 분석 서비스',
  keywords: ['재무분석', '주식', '기업분석', 'OpenDART', '재무제표'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm sm:text-base">재무 분석</span>
            </div>
            <a
              href="https://dart.fss.or.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              데이터: OpenDART
            </a>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
