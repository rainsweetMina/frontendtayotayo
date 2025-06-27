<template>
  <div class="mypage-container" v-if="!isLoading">
    <!-- 상단 환영 메시지 -->
    <section class="welcome-box">
      <h3>{{ user?.username }}님, 환영합니다!</h3>
      <p class="last-login">최근 접속일: {{ formattedLastLogin }}</p>
    </section>

    <!-- 알림 요약 -->
    <section class="notification-box">
      <span>
        🔔 {{ notificationCount > 0 ? `새로운 알림 ${notificationCount}건이 있습니다.` : '새로운 알림이 없습니다.' }}
      </span>
      <router-link to="/mypage/notifications" class="notification-link">알림 확인하기 →</router-link>
    </section>

    <!-- 요약 카드 -->
    <section class="summary-grid">
      <div class="summary-card" @click="$router.push('/mypage/favorites')">
        <h3>⭐ 즐겨찾기</h3>
        <p v-if="favorites">버스 {{ favorites.busCount }}개, 정류장 {{ favorites.stopCount }}개</p>
      </div>
      <div class="summary-card" @click="$router.push('/mypage/lost')">
        <h3>📦 분실물</h3>
        <p>나의 신고 {{ lostItems }}건</p>
      </div>
      <div class="summary-card" @click="$router.push('/mypage/qna')">
        <h3>💬 Q&A</h3>
        <p>답변 대기 {{ qnaCount }}건</p>
      </div>
      <div class="summary-card" @click="$router.push('/mypage/apikey-request')">
        <h3>🔑 API 키</h3>
        <p>{{ apiKeyStatusText }}</p>
      </div>
    </section>

    <!-- ⚙️ 하단 설정 메뉴 -->
    <footer class="mypage-footer">
      <details>
        <summary class="footer-toggle">⚙️ 설정</summary>
        <div class="footer-links">
          <router-link to="/mypage/modify">회원정보 수정</router-link>
          <router-link to="/mypage/withdraw">회원 탈퇴</router-link>
        </div>
      </details>
    </footer>
  </div>
  <div v-else class="loading-box">
    ⏳ 마이페이지 정보를 불러오는 중입니다...
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const { user, isLoading, fetchUserInfo } = useUserInfo()

const favorites = ref({ busCount: 0, stopCount: 0 })
const lostItems = ref(0)
const qnaCount = ref(0)
const apiKeyStatusText = ref('정보 없음')
const notificationCount = ref(0)

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
const formattedLastLogin = computed(() => formatDate(user.value?.lastLoginAt))

const fetchAllSummaries = async () => {
  try {
    const [
      favRes,
      apiRes,
      notiRes,
      qnaRes,
      lostRes
    ] = await Promise.all([
      api.get('/api/mypage/favorites/summary'),
      api.get('/api/user/apikey/summary'),
      api.get('/api/mypage/notifications/count'),
      api.get('/api/qna/count'),
      api.get('/api/mypage/lost/count')
    ])

    favorites.value        = favRes.data
    apiKeyStatusText.value = apiRes.data?.status === 'APPROVED'
        ? '승인됨'
        : apiRes.data?.status === 'PENDING'
            ? '승인 대기 중'
            : '없음'
    notificationCount.value = notiRes.data.count
    qnaCount.value          = qnaRes.data.count
    lostItems.value         = lostRes.data.count
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
  await fetchAllSummaries()
})
</script>

<style scoped>
.mypage-container {
  max-width: 1140px;
  margin: 40px auto;
  padding: 1.5rem 1.5rem;
  font-family: 'Pretendard', sans-serif;
  color: #333;
}

.welcome-box {
  background-color: #f5f8ff;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin: 0 auto 1.5rem;
  text-align: center;
  max-width: 500px;      /* ✅ 최대 너비 제한 */
  width: 100%;           /* ✅ auto 마진 동작 위해 너비 설정 */
  display: block;        /* ✅ 필요 시 명시적으로 block */
}

.welcome-box h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #1a237e;
}
.last-login {
  font-size: 0.95rem;
  color: #555;
}

.notification-box {
  background: #e3f2fd;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  margin: 0 auto 1.5rem;
  width: fit-content;
  max-width: 90%;
  display: flex;
  gap: 1rem;
  align-items: center;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  justify-content: center;
}
.notification-link {
  color: #0d47a1;
  text-decoration: underline;
  font-size: 0.9rem;
}

.summary-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 1024px) {
  .summary-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.summary-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
  min-height: 108px;
}
.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}
.summary-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.summary-card p {
  font-size: 0.95rem;
  color: #555;
}

.mypage-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.95rem;
  text-align: center;
}
.footer-toggle {
  cursor: pointer;
  font-weight: bold;
  color: #333;
  padding: 0.5rem 0;
}
.footer-links {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
}
.footer-links a {
  color: #444;
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  transition: background 0.2s;
}
.footer-links a:hover {
  background-color: #f0f0f0;
}

.loading-box {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #888;
}
</style>
