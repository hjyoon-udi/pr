import { NextRequest, NextResponse } from 'next/server';
import { FinancialAccount } from '@/types';
import { parseAmount, formatAmount } from '@/lib/utils';

interface AnalyzeRequest {
  corp_name: string;
  bsns_year: string;
  reprt_name: string;
  financialData: FinancialAccount[];
}

function buildPrompt(data: AnalyzeRequest): string {
  const { corp_name, bsns_year, reprt_name, financialData } = data;

  const cfsBS = financialData.filter((d) => d.fs_div === 'CFS' && d.sj_div === 'BS');
  const cfsIS = financialData.filter((d) => d.fs_div === 'CFS' && d.sj_div === 'IS');
  const ofsBS = financialData.filter((d) => d.fs_div === 'OFS' && d.sj_div === 'BS');
  const ofsIS = financialData.filter((d) => d.fs_div === 'OFS' && d.sj_div === 'IS');

  const bsData = cfsBS.length > 0 ? cfsBS : ofsBS;
  const isData = cfsIS.length > 0 ? cfsIS : ofsIS;
  const fsType = cfsBS.length > 0 ? '연결재무제표' : '재무제표';

  const getAmount = (accounts: FinancialAccount[], name: string): number => {
    const acc = accounts.find((a) => a.account_nm === name);
    return acc ? parseAmount(acc.thstrm_amount) : 0;
  };

  const getPrevAmount = (accounts: FinancialAccount[], name: string): number => {
    const acc = accounts.find((a) => a.account_nm === name);
    return acc ? parseAmount(acc.frmtrm_amount) : 0;
  };

  const totalAssets = getAmount(bsData, '자산총계');
  const totalLiabilities = getAmount(bsData, '부채총계');
  const totalEquity = getAmount(bsData, '자본총계');
  const revenue = getAmount(isData, '매출액');
  const prevRevenue = getPrevAmount(isData, '매출액');
  const operatingProfit = getAmount(isData, '영업이익');
  const netIncome = getAmount(isData, '당기순이익(손실)');

  const debtRatio = totalEquity > 0 ? ((totalLiabilities / totalEquity) * 100).toFixed(1) : '-';
  const operatingMargin = revenue > 0 ? ((operatingProfit / revenue) * 100).toFixed(1) : '-';
  const netMargin = revenue > 0 ? ((netIncome / revenue) * 100).toFixed(1) : '-';
  const revenueGrowth = prevRevenue > 0 ? (((revenue - prevRevenue) / prevRevenue) * 100).toFixed(1) : '-';

  return `당신은 주식 투자 전문가이자 기업 재무 분석가입니다. 아래 재무 데이터를 바탕으로 **일반 개인 투자자도 이해할 수 있도록** 투자 관점에서 분석해주세요.

## 분석 대상 기업
- 회사명: ${corp_name}
- 사업연도: ${bsns_year}년
- 보고서: ${reprt_name}
- 재무제표 유형: ${fsType}

## 주요 재무 지표 (당기)
- 자산총계: ${formatAmount(totalAssets)}원
- 부채총계: ${formatAmount(totalLiabilities)}원
- 자본총계: ${formatAmount(totalEquity)}원
- 부채비율: ${debtRatio}%
- 매출액: ${formatAmount(revenue)}원 (전기 대비 ${revenueGrowth}% 성장)
- 영업이익: ${formatAmount(operatingProfit)}원 (영업이익률 ${operatingMargin}%)
- 당기순이익: ${formatAmount(netIncome)}원 (순이익률 ${netMargin}%)

## 분석 형식 (반드시 이 구조를 따라주세요)

**투자 판단 한 줄 요약** (이 회사를 매수/보유/매도 중 어디에 평가하고 왜인지 한 문장으로)

**투자자 관점에서 이 기업의 재무 건전성**
(이 회사가 "건전한 체질인지", "리스크가 있는지" 쉬운 비유로. 예: "튼튼한 기초를 가진 건물처럼 위험이 낮아요" 등)

**투자하기 전에 꼭 알아야 할 3가지**
1. (성장성/수익성 측면의 장점)
2. (재무 건전성 또는 리스크 측면의 주의점)
3. (일반인이 놓치기 쉬운 중요한 포인트)

**쉽게 설명해드리자면**
(숫자들을 일상적인 상황에 빗대어 설명 - 예: "매출액이 전년도 대비 ~% 증가했다는 것은...")

**투자 결론**
(종합적인 평가: 이 기업에 투자할 가치가 있는지, 어떤 유형의 투자자에게 적합한지 2-3문장)

주의: 
- 전문 용어는 최대한 쉬운 말로 풀어서 설명하고, 금액은 "${formatAmount(revenue)}원" 형태로 표기해주세요.
- 투자 조언이 아닌 객관적인 분석 정보를 제공하고, 최종 투자 결정은 본인 판단에 맡긴다는 점을 명시해주세요.`;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  let body: AnalyzeRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '요청 데이터 파싱 오류' }, { status: 400 });
  }

  if (!body.financialData || body.financialData.length === 0) {
    return NextResponse.json({ error: '재무 데이터가 없습니다.' }, { status: 400 });
  }

  const prompt = buildPrompt(body);

  const models = ['gemini-2.0-flash', 'gemini-2.5-flash'];
  let lastError: string = '';

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        lastError = `${model}: HTTP ${response.status} - ${errorText}`;
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        lastError = `${model}: 응답에서 텍스트를 찾을 수 없습니다.`;
        continue;
      }

      return NextResponse.json({ analysis: text, model });
    } catch (error) {
      lastError = `${model}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      continue;
    }
  }

  console.error('Gemini API 모든 모델 실패:', lastError);
  return NextResponse.json(
    { error: `AI 분석 오류: ${lastError}` },
    { status: 500 }
  );
}
