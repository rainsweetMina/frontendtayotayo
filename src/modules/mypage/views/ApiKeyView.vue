<template>
  <div class="apikey-wrapper">
    <h2>🔐 API 키 관리</h2>

    <div v-if="isLoading">로딩 중...</div>

    <div v-else-if="apiKey">
      <p>
        <strong>API 키:</strong>
        <code>{{ displayApiKey }}</code>
        <button @click="toggleVisible" class="toggle-btn">
          {{ isVisible ? '숨기기' : '보기' }}
        </button>
        <button @click="copyApiKey" class="copy-btn">복사</button>
      </p>

      <p><strong>상태:</strong>
        <template v-if="apiKey.status === 'APPROVED'">
          ✅ 승인됨 / {{ apiKey.active ? '🔓 활성화됨' : '🔒 비활성화됨' }}
        </template>
        <template v-else-if="apiKey.status === 'PENDING'">
          ⏳ 승인 대기 중
        </template>
        <template v-else-if="apiKey.status === 'EXPIRED'">
          ❌ 만료됨
        </template>
        <template v-else>
          ❓ 알 수 없음 ({{ apiKey.status }})
        </template>
      </p>

      <p><strong>발급일:</strong> {{ formatDate(apiKey.createdAt) }}</p>
      <p><strong>만료일:</strong> {{ formatDate(apiKey.expiresAt) }}</p>

      <div v-if="apiKey.callbackUrls?.length">
        <strong>📡 등록된 Callback URL</strong>
        <ul class="callback-list">
          <li v-for="(url, idx) in apiKey.callbackUrls" :key="idx">{{ url }}</li>
        </ul>
      </div>

      <button @click="reissueApiKey" class="reissue-button">🔁 재발급 요청</button>
    </div>

    <div v-else>
      <p>아직 API 키를 신청하지 않았습니다.</p>
      <button @click="requestApiKey">API 키 신청하기</button>
    </div>

    <router-link to="/mypage" class="back-button">← 마이페이지로 돌아가기</router-link>

    <div v-if="copied" class="toast">✅ 복사 완료!</div>
  </div>
</template>

<script setup>
import api from '@/api/axiosInstance'
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

const router = useRouter()
const { user, isLoggedIn, isLoading, fetchUserInfo } = useUserInfo()

const apiKey = ref(null)
const isVisible = ref(false)
const copied = ref(false)
const userReady = ref(false) // ✅ 사용자 정보 로딩 여부

const fetchApiKey = async () => {
  try {
    const res = await api.get('/api/user/apikey/getApiKey', {
      withCredentials: true
    })
    apiKey.value = res.data
  } catch (e) {
    apiKey.value = null
    console.error('API 키 조회 실패:', e)
  }
}

const requestApiKey = async () => {
  if (!user.value?.userId || !user.value?.username) {
    alert('사용자 정보가 없습니다.')
    return
  }

  try {
    const requestBody = {
      userId: user.value.userId,
      user_name: user.value.username,
      allowedIp: '',
      callbackUrls: []
    }

    await api.post('/api/user/apikey/request', requestBody)
    await fetchApiKey()
  } catch (e) {
    alert('API 키 신청 중 오류 발생')
  }
}

const reissueApiKey = async () => {
  try {
    await api.post('/api/user/apikey/reissue')
    alert('API 키가 재발급되었습니다.')
    await fetchApiKey()
  } catch (e) {
    const msg = e.response?.data
        ? (typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data))
        : '재발급 중 오류가 발생했습니다.'
    alert(msg)
  }
}

const toggleVisible = () => {
  isVisible.value = !isVisible.value
}

const copyApiKey = async () => {
  if (!apiKey.value?.apiKey) return
  try {
    await navigator.clipboard.writeText(apiKey.value.apiKey)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    alert('복사 실패')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return isNaN(d) ? '잘못된 날짜' : d.toLocaleString()
}

const isExpired = (expiresAt) => {
  if (!expiresAt) return false
  const now = new Date()
  const exp = new Date(expiresAt)
  return exp.getTime() < now.getTime()
}

const displayApiKey = computed(() => {
  if (!apiKey.value?.apiKey) return '-'
  if (isVisible.value) return apiKey.value.apiKey
  const len = apiKey.value.apiKey.length
  return '*'.repeat(len - 4) + apiKey.value.apiKey.slice(-4)
})

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) fetchApiKey()
})

onMounted(async () => {
  const success = await fetchUserInfo(true)
  if (!success) {
    router.push('/login')
    return
  }

  userReady.value = true
  await fetchApiKey()
})
</script>

<style scoped>
.apikey-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.apikey-wrapper h2 {
  margin-bottom: 20px;
}

.apikey-wrapper code {
  background-color: #eee;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

button {
  padding: 6px 12px;
  font-size: 14px;
  margin: 4px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.copy-btn {
  background: #5cb85c;
  color: white;
}
.copy-btn:hover {
  background: #4cae4c;
}

.toggle-btn {
  background: #6c757d;
  color: white;
}
.toggle-btn:hover {
  background: #5a6268;
}

.reissue-button {
  margin-top: 15px;
  background: #ffc107;
  color: black;
}
.reissue-button:hover {
  background: #e0a800;
}

.back-button {
  display: inline-block;
  margin-top: 20px;
  text-decoration: none;
  color: #007bff;
}

.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #28a745;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  animation: fadeout 1.5s forwards;
  font-size: 14px;
}

@keyframes fadeout {
  0% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; display: none; }
}

.callback-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 20px;
}
.callback-list li {
  background: #eaeaea;
  margin: 4px auto;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
}
</style>
