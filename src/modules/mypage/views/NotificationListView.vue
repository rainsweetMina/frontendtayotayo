<template>
  <div class="notification-wrapper" v-if="userReady && user">
    <h2>🔔 알림 목록</h2>

    <!-- 액션 버튼 -->
    <div class="actions">
      <button @click="markAllAsRead" :disabled="!hasUnread">✅ 전체 읽음</button>
      <button @click="deleteAll">🗑️ 전체 삭제</button>
    </div>

    <!-- 알림 리스트 -->
    <ul class="notification-list">
      <li
          v-for="notification in notifications"
          :key="notification.id"
          :class="{ unread: !notification.read }"
      >
        <div class="content">
          <h4>{{ notification.title }}</h4>
          <p>{{ notification.message }}</p>
          <small>{{ formatDate(notification.createdAt) }}</small>
        </div>
        <div class="buttons">
          <button v-if="!notification.read" @click="markAsRead(notification.id)">읽음</button>
          <button @click="deleteOne(notification.id)">삭제</button>
        </div>
      </li>
    </ul>

    <!-- 페이지네이션 -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="goPage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
      <button
          v-for="page in totalPages"
          :key="page"
          @click="goPage(page)"
          :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
      <button @click="goPage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
    </div>

    <!-- 하단 마이페이지 이동 -->
    <router-link to="/mypage" class="back-button">← 마이페이지로 돌아가기</router-link>
  </div>

  <!-- 로딩 → 사용자 없음 -->
  <div v-else class="notification-wrapper">⏳ 사용자 정보를 불러오는 중입니다...</div>

  <!-- 토스트 모달 -->
  <BaseModal :show="showModal" :message="modalMessage" @close="showModal = false" />
</template>

<script setup>
import api from '@/api/axiosInstance'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'
import BaseModal from '@/modules/mypage/components/BaseModal.vue'

const router = useRouter()
const { user, fetchUserInfo } = useUserInfo()

// 상태
const userReady = ref(false)
const notifications = ref([])
const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)

// 모달 상태
const showModal = ref(false)
const modalMessage = ref('')
const openModal = (msg, timeout = 1500) => {
  modalMessage.value = msg
  showModal.value = true
  if (timeout) setTimeout(() => (showModal.value = false), timeout)
}

/* 📥 알림 가져오기 */
const fetchNotifications = async (page = 1) => {
  if (!user.value?.userId) return
  try {
    const res = await api.get('/api/mypage/notifications', {
      params: { userId: user.value.userId, page: page - 1, size: pageSize }
    })
    notifications.value = res.data.content || res.data || []
    totalPages.value = res.data.totalPages || 1
    currentPage.value = page
  } catch (e) {
    console.error('❌ 알림 불러오기 실패:', e)
    openModal('알림을 불러오지 못했습니다', 2000)
  }
}

/* ✅ 단일 읽음 */
const markAsRead = async (id) => {
  try {
    await api.post(`/api/mypage/notifications/${id}/read`)
    const n = notifications.value.find((n) => n.id === id)
    if (n) n.read = true
    openModal('알림이 읽음 처리되었습니다.')
  } catch {
    openModal('읽음 처리 실패', 2000)
  }
}

/* ✅ 전체 읽음 */
const markAllAsRead = async () => {
  try {
    await api.post('/api/mypage/notifications/readAll', null, {
      params: { userId: user.value?.userId }
    })
    notifications.value.forEach((n) => (n.read = true))
    openModal('모든 알림을 읽음 처리했습니다.')
  } catch {
    openModal('전체 읽음 실패', 2000)
  }
}

/* 🗑️ 단일 삭제 */
const deleteOne = async (id) => {
  try {
    await api.delete(`/api/mypage/notifications/${id}`)
    notifications.value = notifications.value.filter((n) => n.id !== id)
    openModal('알림을 삭제했습니다.')
  } catch {
    openModal('삭제 실패', 2000)
  }
}

/* 🗑️ 전체 삭제 */
const deleteAll = async () => {
  try {
    await api.delete('/api/mypage/notifications', { params: { userId: user.value?.userId } })
    notifications.value = []
    openModal('모든 알림을 삭제했습니다.')
  } catch {
    openModal('전체 삭제 실패', 2000)
  }
}

/* 🔍 읽지 않은 알림 여부 */
const hasUnread = computed(() => notifications.value.some((n) => !n.read))

/* 📆 날짜 포맷 */
const formatDate = (s) => new Date(s).toLocaleString('ko-KR')

/* 페이지 이동 */
const goPage = (p) => {
  if (p < 1 || p > totalPages.value) return
  fetchNotifications(p)
}

/* 초기 로딩 */
onMounted(async () => {
  const ok = await fetchUserInfo(true)
  if (!ok) return router.push('/login')
  userReady.value = true
  fetchNotifications(currentPage.value)
})
</script>

<style scoped>
.back-button {
  background: none;
  color: #4889cd;
  border: none;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  margin: 20px auto 10px auto;
  display: block;
  text-align: center;

  position: relative;
  z-index: 10; /* 모달이나 다른 요소보다 위에 오도록 */
}

.notification-wrapper { max-width: 700px; margin: auto; padding: 2rem; position: relative; }
.actions { display: flex; gap: 1rem; margin-bottom: 1rem; justify-content: center; }
.notification-list { list-style: none; padding: 0; }
.notification-list li { background: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.notification-list li.unread { background: #e9f7ff; }
.content h4 { margin: 0; }
.content p { margin: .3rem 0; }
.buttons { display: flex; gap: .5rem; align-items: center; flex-wrap: nowrap; }
.buttons button { white-space: nowrap; padding: 4px 8px; font-size: 13px; cursor: pointer; }
.pagination { text-align: center; margin-top: 1rem; }
.pagination button { margin: 0 .2rem; padding: .3rem .6rem; cursor: pointer; }
.pagination button.active { font-weight: bold; background: #007bff; color: #fff; border-radius: 3px; }
.pagination button:disabled { cursor: not-allowed; opacity: .5; }
</style>