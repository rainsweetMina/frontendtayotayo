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

    <!-- 공통 베이스 모달 (toast 스타일) -->
    <BaseModal :show="showModal" :message="modalMessage" @close="showModal = false" />
  </div>
</template>

<script setup>
import api from '@/api/axiosInstance'
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'
import BaseModal from '@/modules/mypage/components/BaseModal.vue'

const router = useRouter()
const { user, isLoggedIn, isLoading, fetchUserInfo } = useUserInfo()

const apiKey = ref(null)
const isVisible = ref(false)
const showModal = ref(false)
const modalMessage = ref('')

/** 모달 헬퍼 */
const openModal = (msg, autoClose = 1500) => {
  modalMessage.value = msg
  showModal.value = true
  if (autoClose) {
    setTimeout(() => (showModal.value = false), autoClose)
  }
}

/** API 키 조회 */
const fetchApiKey = async () => {
  try {
    const res = await api.get('/api/user/apikey/getApiKey', { withCredentials: true })
    apiKey.value = res.data
  } catch (e) {
    apiKey.value = null
    console.error('API 키 조회 실패:', e)
  }
}

/** API 키 신청 */
const requestApiKey = async () => {
  if (!user.value?.userId || !user.value?.username) {
    openModal('사용자 정보가 없습니다.', 2000)
    return
  }
  try {
    const body = {
      userId: user.value.userId,
      user_name: user.value.username,
      allowedIp: '',
      callbackUrls: []
    }
    await api.post('/api/user/apikey/request', body)
    await fetchApiKey()
    openModal('API 키 신청이 완료되었습니다.')
  } catch {
    openModal('API 키 신청 중 오류 발생', 2000)
  }
}

/** API 키 재발급 */
const reissueApiKey = async () => {
  try {
    await api.post('/api/user/apikey/reissue')
    await fetchApiKey()
    openModal('API 키가 재발급되었습니다.')
  } catch (e) {
    const msg = e.response?.data
        ? (typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data))
        : '재발급 중 오류가 발생했습니다.'
    openModal(msg, 2500)
  }
}

/** API 키 표시 토글 */
const toggleVisible = () => (isVisible.value = !isVisible.value)

/** API 키 복사 */
const copyApiKey = async () => {
  if (!apiKey.value?.apiKey) return
  try {
    await navigator.clipboard.writeText(apiKey.value.apiKey)
    openModal('✅ 복사 완료!')
  } catch {
    openModal('복사 실패', 2000)
  }
}

/** 날짜 포맷 */
const formatDate = (str) => {
  if (!str) return '-'
  const d = new Date(str)
  return isNaN(d) ? '잘못된 날짜' : d.toLocaleString()
}

/** 만료 여부 */
const isExpired = (exp) => {
  if (!exp) return false
  return new Date(exp).getTime() < Date.now()
}

/** 애스터리스크 처리된 API 키 */
const displayApiKey = computed(() => {
  if (!apiKey.value?.apiKey) return '-'
  return isVisible.value ? apiKey.value.apiKey : '*'.repeat(apiKey.value.apiKey.length - 4) + apiKey.value.apiKey.slice(-4)
})

/** 로그인 상태 변경 감지 */
watch(isLoggedIn, (v) => v && fetchApiKey())

/** 초기 로딩 */
onMounted(async () => {
  const ok = await fetchUserInfo(true)
  if (!ok) {
    router.push('/login')
    return
  }
  await fetchApiKey()
})
</script>

<style scoped>
.back-button {
  display: block;
  margin: 2rem auto 0 auto;
  color: #007bff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
}

.apikey-wrapper { max-width: 600px; margin: 0 auto; padding: 30px; background: #f9f9f9; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.05); text-align: center; }
.apikey-wrapper h2 { margin-bottom: 20px; }
.apikey-wrapper code { background: #eee; padding: 4px 8px; border-radius: 4px; font-family: monospace; }

button { padding: 6px 12px; font-size: 14px; margin: 4px; border: none; border-radius: 6px; cursor: pointer; }
.copy-btn { background: #5cb85c; color: #fff; }
.copy-btn:hover { background: #4cae4c; }
.toggle-btn { background: #6c757d; color: #fff; }
.toggle-btn:hover { background: #5a6268; }
.reissue-button { margin-top: 15px; background: #ffc107; color: #000; }
.reissue-button:hover { background: #e0a800; }
.back-button { display: inline-block; margin-top: 20px; color: #007bff; text-decoration: none; }
.callback-list { list-style: none; padding: 0; margin: 10px 0 20px; }
.callback-list li { background: #eaeaea; margin: 4px auto; padding: 6px 12px; border-radius: 6px; font-size: 14px; }
</style>
