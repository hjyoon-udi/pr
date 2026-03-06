/**
 * 금액 문자열(쉼표 포함)을 숫자로 변환
 */
export function parseAmount(amount: string | undefined): number {
  if (!amount) return 0;
  const num = parseFloat(amount.replace(/,/g, ''));
  return isNaN(num) ? 0 : num;
}

/**
 * 숫자를 억/조 단위로 포맷팅
 */
export function formatAmount(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000_000) {
    return `${sign}${(abs / 1_000_000_000_000).toFixed(1)}조`;
  }
  if (abs >= 100_000_000) {
    return `${sign}${Math.round(abs / 100_000_000).toLocaleString()}억`;
  }
  if (abs >= 10_000) {
    return `${sign}${Math.round(abs / 10_000).toLocaleString()}만`;
  }
  return `${sign}${abs.toLocaleString()}`;
}

/**
 * 차트 축 레이블용 짧은 포맷
 */
export function formatAxisAmount(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000_000) {
    return `${sign}${(abs / 1_000_000_000_000).toFixed(0)}조`;
  }
  if (abs >= 100_000_000) {
    return `${sign}${(abs / 100_000_000).toFixed(0)}억`;
  }
  return `${sign}${(abs / 10_000).toFixed(0)}만`;
}

/**
 * 퍼센트 계산
 */
export function calcPercent(value: number, total: number): string {
  if (total === 0) return '-';
  return `${((value / total) * 100).toFixed(1)}%`;
}
