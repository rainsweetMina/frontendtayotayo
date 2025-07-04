# 멀티 스테이지 빌드
# 1단계: Node.js 빌드 환경
FROM node:18-alpine AS builder

ENV NODE_ENV=production


# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

COPY ./localhost2-key.pem /app/localhost2-key.pem
COPY ./localhost2.pem /app/localhost2.pem
COPY ./vite.config.js /app/vite.config.js


# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build

# 2단계: Node.js 서빙 환경
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# serve 패키지 설치
RUN npm install -g serve

# 빌드된 파일들을 복사
COPY --from=builder /app/dist ./dist

# 포트 노출
EXPOSE 5173

# serve로 정적 파일 서빙
CMD ["serve", "-s", "dist", "-l", "3000"] 