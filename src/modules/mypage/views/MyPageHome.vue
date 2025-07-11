<template>
  <div class="mypage-container" v-if="!isLoading">
    <!-- 상단 환영 메시지 -->
    <section class="welcome-box">
      <h3>{{ user?.username }}님, 환영합니다!</h3>
      <p class="last-login">최근 접속일: {{ formattedLastLogin }}</p>
    </section>

    <!-- 알림 요약 -->
    <section class="notification-box" v-if="notificationCount !== null">
      <span>
        🔔 {{ notificationCount > 0 ? `새로운 알림 ${notificationCount}건이 있습니다.` : '새로운 알림이 없습니다.' }}
      </span>
      <router-link to="/mypage/notifications" class="notification-link">알림 확인하기 →</router-link>
    </section>

    <!-- 요약 카드 -->
    <section class="summary-grid">
      <div class="summary-card" @click="$router.push('/mypage/favorites')">
        <h3>⭐ 즐겨찾기</h3>
        <p v-if="favorites !== null">버스 {{ favorites.busCount }}개, 정류장 {{ favorites.stopCount }}개</p>
        <p v-else class="text-gray-500">로딩 중...</p>
      </div>
      <div class="summary-card" @click="$router.push('/mypage/lost')">
        <h3>📦 분실물</h3>
        <p>나의 신고 {{ lostItems }}건</p>
        <p class="text-xs text-gray-500 mt-1">
          ※ 숨김/삭제된 글은 신고 건수에 포함되지 않습니다.
        </p>
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
const { user, isLoading, fetchUserInfo } = useUserInfo()

/* 상태 */
const favorites         = ref(null)
const lostItems         = ref(0)
const qnaCount          = ref(0)
const apiKeyStatusText  = ref('정보 없음')
const notificationCount = ref(null)

/* 날짜 포맷터 */
const formatDate = (str) => str ? new Date(str).toLocaleString('ko-KR', {
  year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'
}) : ''
const formattedLastLogin = computed(() => formatDate(user.value?.lastLoginAt))

/* 개별 API 호출 함수들 */
const fetchFavoritesSummary = async () => {
  try {
    const res = await api.get('/api/mypage/favorites/summary')
    favorites.value = res.data
  } catch (e) {
    console.error('❌ 즐겨찾기 요약 실패:', e)
    favorites.value = { busCount: 0, stopCount: 0 }
  }
}

const fetchApiKeySummary = async () => {
  try {
    const res = await api.get('/api/user/apikey/summary')
    const status = res.data?.status
    apiKeyStatusText.value = status === 'APPROVED' 
      ? '승인됨' 
      : status === 'PENDING' 
        ? '승인 대기 중' 
        : '없음'
  } catch (e) {
    console.error('❌ API 키 요약 실패:', e)
    apiKeyStatusText.value = '정보 없음'
  }
}

const fetchNotificationCount = async () => {
  try {
    const res = await api.get('/api/mypage/notifications/count')
    notificationCount.value = res.data.count || 0
  } catch (e) {
    console.error('❌ 알림 개수 실패:', e)
    notificationCount.value = 0
  }
}

const fetchQnaCount = async () => {
  try {
    const res = await api.get('/api/qna/count')
    qnaCount.value = res.data.count || 0
  } catch (e) {
    console.error('❌ Q&A 개수 실패:', e)
    qnaCount.value = 0
  }
}

const fetchLostItems = async () => {
  try {
    const res = await api.get('/api/lost')
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    lostItems.value = (res.data || []).filter(i => {
      const d = new Date(i.createdAt || i.lostTime)
      return !isNaN(d) && d >= sevenDaysAgo && i.visible
    }).length
  } catch (e) {
    console.error('❌ 분실물 개수 실패:', e)
    lostItems.value = 0
  }
}

/* 요약 데이터 일괄 로딩 */
const fetchAllSummaries = async () => {
  try {
    // 개별적으로 호출하여 하나가 실패해도 다른 것들은 로드되도록 함
    await Promise.allSettled([
      fetchFavoritesSummary(),
      fetchApiKeySummary(),
      fetchNotificationCount(),
      fetchQnaCount(),
      fetchLostItems()
    ])
  } catch (e) {
    console.error('❌ 데이터 요약 실패:', e)
  }
}

/* 초기 로딩 (강제 새로고침) */
onMounted(async () => {
  try {
    const ok = await fetchUserInfo(true)   // ← 수정 후에도 즉시 최신 반영
    if (!ok) {
      console.error('❌ 사용자 정보 로드 실패')
      return router.push('/login')
    }
    await fetchAllSummaries()
  } catch (e) {
    console.error('❌ 마이페이지 초기화 실패:', e)
    router.push('/login')
  }
})
</script>

<style>
.mypage-container {
  max-width: 1140px;
  margin: 40px auto;
  padding: 1.5rem 1.5rem;
  font-family: 'Pretendard', sans-serif;
  color: #333;
}

.welcome-box {
  background-color: #efede7;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin: 0 auto 1.5rem;
  text-align: center;
  max-width: 500px;      /* ✅ 최대 너비 제한 */
  width: 100%;           /* ✅ auto 마진 동작 위해 너비 설정 */
  display: block;        /* ✅ 필요 시 명시적으로 block */
}

.welcome-box h3 {
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
  background-color: #f0f4ff !important;
  border: 1px solid #d0d7e7;
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
