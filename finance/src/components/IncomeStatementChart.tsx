'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import { FinancialAccount } from '@/types';
import { parseAmount, formatAmount, formatAxisAmount } from '@/lib/utils';

interface IncomeStatementChartProps {
  data: FinancialAccount[];
}

const COLORS = {
  revenue: '#3B82F6',
  operating: '#10B981',
  net: '#8B5CF6',
  prevRevenue: '#93C5FD',
  prevOperating: '#6EE7B7',
  prevNet: '#C4B5FD',
  bfeRevenue: '#DBEAFE',
};

function getAccountValue(data: FinancialAccount[], name: string, period: 'current' | 'prev' | 'bfe'): number {
  const acc = data.find((d) => d.account_nm === name);
  if (!acc) return 0;
  if (period === 'current') return parseAmount(acc.thstrm_amount);
  if (period === 'prev') return parseAmount(acc.frmtrm_amount);
  return parseAmount(acc.bfefrmtrm_amount);
}

function getPeriodLabel(data: FinancialAccount[], period: 'current' | 'prev' | 'bfe'): string {
  const acc = data[0];
  if (!acc) return '';
  if (period === 'current') return acc.thstrm_nm || '당기';
  if (period === 'prev') return acc.frmtrm_nm || '전기';
  return acc.bfefrmtrm_nm || '전전기';
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{formatAmount(entry.value)}원</span>
        </div>
      ))}
    </div>
  );
};

export default function IncomeStatementChart({ data }: IncomeStatementChartProps) {
  if (!data || data.length === 0) return null;

  const hasBfe = data.some((d) => !!d.bfefrmtrm_amount);
  const currentLabel = getPeriodLabel(data, 'current');
  const prevLabel = getPeriodLabel(data, 'prev');
  const bfeLabel = getPeriodLabel(data, 'bfe');

  const revenue = getAccountValue(data, '매출액', 'current');
  const operatingProfit = getAccountValue(data, '영업이익', 'current');
  const netIncome = getAccountValue(data, '당기순이익(손실)', 'current');
  const prevRevenue = getAccountValue(data, '매출액', 'prev');

  const operatingMargin = revenue > 0 ? ((operatingProfit / revenue) * 100).toFixed(1) : '-';
  const netMargin = revenue > 0 ? ((netIncome / revenue) * 100).toFixed(1) : '-';
  const revenueGrowth =
    prevRevenue > 0 ? (((revenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : '-';

  const mainItems = ['매출액', '영업이익', '당기순이익(손실)'];
  const barData = mainItems.map((name) => ({
    name: name === '당기순이익(손실)' ? '당기순이익' : name,
    [currentLabel]: getAccountValue(data, name, 'current'),
    [prevLabel]: getAccountValue(data, name, 'prev'),
    ...(hasBfe ? { [bfeLabel]: getAccountValue(data, name, 'bfe') } : {}),
  }));

  const trendItems = ['매출액', '영업이익', '당기순이익(손실)'];
  const periods = hasBfe
    ? [bfeLabel, prevLabel, currentLabel]
    : [prevLabel, currentLabel];

  const trendData = periods.map((period, idx) => {
    const periodKey = idx === 0 && hasBfe ? 'bfe' : idx === 0 ? 'prev' : idx === 1 && hasBfe ? 'prev' : 'current';
    return {
      period,
      매출액: getAccountValue(data, '매출액', periodKey as 'current' | 'prev' | 'bfe'),
      영업이익: getAccountValue(data, '영업이익', periodKey as 'current' | 'prev' | 'bfe'),
      당기순이익: getAccountValue(data, '당기순이익(손실)', periodKey as 'current' | 'prev' | 'bfe'),
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-blue-600 font-medium mb-1">매출액</p>
          <p className="text-xl font-bold text-blue-700">{formatAmount(revenue)}원</p>
          {revenueGrowth !== '-' && (
            <p className={`text-xs mt-1 font-medium ${parseFloat(revenueGrowth) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              전기 대비 {parseFloat(revenueGrowth) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(revenueGrowth))}%
            </p>
          )}
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-emerald-600 font-medium mb-1">영업이익 ({operatingMargin}%)</p>
          <p className={`text-xl font-bold ${operatingProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            {formatAmount(operatingProfit)}원
          </p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-purple-600 font-medium mb-1">당기순이익 ({netMargin}%)</p>
          <p className={`text-xl font-bold ${netIncome >= 0 ? 'text-purple-700' : 'text-red-600'}`}>
            {formatAmount(netIncome)}원
          </p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-3">주요 손익 항목 비교</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#6B7280' }} />
            <YAxis tickFormatter={formatAxisAmount} tick={{ fontSize: 11, fill: '#9CA3AF' }} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#9CA3AF" />
            <Bar dataKey={currentLabel} fill={COLORS.revenue} radius={[4, 4, 0, 0]} />
            <Bar dataKey={prevLabel} fill={COLORS.prevRevenue} radius={[4, 4, 0, 0]} />
            {hasBfe && <Bar dataKey={bfeLabel} fill={COLORS.bfeRevenue} radius={[4, 4, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {trendData.length >= 2 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-3">손익 추이</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tickFormatter={formatAxisAmount} tick={{ fontSize: 10, fill: '#9CA3AF' }} width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={0} stroke="#9CA3AF" />
              <Line type="monotone" dataKey="매출액" stroke={COLORS.revenue} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="영업이익" stroke={COLORS.operating} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="당기순이익" stroke={COLORS.net} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
