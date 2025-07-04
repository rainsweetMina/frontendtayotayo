#!/bin/bash

# Docker Compose 시작 스크립트

echo "🚀 Docker Compose로 Vue.js 애플리케이션을 시작합니다..."

# 환경 확인
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml 파일이 없습니다!"
    exit 1
fi

# Docker Compose 실행
echo "🐳 Docker Compose를 시작합니다..."
docker-compose up -d

# 서비스 상태 확인
echo "📊 서비스 상태를 확인합니다..."
sleep 5
docker-compose ps

# 헬스 체크
echo "🏥 헬스 체크를 수행합니다..."
sleep 10
if curl -f http://localhost:15173 > /dev/null 2>&1; then
    echo "✅ 애플리케이션이 정상적으로 시작되었습니다!"
else
    echo "⚠️  헬스 체크에 실패했습니다. 로그를 확인해주세요."
    echo "   docker-compose logs -f"
fi

echo ""
echo "✅ Docker Compose 환경이 시작되었습니다!"
echo ""
echo "🌐 접속 URL:"
echo "   - 웹사이트: http://localhost:15173"
echo ""
echo "📝 유용한 명령어:"
echo "   - 로그 확인: docker-compose logs -f"
echo "   - 서비스 중지: docker-compose down"
echo "   - 서비스 재시작: docker-compose restart"
echo "   - 이미지 재빌드: docker-compose build --no-cache"
echo "" 