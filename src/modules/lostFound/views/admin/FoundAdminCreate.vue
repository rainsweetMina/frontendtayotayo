<template>
  <div class="container py-4">
    <div class="card p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">📦 습득물 등록</h5>
        <button 
          @click="goBack" 
          class="btn btn-outline-secondary btn-sm"
        >
          <i class="bi bi-arrow-left me-1"></i> 목록으로
        </button>
      </div>
      
      <FoundItemForm @submitted="handleSubmit" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import FoundItemForm from '@/modules/lostFound/components/FoundItemForm.vue'
// import { createFoundItem } from '@/modules/lostFound/api/foundAdmin'

const router = useRouter()

const goBack = () => {
  router.push('/admin/found')
}

const handleSubmit = async (formData) => {
  try {
    await createFoundItem(formData)
    alert('습득물이 등록되었습니다.')
    router.push('/admin/found')
  } catch (error) {
    console.error('습득물 등록 실패:', error)
    alert('등록 중 오류가 발생했습니다.')
  }
}
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style> 