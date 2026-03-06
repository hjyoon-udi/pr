# AI 개인 브랜딩 모바일 랜딩페이지

AI 활용이 막막한 직장인을 위한 실무 AI 협업 방안을 소개하는 개인 브랜딩 모바일 랜딩페이지입니다.

## 📋 프로젝트 개요

이 프로젝트는 다음을 목표로 합니다:
- 업무 생산성 극대화를 위한 AI 활용법 제시
- 창의적인 일에 집중하는 즐거움 제공
- 모바일 최적화된 사용자 경험 제공

## 🎯 주요 내용

### 1. AI 워크스마트
실전 AI 활용법과 성공 사례를 공유합니다.
- ChatGPT 등 주요 AI 도구 활용법
- 직장에서 바로 쓸 수 있는 팁

### 2. AI 동료 만들기
No-code/Low-code 기반 업무 자동화 방법을 배웁니다.
- 코딩 없이 AI 활용하기
- 반복 업무 자동화

### 3. AI로 데이터 인사이트
데이터 분석과 시각화를 통해 빠른 의사결정을 돕습니다.
- 복잡한 데이터를 인사이트로 변환
- 데이터 기반 의사결정

## 🚀 시작하기

### 파일 구조

```
pr/
├── index.html      # HTML 구조
├── styles.css      # 스타일시트
├── script.js       # JavaScript 인터랙션
└── README.md       # 이 파일
```

### 로컬에서 실행하기

#### 방법 1: Python HTTP 서버 (권장)
```bash
cd /Users/underedogs/Downloads/cursor
python3 -m http.server 8000
```

#### 방법 2: Node.js HTTP 서버
```bash
npm install -g http-server
cd /Users/underedogs/Downloads/cursor
http-server
```

#### 방법 3: Live Server (VS Code 확장)
1. Live Server 확장 프로그램 설치
2. `index.html` 파일에서 우클릭
3. "Open with Live Server" 선택

### 브라우저에서 접속
- **로컬 주소**: `http://localhost:8000/pr/index.html`
- **포트 변경**: 위 명령어에서 `8000`을 다른 포트번호로 변경 가능

## 📱 반응형 디자인

모든 화면 크기에 최적화되었습니다:
- **모바일** (≤ 480px)
- **태블릿** (481px ~ 768px)
- **데스크톱** (≥ 769px)

개발자 도구에서 반응형 디자인 모드(DevTools)로 테스트 가능합니다.

## 🎨 디자인 특징

### 컬러 팔레트
- **메인 컬러**: 보라색 (#5b4cff)
- **서브 컬러**: 라이트 보라색 (#7c6ee6)
- **배경**: 화이트 (#ffffff), 라이트 그레이 (#f9f7ff)
- **텍스트**: 어두운 회색 (#1a1a2e), 중간 회색 (#6b6b8a)

### 타이포그래피
- **폰트**: Noto Sans KR (Google Fonts)
- **가중치**: 300 (Light), 400 (Regular), 600 (Semi-bold), 700 (Bold)

### 애니메이션
- 스크롤 시 콘텐츠 카드 fade-in 애니메이션
- 호버 시 카드 위로 떠오르는 효과
- 부드러운 트랜지션 (0.3s)

## 🔧 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: 그리드 레이아웃, 플렉스박스, 그라데이션
- **JavaScript**: IntersectionObserver API (스크롤 애니메이션)
- **Google Fonts**: Noto Sans KR 한글 폰트

## 📝 주요 섹션

### Hero Section
- 프로필 이미지 (원형 아바타)
- 인사말과 직함
- 메인 슬로건 및 설명

### Content Cards Section
- 3개의 주제별 카드
- 각 카드에 아이콘, 제목, 부제, 설명 포함
- 마우스 호버 시 인터랙션

### CTA Section
- "커피챗 신청하기" 버튼
- 호출 배경 (Call-to-Action)

### Footer
- 연락처 정보 (이메일, 전화)
- 저작권 표시

## 🔗 추후 작업

- [ ] Google Forms 링크 연결 (CTA 버튼)
- [ ] Analytics 추가
- [ ] 추가 콘텐츠 섹션
- [ ] 블로그 연동

## 📧 연락처

- **이메일**: hjyoon@udimpact.ai
- **전화**: 010-2933-0000
- **회사**: UD IMPACT

## 📄 라이센스

© 2024 UD IMPACT. All rights reserved.

## 🙋 피드백 및 수정 사항

페이지 개선 사항이나 버그 리포트는 위 연락처로 문의 바랍니다.

---

**마지막 업데이트**: 2024년 3월
