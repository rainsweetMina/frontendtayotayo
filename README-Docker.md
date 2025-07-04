# Docker Compose 설정 가이드

이 프로젝트는 Docker Compose를 사용하여 Vue.js 애플리케이션을 컨테이너화했습니다.

## 🚀 빠른 시작

### 1. 프로덕션 환경 실행

```bash
# 전체 스택 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그 확인
docker-compose logs -f frontend
```

### 2. 개발 환경 실행

```bash
# 개발 환경 실행
docker-compose -f docker-compose.dev.yml up -d

# 개발 환경 로그 확인
docker-compose -f docker-compose.dev.yml logs -f
```

## 📋 서비스 구성

### 프로덕션 환경

| 서비스 | 포트 | 설명 |
|--------|------|------|
| frontend | 15173:80 | Vue.js 프론트엔드 (Nginx) |

### 개발 환경

| 서비스 | 포트 | 설명 |
|--------|------|------|
| frontend-dev | 15173:5173 | Vue.js 개발 서버 |

## 🛠️ 관리 명령어

### 컨테이너 관리

```bash
# 모든 서비스 시작
docker-compose up -d

# 특정 서비스만 시작
docker-compose up -d frontend

# 서비스 중지
docker-compose down

# 서비스 재시작
docker-compose restart

# 컨테이너 상태 확인
docker-compose ps
```

### 로그 관리

```bash
# 모든 서비스 로그
docker-compose logs

# 실시간 로그
docker-compose logs -f

# 특정 서비스 로그
docker-compose logs frontend
```

### 이미지 관리

```bash
# 이미지 재빌드
docker-compose build --no-cache

# 특정 서비스만 재빌드
docker-compose build frontend

# 이미지 삭제
docker-compose down --rmi all
```

## 🌐 접속 URL

- **프로덕션**: http://localhost:15173
- **개발 환경**: http://localhost:15173 (핫 리로드 지원)

## 🔧 환경 변수

### 프론트엔드 환경 변수

`.env` 파일을 생성하여 다음 변수들을 설정할 수 있습니다:

```env
# 개발 환경
VITE_BASE_URL=http://localhost:8094

# 프로덕션 환경
VITE_BASE_URL=https://your-domain.com
```

## 📝 개발 팁

### 핫 리로드

개발 환경에서는 소스 코드 변경 시 자동으로 리로드됩니다:

```bash
# 개발 환경 실행
docker-compose -f docker-compose.dev.yml up -d

# 브라우저에서 확인
http://localhost:15173
```

### 디버깅

```bash
# 컨테이너 내부 접속
docker-compose exec frontend sh

# 실시간 로그 모니터링
docker-compose logs -f --tail=100
```

### 성능 최적화

```bash
# 멀티 스테이지 빌드 사용
docker-compose build --parallel

# 캐시 사용
docker-compose build --no-cache
```

## 🔄 배포

### 프로덕션 배포

```bash
# 최신 이미지로 빌드
docker-compose build --no-cache

# 서비스 재시작
docker-compose down
docker-compose up -d

# 헬스 체크
curl -f http://localhost:15173 || exit 1
```

### 롤백

```bash
# 이전 버전으로 롤백
docker-compose down
docker image tag frontendtayotayo_frontend:previous frontendtayotayo_frontend:latest
docker-compose up -d
```

## 🐛 문제 해결

### 포트 충돌

포트가 이미 사용 중인 경우:

```bash
# 포트 사용 확인
netstat -tulpn | grep :15173

# 사용 중인 프로세스 종료
sudo kill -9 <PID>
```

### 권한 문제

```bash
# Docker 권한 확인
sudo usermod -aG docker $USER

# 볼륨 권한 수정
sudo chown -R $USER:$USER .
```

### 메모리 부족

```bash
# Docker 리소스 확인
docker system df

# 사용하지 않는 리소스 정리
docker system prune -a
```

### 컨테이너 시작 실패

```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs frontend

# 컨테이너 재시작
docker-compose restart frontend
```

## 📚 추가 리소스

- [Docker Compose 공식 문서](https://docs.docker.com/compose/)
- [Nginx 설정 가이드](https://nginx.org/en/docs/)
- [Vue.js 배포 가이드](https://vuejs.org/guide/best-practices/production-deployment.html) 