<template>
  <div class="container py-4">
    <div class="card p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">📝 습득물 정보 수정</h5>
        <button 
          @click="goBack" 
          class="btn btn-outline-secondary btn-sm"
        >
          <i class="bi bi-x-circle me-1"></i> 취소
        </button>
      </div>
      
      <div v-if="item" class="mt-4">
        <FoundItemForm :item="item" @submitted="handleSubmit" />
        
        <!-- 매칭 섹션 -->
        <div class="card mt-4 bg-light">
          <div class="card-body">
            <h6 class="card-title mb-3">분실물 매칭</h6>
            <div class="row g-3 align-items-end">
              <div class="col-md-8">
                <label class="form-label">분실물 ID (매칭용)</label>
                <input v-model="matchLostId" class="form-control" placeholder="예: 10 (선택)" />
                <small class="text-muted">매칭할 분실물 ID를 입력하세요</small>
              </div>
              <div class="col-md-4 text-end">
                <button
                  type="button"
                  class="btn btn-warning"
                  @click="matchWithLostItem"
                >
                  <i class="bi bi-link me-1"></i> 매칭하기
                </button>
              </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import FoundItemForm from '@/modules/lostFound/components/FoundItemForm.vue'
import { matchFoundItem, updateFoundItem } from '@/modules/lostFound/api/foundAdmin'

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

const handleSubmit = async (formData) => {
  try {
    console.log('수정 완료 이벤트 수신됨')

    // ✅ 서버에 수정 요청을 보냄 (이 줄이 중요!)
    await updateFoundItem(route.params.id, formData)

    // ✅ 성공 후 안내 및 페이지 이동
    alert('수정되었습니다.')
    router.push(`/admin/found/${route.params.id}`)
  } catch (error) {
    console.error('폼 제출 처리 실패:', error)
    let errorMsg = '처리 중 오류가 발생했습니다';

    if (error.response?.data?.message) {
      errorMsg += ': ' + error.response.data.message;
    } else if (error.message) {
      errorMsg += ': ' + error.message;
    }

    alert(errorMsg)
  }
}

const matchWithLostItem = async () => {
  try {
    if (!matchLostId.value) {
      alert('매칭할 분실물 ID를 입력해주세요.')
      return
    }
    
    console.log('🔄 매칭 시도:', item.value.id, matchLostId.value)
    await matchFoundItem(item.value.id, matchLostId.value)
    alert('매칭되었습니다.')
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
