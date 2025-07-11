# Node.js 20 이미지 사용
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 필요한 패키지 설치
RUN apk add --no-cache python3 make g++

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 환경 변수 파일 복사
COPY .env .env
COPY .env.development .env.development
COPY .env.production .env.production

# 포트 노출
EXPOSE 5173

# 개발 서버 시작 (프로덕션 환경 변수 사용)
CMD ["sh", "-c", "export $(grep -v '^#' .env.production | xargs) && VITE_BASE_URL=https://docs.yi.or.kr:8096 npm run dev"]
# CMD ["npm", "run", "dev"]