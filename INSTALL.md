# TrustDate 설치 및 실행 가이드

## 시스템 요구사항

- Node.js 16.x 이상
- npm 7.x 이상 또는 yarn 1.22.x 이상

## 설치 방법

1. 저장소 클론하기

```bash
git clone https://github.com/your-username/trustdate.git
cd trustdate
```

2. 의존성 설치하기

```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install
```

3. 환경 변수 설정 (필요한 경우)

```bash
# .env.local 파일을 생성하여 필요한 환경 변수 설정
cp .env.example .env.local
```

4. 개발 서버 실행하기

```bash
# npm 사용
npm run dev

# 또는 yarn 사용
yarn dev
```

이제 브라우저에서 `http://localhost:3000`으로 접속하여 TrustDate 애플리케이션을 사용할 수 있습니다.

## 빌드 및 프로덕션 실행

1. 애플리케이션 빌드하기

```bash
# npm 사용
npm run build

# 또는 yarn 사용
yarn build
```

2. 프로덕션 서버 실행하기

```bash
# npm 사용
npm run start

# 또는 yarn 사용
yarn start
```

## 특별 참고사항

### Humanity Protocol API 연동

현재 구현에서는 해커톤 환경에 맞춰 Humanity Protocol API를 모의(mock) 구현으로 대체하고 있습니다. 실제 Humanity Protocol API와 연동하려면 다음 단계를 따르세요:

1. Humanity Protocol에서 API 키 발급받기
2. `.env.local` 파일에 API 키 및 엔드포인트 설정
3. `src/services/humanityApi.ts` 파일 업데이트:
   - API 베이스 URL을 실제 Humanity Protocol API 엔드포인트로 변경
   - API 요청 헤더에 인증 정보 추가

```typescript
// src/services/humanityApi.ts 파일 예시 수정
const API_BASE_URL = process.env.HUMANITY_API_URL || 'https://api.humanity.example';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.HUMANITY_API_KEY}`
  },
});
```

### 데이터베이스 연동

현재 구현에서는 인메모리 데이터 구조를 사용하고 있습니다. 실제 데이터베이스를 연동하려면:

1. 선호하는 데이터베이스 서비스 설정 (MongoDB, PostgreSQL 등)
2. 해당 데이터베이스에 맞는 ORM 또는 드라이버 설치
3. 사용자, 프로필, 매칭, 메시지 등의 데이터 모델 구현
4. API 라우트와 데이터베이스 연동 로직 구현

## 트러블슈팅

**문제: 실행 중 "Module not found" 오류 발생**

이 문제는 의존성이 제대로 설치되지 않았을 때 발생할 수 있습니다. 다음 명령을 시도해보세요:

```bash
npm install
```

**문제: API 연결 오류**

Humanity Protocol API 연결 오류가 발생하면:

1. API 키와 엔드포인트 URL이 올바른지 확인
2. API 서비스가 실행 중인지 확인
3. 네트워크 연결 확인

**문제: 스타일이 제대로 적용되지 않음**

Tailwind CSS가 제대로 작동하지 않는 경우:

```bash
npm run build:css
npm run dev
```

## 후원 및 기여

TrustDate는 오픈 소스 프로젝트입니다. 기여를 원하시면 GitHub 저장소에서 이슈를 확인하거나 풀 리퀘스트를 보내주세요.

## 라이선스

MIT 라이선스 