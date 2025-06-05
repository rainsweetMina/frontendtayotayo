<template>
  <div class="mypage-main">
    <!-- 사용자 정보 -->
    <section class="user-info">
      <h4>👤 {{ user?.username }}님, 환영합니다!</h4>
      <p>최근 접속일: {{ user?.lastLoginAt ? formatDate(user.lastLoginAt) : '정보 없음' }}</p>
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

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
const { user, isLoading, isLoggedIn } = useUserInfo()

const favorites = ref({ busCount: 0, stopCount: 0 })
const lostItems = ref(0)
const qnaCount = ref(0)
const apiKeyStatusText = ref('정보 없음')
const notificationCount = ref(0)

const handleLogout = async () => {
  try {
    await axios.post('/auth/logout', null, { withCredentials: true })
    router.push('/login')
  } catch (error) {
    alert('로그아웃에 실패했습니다.')
    console.error(error)
  }
}

const fetchFavoriteSummary = async () => {
  try {
    const res = await axios.get('/api/mypage/favorites/summary', { withCredentials: true })
    favorites.value = res.data
  } catch (err) {
    console.error('❌ 즐겨찾기 요약 정보 실패:', err)
  }
}

const fetchApiKeySummary = async () => {
  try {
    const res = await axios.get('/api/user/apikey/summary', { withCredentials: true })
    const status = res.data.status
    apiKeyStatusText.value =
        status === 'APPROVED' ? '승인됨' :
            status === 'PENDING' ? '승인 대기 중' :
                '없음'
  } catch (e) {
    console.error('❌ API 키 상태 로딩 실패:', e)
  }
}

const fetchNotificationCount = async () => {
  try {
    const res = await axios.get('/api/mypage/notifications/count', { withCredentials: true })
    notificationCount.value = res.data.count
  } catch (err) {
    console.error('❌ 알림 수 로딩 실패:', err)
  }
}

const fetchQnaCount = async () => {
  try {
    const res = await axios.get('/api/qna/count', { withCredentials: true })
    qnaCount.value = res.data.count
  } catch (err) {
    console.error('❌ Q&A 개수 로드 실패:', err)
  }
}

const waitUntilUserLoaded = async () => {
  while (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }

  // 로그인 상태 유지되었을 경우
  fetchFavoriteSummary()
  fetchApiKeySummary()
  fetchNotificationCount()
  fetchQnaCount()
}

onMounted(async () => {
  await waitUntilUserLoaded()
})

const formattedLastLogin = computed(() => {
  console.log("🔥 user.value:", user.value)
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
