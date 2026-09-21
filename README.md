# KU Finance Portal

고려대학교 대학원 원우회 재무국 포털 프로토타입.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

### 로컬 테스트 로그인

`npm run dev`에서는 환경변수가 없어도 테스트 편의를 위해 개발 전용 계정이 자동 활성화된다.

- ID: `finance`
- PW: `finance1234`

이 fallback은 `NODE_ENV=production`에서는 동작하지 않는다.

## Vercel 배포 시 필수 환경변수

Vercel Project → Settings → Environment Variables에 아래 세 값을 등록한다.

```env
ADMIN_USERNAME=원하는관리자ID
ADMIN_PASSWORD=충분히긴비밀번호
SESSION_SECRET=충분히긴랜덤문자열
```

운영 환경에서는 위 세 값이 모두 있어야 관리자 로그인이 활성화된다.

BAND API 발급 이후에는 필요 시 아래도 추가한다.

```env
BAND_ACCESS_TOKEN=
BAND_KEY=
```

## 현재 기능

- 재무국 랜딩페이지
- 공지사항 목록/열람
- 관리자 로그인 후에만 `공지 등록` 버튼 노출
- 식대지원 입력 및 BAND 게시문 생성
- 비용지급요청 Google Form 외부 링크
- BAND API 연동용 서버 라우트 구조

현재 공지 저장은 브라우저 `localStorage` 기반이므로 운영 시 중앙 저장소로 교체해야 한다.
