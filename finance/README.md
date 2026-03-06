# 재무 데이터 시각화 분석 서비스

국내 기업(상장·비상장)의 재무제표를 시각화하고, Gemini AI로 누구나 이해할 수 있게 분석해주는 서비스입니다.

## 주요 기능

- **기업 검색**: 3,864개 기업을 이름 또는 종목코드로 퍼지 검색
- **재무 시각화**: 재무상태표·손익계산서를 Recharts 차트로 직관적으로 표현
- **AI 분석**: Gemini AI가 재무 데이터를 비전문가도 이해할 수 있는 언어로 설명
- **연결/별도 재무제표 전환**: CFS(연결), OFS(별도) 선택 가능
- **연도·보고서 선택**: 2015년 이후 사업보고서·반기·분기 보고서 조회

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS v4 |
| 차트 | Recharts |
| 검색 | Fuse.js |
| 데이터 소스 | OpenDART API |
| AI 분석 | Google Gemini 2.0 Flash |
| 배포 | Vercel |

## 로컬 개발 시작

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repo-url>
cd finance
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력하세요:

```env
OPENDART_API_KEY=your_opendart_api_key
GEMINI_API_KEY=your_gemini_api_key
```

- OpenDART API 키: https://opendart.fss.or.kr 에서 발급
- Gemini API 키: https://aistudio.google.com 에서 발급

### 3. 기업 목록 데이터 준비

corp.xml 파일(OpenDART에서 다운로드)을 프로젝트 상위 폴더에 위치시키고 실행:

```bash
npm run prepare-data
```

또는 corp.xml 경로를 직접 지정:

```bash
CORP_XML_PATH=/path/to/corp.xml node scripts/convert-xml.js
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인하세요.

## Vercel 배포

1. Vercel에 프로젝트 연결
2. **Environment Variables** 설정:
   - `OPENDART_API_KEY`: OpenDART API 키
   - `GEMINI_API_KEY`: Gemini API 키
3. `public/corp_list.json` 파일이 포함되어 있는지 확인 (git에 포함 필요)
4. Deploy

> **참고**: `.env.local`은 `.gitignore`에 포함되어 있어 커밋되지 않습니다. Vercel 환경변수는 대시보드에서 직접 설정하세요.

## 프로젝트 구조

```
finance/
├── scripts/
│   └── convert-xml.js          # corp.xml → JSON 변환 스크립트
├── public/
│   └── corp_list.json          # 변환된 기업 목록 (3,864개)
├── src/
│   ├── app/
│   │   ├── page.tsx            # 메인 페이지
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── financial/      # OpenDART API 프록시
│   │       └── analyze/        # Gemini AI 분석 API
│   ├── components/
│   │   ├── SearchBar.tsx       # 기업 검색
│   │   ├── FinancialDashboard.tsx
│   │   ├── BalanceSheetChart.tsx
│   │   ├── IncomeStatementChart.tsx
│   │   └── AIAnalysis.tsx
│   ├── types/index.ts
│   └── lib/utils.ts
```

## 데이터 출처

- 기업 목록: OpenDART 고유번호 파일 (corp.xml)
- 재무 데이터: OpenDART 단일회사 주요계정 API (`fnlttSinglAcnt`)
- 2015년 이후 사업보고서 데이터 제공
