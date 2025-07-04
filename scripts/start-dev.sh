#!/bin/bash

# 개발 환경 Docker Compose 시작 스크립트

echo "🚀 개발 환경 Docker Compose로 Vue.js 애플리케이션을 시작합니다..."

# 환경 확인
if [ ! -f "docker-compose.dev.yml" ]; then
    echo "❌ docker-compose.dev.yml 파일이 없습니다!"
    exit 1
fi

# Docker Compose 개발 환경 실행
echo "🐳 Docker Compose 개발 환경을 시작합니다..."
docker-compose -f docker-compose.dev.yml up -d

# 서비스 상태 확인
echo "📊 서비스 상태를 확인합니다..."
sleep 10
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "✅ 개발 환경이 시작되었습니다!"
echo ""
echo "🌐 접속 URL:"
echo "   - 프론트엔드: http://localhost:15173"
echo ""
echo "📝 유용한 명령어:"
echo "   - 로그 확인: docker-compose -f docker-compose.dev.yml logs -f"
echo "   - 서비스 중지: docker-compose -f docker-compose.dev.yml down"
echo "   - 서비스 재시작: docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "💡 개발 팁:"
echo "   - 소스 코드 변경 시 자동으로 핫 리로드됩니다"
echo "   - 브라우저에서 http://localhost:15173 접속"
echo "" 