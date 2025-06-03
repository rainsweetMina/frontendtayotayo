<template>
  <div class="mypage-main">
    <!-- 사용자 정보 -->
    <section class="user-info">
      <h4>👤 {{ user?.name }}님, 환영합니다!</h4>
      <p>최근 접속일: {{ formattedLastLogin }}</p>
    </section>

    <!-- 카드 요약 보기 -->
    <section class="summary-cards">
      <div class="card" @click="$router.push('/mypage/favorites')">
        <h3>⭐ 즐겨찾기</h3>
        <p>버스 {{ favorites.busCount }}개, 정류장 {{ favorites.stopCount }}개</p>
      </div>
      <div class="card" @click="$router.push('/mypage/lost')">
        <h3>📦 분실물</h3>
        <p>최근 신고 {{ lostItems }}건</p>
      </div>
      <div class="card" @click="$router.push('/mypage/qna')">
        <h3>💬 Q&A</h3>
        <p>답변 대기 {{ qnaCount }}건</p>
      </div>
    </section>

    <!-- 설정 및 관리 -->
    <section class="settings">
      <router-link to="/mypage/modify">⚙️ 내 정보 수정</router-link>
      <router-link to="/mypage/password">🔐 비밀번호 변경</router-link>
      <router-link to="/mypage/withdraw">🗑️ 회원 탈퇴</router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

const { user } = useUserInfo()

// 예시 데이터
const favorites = ref({ busCount: 2, stopCount: 1 })
const lostItems = ref(1)
const qnaCount = ref(2)

// ✅ computed로 안전하게 포맷된 날짜 출력
const formattedLastLogin = computed(() => {
  if (!user.value || !user.value.lastLoginAt) return '정보 없음'

  try {
    const date = new Date(user.value.lastLoginAt)
    return date.toLocaleString('ko-KR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  } catch {
    return '정보 없음'
  }
})
</script>

<style scoped>
.mypage-main {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
}
.user-info {
  background: #f0f4ff;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}
.card {
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}
.settings {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
.settings a {
  background: #eee;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #333;
  transition: background 0.2s ease;
}
.settings a:hover {
  background: #ccc;
}
</style>
