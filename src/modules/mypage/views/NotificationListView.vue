<template>
  <div class="notification-wrapper" v-if="userReady && user">
  <h2>🔔 알림 목록</h2>

    <div class="actions">
      <button @click="markAllAsRead" :disabled="!hasUnread">✅ 전체 읽음</button>
      <button @click="deleteAll">🗑️ 전체 삭제</button>
    </div>

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

    <router-link to="/mypage" class="back-button">← 마이페이지로 돌아가기</router-link>
  </div>

  <!-- 로딩 또는 유저 없음 대응 -->
  <div v-else class="notification-wrapper">
    ⏳ 사용자 정보를 불러오는 중입니다...
  </div>
</template>

<script setup>
import api from '@/api/axiosInstance'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

const router = useRouter()
const { user, fetchUserInfo, isLoading } = useUserInfo()

const userReady = ref(false) // ✅ 사용자 정보 준비 여부

const notifications = ref([])
const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(1)

const fetchNotifications = async (page = 1) => {
  if (!user.value?.userId) return

  try {
    const res = await api.get('/api/mypage/notifications', {
      params: {
        userId: user.value.userId,
        page: page - 1,
        size: pageSize
      }
    })

    notifications.value = res.data.content || res.data || []
    totalPages.value = res.data.totalPages || 1
    currentPage.value = page
  } catch (e) {
    console.error('❌ 알림 불러오기 실패:', e)
  }
}

const markAsRead = async (id) => {
  try {
    await api.post(`/api/mypage/notifications/${id}/read`)
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read = true
  } catch (e) {
    alert('읽음 처리 실패')
  }
}

const markAllAsRead = async () => {
  try {
    await api.post('/api/mypage/notifications/readAll', null, {
      params: { userId: user.value?.userId }
    })
    notifications.value.forEach(n => (n.read = true))
  } catch (e) {
    alert('전체 읽음 실패')
  }
}

const deleteOne = async (id) => {
  try {
    await api.delete(`/api/mypage/notifications/${id}`)
    notifications.value = notifications.value.filter(n => n.id !== id)
  } catch (e) {
    alert('삭제 실패')
  }
}

const deleteAll = async () => {
  try {
    await api.delete('/api/mypage/notifications', {
      params: { userId: user.value?.userId }
    })
    notifications.value = []
  } catch (e) {
    alert('전체 삭제 실패')
  }
}

const hasUnread = computed(() => {
  return Array.isArray(notifications.value) && notifications.value.some(n => !n.read)
})

const formatDate = (str) => {
  const d = new Date(str)
  return d.toLocaleString('ko-KR')
}

const goPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  fetchNotifications(page)
}

onMounted(async () => {
  const success = await fetchUserInfo(true) // 강제 새로 로딩
  if (!success) {
    router.push('/login')
    return
  }

  userReady.value = true
  fetchNotifications(currentPage.value)
})
</script>

<style scoped>
.notification-wrapper {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
}
.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
}
.notification-list {
  list-style: none;
  padding: 0;
}
.notification-list li {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.notification-list li.unread {
  background: #e9f7ff;
}
.content h4 {
  margin: 0;
}
.content p {
  margin: 0.3rem 0;
}
.buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
}
.buttons button {
  white-space: nowrap;
  padding: 4px 8px;
  font-size: 13px;
  cursor: pointer;
}
.back-button {
  display: inline-block;
  margin-top: 2rem;
  text-decoration: none;
  color: #007bff;
}
.pagination {
  text-align: center;
  margin-top: 1rem;
}
.pagination button {
  margin: 0 0.2rem;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
}
.pagination button.active {
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border-radius: 3px;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>