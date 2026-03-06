export interface Corp {
  corp_code: string;
  corp_name: string;
  corp_eng_name: string;
  stock_code: string;
  modify_date: string;
}

export interface FinancialAccount {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  stock_code: string;
  fs_div: 'CFS' | 'OFS';
  fs_nm: string;
  sj_div: 'BS' | 'IS';
  sj_nm: string;
  account_nm: string;
  thstrm_nm: string;
  thstrm_dt: string;
  thstrm_amount: string;
  thstrm_add_amount?: string;
  frmtrm_nm: string;
  frmtrm_dt: string;
  frmtrm_amount: string;
  frmtrm_add_amount?: string;
  bfefrmtrm_nm?: string;
  bfefrmtrm_dt?: string;
  bfefrmtrm_amount?: string;
  ord: string;
  currency: string;
}

export interface OpenDartResponse {
  status: string;
  message: string;
  list?: FinancialAccount[];
}

export interface FinancialParams {
  corp_code: string;
  bsns_year: string;
  reprt_code: string;
}

export type ReportCode = '11011' | '11012' | '11013' | '11014';

export const REPORT_CODE_LABELS: Record<ReportCode, string> = {
  '11011': '사업보고서',
  '11012': '반기보고서',
  '11013': '1분기보고서',
  '11014': '3분기보고서',
};

export const KEY_ACCOUNTS_BS = [
  '유동자산',
  '비유동자산',
  '자산총계',
  '유동부채',
  '비유동부채',
  '부채총계',
  '자본금',
  '이익잉여금',
  '자본총계',
];

export const KEY_ACCOUNTS_IS = [
  '매출액',
  '영업이익',
  '법인세차감전 순이익',
  '당기순이익(손실)',
];
