# Docker를 사용한 Vue.js 애플리케이션 실행 가이드

이 프로젝트는 Docker를 사용하여 Vue.js 애플리케이션을 실행할 수 있도록 구성되어 있습니다.

## 프로덕션 환경 실행

### 1. 프로덕션 빌드 및 실행
```bash
# 프로덕션 환경 시작
docker-compose up --build

# 백그라운드에서 실행
docker-compose up -d --build
```

### 2. 접속
- **HTTP**: `http://localhost:15173`
- **HTTPS**: `https://localhost:15174` (자체 서명 인증서 사용)

## 개발 환경 실행

### 1. 개발 서버 실행
```bash
# 개발 환경 시작
docker-compose -f docker-compose.dev.yml up --build

# 백그라운드에서 실행
docker-compose -f docker-compose.dev.yml up -d --build
```

### 2. 접속
- **HTTP**: `http://localhost:15173`
- **HTTPS**: `https://localhost:15174` (자체 서명 인증서 사용)
- 핫 리로드 지원 (코드 변경 시 자동 새로고침)

## 스크립트 사용

### 프로덕션 환경
```bash
./scripts/start.sh
```

### 개발 환경
```bash
./scripts/start-dev.sh
```

## 컨테이너 관리

### 컨테이너 중지
```bash
# 프로덕션 환경
docker-compose down

# 개발 환경
docker-compose -f docker-compose.dev.yml down
```

### 로그 확인
```bash
# 프로덕션 환경
docker-compose logs -f frontend

# 개발 환경
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

### 컨테이너 재시작
```bash
# 프로덕션 환경
docker-compose restart frontend

# 개발 환경
docker-compose -f docker-compose.dev.yml restart frontend-dev
```

## 기술 스택

- **프론트엔드**: Vue.js 3 + Vite
- **컨테이너**: Docker
- **서빙**: Node.js serve (프로덕션), Vite Dev Server (개발)
- **포트**: 
  - 15173 (HTTP)
  - 15174 (HTTPS)
- **SSL**: 자체 서명 인증서 (개발용)

## HTTPS 설정

### 자체 서명 인증서
프로젝트에는 개발용 자체 서명 SSL 인증서가 포함되어 있습니다:
- 인증서 파일: `cert/cert.pem`
- 개인키 파일: `cert/key.pem`

### 브라우저에서 HTTPS 접근 시
자체 서명 인증서를 사용하므로 브라우저에서 보안 경고가 표시될 수 있습니다:
1. 경고 페이지에서 "고급" 클릭
2. "안전하지 않은 사이트로 이동" 클릭
3. 또는 인증서를 브라우저에 신뢰할 수 있는 인증서로 추가

## 주의사항

1. 프로덕션 환경에서는 `serve` 패키지를 사용하여 정적 파일을 서빙합니다.
2. 개발 환경에서는 Vite 개발 서버를 사용하여 핫 리로드를 지원합니다.
3. 모든 환경에서 HTTP(15173)와 HTTPS(15174) 포트로 접근이 가능합니다.
4. 자체 서명 인증서는 개발용이므로 프로덕션 환경에서는 공식 SSL 인증서를 사용하세요.

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