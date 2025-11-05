# ClassHub - 학급 종합 관리 시스템

## 프로젝트 개요
대한민국 학교 현장에서 실제로 필요한 기능들을 하나의 플랫폼에 통합한 Static 웹 애플리케이션

## 핵심 기능

### 1. 📅 스마트 시간표
- 요일별 시간표 관리
- 교시별 과목, 교사, 교실 정보
- 현재 시간 기준 진행 중인 수업 하이라이트
- 시간표 내보내기/가져오기 (JSON)

### 2. ⏰ D-Day 카운터
- 주요 학사일정 카운트다운 (수능, 시험, 방학 등)
- 시각적 프로그레스 바
- 다중 이벤트 관리
- 알림 기능

### 3. 🍽️ 급식 메뉴
- 주간 급식 메뉴 표시
- 알레르기 정보 표시
- 급식 평가 기능
- NEIS API 연동 준비 (향후 확장)

### 4. ⏱️ 학습 타이머
- 뽀모도로 타이머 (25분 집중 + 5분 휴식)
- 커스터마이징 가능한 시간 설정
- 학습 통계 (일일/주간/월간)
- 배경음악 지원

### 5. 📊 성적 계산기
- 내신 등급 계산
- 수능 백분위/표준점수 예측
- 과목별 성적 관리
- 그래프 시각화

### 6. 📢 학급 공지사항
- 중요 공지사항 관리
- 우선순위 설정
- 읽음/안읽음 표시
- 검색 기능

### 7. 🎯 할일 관리
- 과제 및 준비물 체크리스트
- 마감일 알림
- 우선순위 정렬
- 완료율 통계

## 기술 스택
- **HTML5**: 시맨틱 마크업
- **CSS3**:
  - CSS Grid & Flexbox
  - CSS Variables (다크모드)
  - 애니메이션 & 트랜지션
- **Vanilla JavaScript**:
  - ES6+ 문법
  - LocalStorage API
  - Web Storage API
  - Service Worker (PWA 준비)

## 디자인 철학
- **미니멀리즘**: 불필요한 요소 제거, 핵심 기능에 집중
- **직관성**: 별도 학습 없이 즉시 사용 가능
- **접근성**: WCAG 2.1 AA 준수
- **반응형**: 모바일 퍼스트 디자인
- **성능**: 빠른 로딩, 부드러운 인터랙션

## 색상 팔레트
### 라이트 모드
- Primary: #4F46E5 (인디고)
- Secondary: #06B6D4 (시안)
- Success: #10B981 (그린)
- Warning: #F59E0B (앰버)
- Danger: #EF4444 (레드)
- Background: #F9FAFB
- Surface: #FFFFFF
- Text: #1F2937

### 다크 모드
- Primary: #818CF8
- Secondary: #22D3EE
- Success: #34D399
- Warning: #FBBF24
- Danger: #F87171
- Background: #111827
- Surface: #1F2937
- Text: #F9FAFB

## 프로젝트 구조
```
school_revolution_prototype/
├── index.html              # 메인 페이지
├── css/
│   ├── reset.css          # CSS 리셋
│   ├── variables.css      # CSS 변수
│   ├── layout.css         # 레이아웃
│   └── components.css     # 컴포넌트 스타일
├── js/
│   ├── app.js             # 메인 앱 로직
│   ├── timetable.js       # 시간표 모듈
│   ├── dday.js            # D-Day 모듈
│   ├── meal.js            # 급식 모듈
│   ├── timer.js           # 타이머 모듈
│   ├── grade.js           # 성적 계산기 모듈
│   ├── notice.js          # 공지사항 모듈
│   └── storage.js         # 로컬 스토리지 유틸
├── assets/
│   ├── icons/             # SVG 아이콘
│   └── sounds/            # 알림음
├── README.md              # 사용자 가이드
└── LICENSE                # MIT 라이선스
```

## 데이터 저장 방식
- **LocalStorage**: 모든 사용자 데이터 저장
- **JSON 형식**: 구조화된 데이터 관리
- **버전 관리**: 데이터 스키마 버전 추적
- **백업/복원**: JSON 파일로 내보내기/가져오기

## 브라우저 지원
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- 모바일 브라우저 (iOS Safari, Chrome Mobile)

## 성능 목표
- First Contentful Paint: < 1.0s
- Time to Interactive: < 2.0s
- Lighthouse Score: 95+
- 번들 크기: < 100KB (gzipped)

## 배포
- **GitHub Pages**: 자동 배포
- **커스텀 도메인**: 지원
- **HTTPS**: 기본 제공
- **CDN**: GitHub CDN 활용

## 향후 확장 계획
1. PWA 지원 (오프라인 사용)
2. NEIS API 연동
3. 다국어 지원
4. 접근성 개선 (스크린 리더)
5. 협업 기능 (Firebase 연동)
