# Vercel 배포 가이드

이 프로젝트를 Vercel에 배포하는 방법을 설명합니다.

## 사전 준비

### 1. GitHub 저장소 연결
- GitHub 계정이 필요합니다.
- 프로젝트가 이미 GitHub에 푸시되어 있어야 합니다.
- 현재 저장소: `https://github.com/hjyoon-udi/pr`

### 2. 필수 API 키 준비
배포 전에 다음 두 개의 API 키를 준비하세요:

- **OpenDART API 키**: https://opendart.fss.or.kr 에서 발급
- **Gemini API 키**: https://aistudio.google.com 에서 발급

## 배포 단계

### Step 1: Vercel에 로그인
1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. "New Project" 또는 "Add New..." 클릭

### Step 2: 저장소 선택
1. 프로젝트 저장소 선택: `hjyoon-udi/pr`
2. Root Directory: `finance` 설정 (중요!)
3. "Deploy" 클릭

### Step 3: 환경변수 설정
1. 배포 중 자동으로 환경변수 설정 화면이 나타나거나,
2. 프로젝트 설정 → Settings → Environment Variables 이동

다음 환경변수 추가:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `OPENDART_API_KEY` | (발급받은 키) | OpenDART API 인증키 |
| `GEMINI_API_KEY` | (발급받은 키) | Google Gemini API 키 |

**주의**: 값을 정확하게 입력하세요. 오타가 있으면 API 호출이 실패합니다.

### Step 4: 배포 완료
- Vercel이 자동으로 빌드 및 배포를 시작합니다.
- 배포 완료 후 URL이 제공됩니다.
- 예: `https://your-project-name.vercel.app`

## 배포 후 확인

### 1. 기본 기능 테스트
- 메인 페이지 접속 가능 여부 확인
- 기업 검색 기능 테스트
- "재무 데이터 조회" 버튼 클릭 시 데이터 로드 확인

### 2. API 호출 테스트
- 차트가 정상적으로 표시되는지 확인
- "AI 분석" 버튼 클릭 시 분석 결과 표시 확인

### 3. 에러 모니터링
- Vercel 대시보드 → Functions → 로그 확인
- 에러 발생 시 다음 사항 확인:
  - 환경변수가 정확하게 설정되었는지
  - API 키가 유효한지
  - 네트워크 연결 상태

## 문제 해결

### 환경변수 오류
**증상**: "API 키가 설정되지 않았습니다" 에러

**해결**:
1. Vercel 대시보드에서 환경변수 재확인
2. 변수명 정확성 확인 (대소문자 구분)
3. "Redeploy" 버튼으로 재배포

### API 응답 오류
**증상**: "OpenDART 서버 오류" 또는 "AI 분석 오류"

**해결**:
1. API 키 유효성 확인 (OpenDART/Google AI Studio 웹사이트 확인)
2. API 요청 한도 확인
3. 네트워크 상태 확인

### 빌드 실패
**증상**: "Build failed" 메시지

**해결**:
1. 로컬에서 `npm run build` 실행하여 빌드 에러 확인
2. TypeScript 타입 오류 확인: `npx tsc --noEmit`
3. 필요한 의존성 설치: `npm install`

## 보안 주의사항

- **API 키 절대 커밋 금지**: `.env.local`은 `.gitignore`에 포함되어 있습니다.
- **Vercel 환경변수 사용**: 배포 환경에서는 반드시 Vercel 대시보드에서 환경변수를 설정하세요.
- **공개 저장소 주의**: 프라이빗 저장소 사용을 권장합니다.

## 커스텀 도메인 설정 (선택사항)

1. Vercel 프로젝트 설정 → Domains
2. "Add Domain" 클릭
3. 도메인 입력 및 DNS 설정 완료

## 자동 배포 설정

Vercel은 기본적으로 다음 조건에서 자동 배포합니다:
- GitHub `main` 또는 `master` 브랜치에 푸시할 때
- Pull Request 생성/업데이트할 때 (Preview 배포)

브랜치 변경 시:
1. Vercel 대시보드 → Settings → Git
2. "Production Branch" 변경

## 참고 자료

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [OpenDART API 문서](https://opendart.fss.or.kr)
- [Google Gemini API 문서](https://ai.google.dev)
