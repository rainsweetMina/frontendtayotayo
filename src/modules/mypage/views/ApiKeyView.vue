<template>
  <div class="apikey-wrapper">
    <h2>🔐 API 키 관리</h2>

    <div v-if="isLoading">로딩 중...</div>

    <div v-else-if="apiKey">
      <p><strong>API 키:</strong> <code>{{ apiKey.apiKey }}</code></p>
      <p><strong>상태:</strong> {{ apiKey.active ? '활성화됨' : '비활성화됨' }}</p>
      <p><strong>발급일:</strong> {{ formatDate(apiKey.createdAt) }}</p>

      <!-- ✅ 재발급 버튼 -->
      <button @click="reissueApiKey" class="reissue-button">🔁 재발급 요청</button>
    </div>

    <div v-else>
      <p>아직 API 키를 신청하지 않았습니다.</p>
      <button @click="requestApiKey">API 키 신청하기</button>
    </div>

    <router-link to="/mypage" class="back-button">← 마이페이지로 돌아가기</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useUserInfo } from '@/modules/mypage/composables/useUserInfo'

const { user, isLoggedIn, isLoading } = useUserInfo()
const apiKey = ref(null)

const fetchApiKey = async () => {
  if (!user.value?.userId) return

  try {
    const res = await axios.get(`/api/user/apikey/getApiKey`, {
      params: { userId: user.value.userId }
    })
    apiKey.value = res.data
  } catch (e) {
    apiKey.value = null
  }
}

const requestApiKey = async () => {
  if (!user.value?.userId || !user.value?.name) {
    alert('사용자 정보가 없습니다.')
    return
  }

  try {
    const requestBody = {
      userId: user.value.userId,
      user_name: user.value.name,
      allowedIp: '',
      callbackUrls: []
    }

    await axios.post('/api/user/apikey/request', requestBody)
    await fetchApiKey()
  } catch (e) {
    console.error('API 키 신청 실패:', e)
    alert('API 키 신청 중 오류 발생')
  }
}

const reissueApiKey = async () => {
  if (!user.value?.userId) return

  try {
    await axios.post(`/api/user/apikey/reissue`, null, {
      params: { userId: user.value.userId }
    })
    alert('API 키가 재발급되었습니다.')
    await fetchApiKey()
  } catch (e) {
    console.error('재발급 실패:', e)
    alert(e.response?.data || '재발급 중 오류가 발생했습니다.')
  }
}

// ✅ formatDate 함수 추가
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return isNaN(d) ? '잘못된 날짜' : d.toLocaleString()
}

// 자동으로 키 불러오기
watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) fetchApiKey()
})

onMounted(() => {
  if (isLoggedIn.value) fetchApiKey()
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

.back-button {
  display: inline-block;
  margin-top: 20px;
  text-decoration: none;
  color: #007bff;
}

button {
  padding: 8px 16px;
  font-size: 15px;
  margin-top: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}

.reissue-button {
  margin-top: 15px;
  background: #ffc107;
  color: black;
}
.reissue-button:hover {
  background: #e0a800;
}
</style>
