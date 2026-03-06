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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { FinancialAccount } from '@/types';
import { parseAmount, formatAmount, formatAxisAmount } from '@/lib/utils';

interface BalanceSheetChartProps {
  data: FinancialAccount[];
}

const COLORS = {
  current: '#3B82F6',
  prev: '#93C5FD',
  bfePrev: '#DBEAFE',
  assets: '#10B981',
  liabilities: '#EF4444',
  equity: '#8B5CF6',
  currentAssets: '#34D399',
  nonCurrentAssets: '#6EE7B7',
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

export default function BalanceSheetChart({ data }: BalanceSheetChartProps) {
  if (!data || data.length === 0) return null;

  const hasBfe = data.some((d) => !!d.bfefrmtrm_amount);
  const currentLabel = getPeriodLabel(data, 'current');
  const prevLabel = getPeriodLabel(data, 'prev');
  const bfeLabel = getPeriodLabel(data, 'bfe');

  const mainItems = ['자산총계', '부채총계', '자본총계'];
  const barData = mainItems.map((name) => ({
    name,
    [currentLabel]: getAccountValue(data, name, 'current'),
    [prevLabel]: getAccountValue(data, name, 'prev'),
    ...(hasBfe ? { [bfeLabel]: getAccountValue(data, name, 'bfe') } : {}),
  }));

  const detailItems = ['유동자산', '비유동자산', '유동부채', '비유동부채'];
  const detailData = detailItems.map((name) => ({
    name,
    [currentLabel]: getAccountValue(data, name, 'current'),
    [prevLabel]: getAccountValue(data, name, 'prev'),
  }));

  const currentAssets = getAccountValue(data, '유동자산', 'current');
  const nonCurrentAssets = getAccountValue(data, '비유동자산', 'current');
  const pieData = [
    { name: '유동자산', value: currentAssets },
    { name: '비유동자산', value: nonCurrentAssets },
  ].filter((d) => d.value > 0);

  const totalAssets = getAccountValue(data, '자산총계', 'current');
  const totalLiabilities = getAccountValue(data, '부채총계', 'current');
  const totalEquity = getAccountValue(data, '자본총계', 'current');
  const debtRatio = totalEquity > 0 ? ((totalLiabilities / totalEquity) * 100).toFixed(1) : '-';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-emerald-600 font-medium mb-1">자산총계</p>
          <p className="text-xl font-bold text-emerald-700">{formatAmount(totalAssets)}원</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-red-600 font-medium mb-1">부채총계</p>
          <p className="text-xl font-bold text-red-600">{formatAmount(totalLiabilities)}원</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-purple-600 font-medium mb-1">자본총계 (부채비율 {debtRatio}%)</p>
          <p className="text-xl font-bold text-purple-700">{formatAmount(totalEquity)}원</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-600 mb-3">자산·부채·자본 비교</h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#6B7280' }} />
            <YAxis tickFormatter={formatAxisAmount} tick={{ fontSize: 11, fill: '#9CA3AF' }} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey={currentLabel} fill={COLORS.current} radius={[4, 4, 0, 0]} />
            <Bar dataKey={prevLabel} fill={COLORS.prev} radius={[4, 4, 0, 0]} />
            {hasBfe && <Bar dataKey={bfeLabel} fill={COLORS.bfePrev} radius={[4, 4, 0, 0]} />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-3">유동/비유동 자산·부채 비교</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={detailData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis tickFormatter={formatAxisAmount} tick={{ fontSize: 10, fill: '#9CA3AF' }} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey={currentLabel} fill={COLORS.current} radius={[3, 3, 0, 0]} />
              <Bar dataKey={prevLabel} fill={COLORS.prev} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {pieData.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-600 mb-3">자산 구성 ({currentLabel})</h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={false}
                  labelLine={false}
                >
                  <Cell fill={COLORS.currentAssets} />
                  <Cell fill={COLORS.nonCurrentAssets} />
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) => [`${formatAmount(value ?? 0)}원`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
