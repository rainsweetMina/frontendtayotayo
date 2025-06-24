<template>
  <div>
    <div v-if="item">
      <FoundItemForm :item="item" @submitted="handleSubmit" />
      <!-- 매칭 섹션도 동일 카드 스타일로 -->
      <div class="bg-white rounded-2xl shadow-lg border max-w-xl mx-auto mt-8 p-8">
        <h6 class="text-lg font-bold mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          분실물 매칭
        </h6>
        <div class="flex flex-col gap-4">
          <div>
            <label class="block font-semibold mb-1 text-gray-700">분실물 ID (매칭용)</label>
            <input v-model="matchLostId" class="form-input w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-200 focus:border-blue-500" placeholder="예: 10 (선택)" />
            <small class="text-gray-400">매칭할 분실물 ID를 입력하세요</small>
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              class="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition flex items-center"
              @click="matchWithLostItem"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              매칭하기
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="py-5 text-center">
      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <p v-else class="text-muted">정보를 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import FoundItemForm from '@/modules/lostFound/components/FoundItemForm.vue'
import { matchFoundItem } from '@/modules/lostFound/api/foundAdmin'

const router = useRouter()
const route = useRoute()
const item = ref(null)
const loading = ref(true)
const matchLostId = ref('')

const goBack = () => {
  router.push('/admin/found')
}

const fetchItem = async () => {
  try {
    loading.value = true
    const { data } = await axios.get(`/api/admin/found/${route.params.id}`)
    item.value = data
  } catch (error) {
    console.error('습득물 정보 조회 실패:', error)
  } finally {
    loading.value = false
  }
}

// 1️⃣ 저장 버튼: FoundItemForm에서 emit('submitted') 수신
const handleSubmit = async () => {
  try {
    alert('수정 완료!')
    router.push(`/admin/found/${route.params.id}`)
  } catch (error) {
    alert('처리 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message))
  }
}

// 2️⃣ 매칭하기 버튼: 분실물ID까지 포함해서 매칭까지 처리
const matchWithLostItem = async () => {
  try {
    if (!matchLostId.value) {
      alert('매칭할 분실물 ID를 입력해주세요.')
      return
    }
    await matchFoundItem(item.value.id, matchLostId.value)
    alert('매칭 완료!')
    router.push('/admin/found')
  } catch (e) {
    console.error('매칭 실패:', e)
    alert('매칭 중 오류가 발생했습니다: ' + (e.response?.data?.message || e.message))
  }
}

onMounted(() => {
  fetchItem()
})
</script>


<style scoped>
.container {
  max-width: 900px;
}
</style>
