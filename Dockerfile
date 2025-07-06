# Node.js 18 Alpine 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 환경 변수 파일 복사
COPY env.production .env.production

# 프로덕션 빌드
RUN npm run build

# Nginx 설치
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일을 Nginx로 복사
COPY --from=0 /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 15173

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"] 