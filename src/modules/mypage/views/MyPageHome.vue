<template>
  <div class="mypage-main" v-if="!isLoading">
    <!-- 사용자 정보 -->
    <section class="user-info">
      <h4>👤 {{ user?.username }}님, 환영합니다!</h4>
      <p>최근 접속일: {{ formattedLastLogin }}</p>
    </section>

    <!-- 새 알림 요약 영역 -->
    <section class="alert-summary">
      <template v-if="notificationCount === 0">
        🔔 새로운 알림이 없습니다.
      </template>
      <template v-else>
        🔔 새로운 알림 {{ notificationCount }}건이 있습니다.
      </template>
      <router-link to="/mypage/notifications">알림 확인하기</router-link>
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
      <div class="card" @click="$router.push('/mypage/apikey-request')">
        <h3>🔑 API 키</h3>
        <p>{{ apiKeyStatusText }}</p>
      </div>
    </section>

    <!-- 설정 및 관리 -->
    <section class="settings">
      <button @click="handleLogout" class="logout-button">🚪 로그아웃</button>
      <router-link to="/mypage/modify">⚙️ 회원정보 수정</router-link>
      <router-link to="/mypage/withdraw">🗑️ 회원 탈퇴</router-link>
    </section>
  </div>
  <div v-else>
    ⏳ 마이페이지 정보를 불러오는 중입니다...
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'
import { useAuthStore } from '@/stores/auth'

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const router = useRouter()
const auth = useAuthStore()
const { user, isLoading, isLoggedIn, fetchUserInfo } = useUserInfo()

const favorites = ref({ busCount: 0, stopCount: 0 })
const lostItems = ref(0)
const qnaCount = ref(0)
const apiKeyStatusText = ref('정보 없음')
const notificationCount = ref(0)


const handleLogout = async () => {
  try {
    await api.post('/api/logout', {}, { withCredentials: true })
    auth.logout() // ✅ Pinia 상태 초기화
    await router.push('/login')
  } catch (error) {
    alert('로그아웃에 실패했습니다.')
  }
}

const fetchAllSummaries = async () => {
  try {
    const [favRes, apiRes, notiRes, qnaRes] = await Promise.all([
      api.get('/api/mypage/favorites/summary'),
      api.get('/api/user/apikey/summary'),
      api.get('/api/mypage/notifications/count'),
      api.get('/api/qna/count')
    ])

    favorites.value = favRes.data
    apiKeyStatusText.value = apiRes.data?.status === 'APPROVED' ? '승인됨' :
        apiRes.data?.status === 'PENDING' ? '승인 대기 중' : '없음'
    notificationCount.value = notiRes.data.count
    qnaCount.value = qnaRes.data.count
  } catch (err) {
    console.error('❌ 데이터 요약 로딩 실패:', err)
  }
}


onMounted(async () => {
  const success = await fetchUserInfo()
  if (!success) {
    router.push('/login')
    return
  }
  setTimeout(async () => {
    await fetchAllSummaries()
  }, 300)
})

const formattedLastLogin = computed(() => {
  if (!user.value?.lastLoginAt) return '정보 없음'
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
  margin-bottom: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 새 알림 요약 스타일 */
.alert-summary {
  background-color: #e0f7fa;
  padding: 12px 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  font-weight: bold;
  color: #00796b;
}
.alert-summary a {
  margin-left: 10px;
  color: #004d40;
  text-decoration: underline;
  cursor: pointer;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
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
