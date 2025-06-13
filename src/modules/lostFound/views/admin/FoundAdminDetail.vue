<template>
  <div class="container py-4">
    <div class="card p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">📦 습득물 상세 정보 (관리자)</h5>
        <div class="d-flex gap-2">
          <button 
            @click="goToEditPage" 
            class="btn btn-primary btn-sm"
          >
            <i class="bi bi-pencil me-1"></i> 수정
          </button>
          <button 
            @click="goBack" 
            class="btn btn-outline-secondary btn-sm"
          >
            <i class="bi bi-arrow-left me-1"></i> 목록으로
          </button>
        </div>
      </div>
      
      <div v-if="item" class="row">
        <!-- 이미지 -->
        <div class="col-md-4 text-center mb-3">
          <img 
            v-if="item.photoUrl" 
            :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`" 
            alt="등록된 이미지" 
            class="img-fluid rounded shadow-sm" 
            style="max-height: 220px;" 
          />
          <div v-else class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 220px;">
            <span class="text-muted">이미지 없음</span>
          </div>
        </div>

        <!-- 상세 정보 -->
        <div class="col-md-8">
          <table class="table table-bordered">
            <tbody>
              <tr>
                <th>물품명</th>
                <td>{{ item.itemName || '-' }}</td>
              </tr>
              <tr>
                <th>버스 회사</th>
                <td>{{ item.busCompany || '-' }}</td>
              </tr>
              <tr>
                <th>노선 번호</th>
                <td>{{ item.busNumber || '-' }}</td>
              </tr>
              <tr>
                <th>습득 위치</th>
                <td>{{ item.foundPlace || '-' }}</td>
              </tr>
              <tr>
                <th>습득일</th>
                <td>{{ formatDate(item.foundTime) }}</td>
              </tr>
              <tr>
                <th>연락처</th>
                <td>{{ item.handlerContact || '-' }}</td>
              </tr>
              <tr>
                <th>이메일</th>
                <td>{{ item.handlerEmail || '-' }}</td>
              </tr>
              <tr>
                <th>처리 상태</th>
                <td>{{ statusLabel(item.status) }}</td>
              </tr>
              <tr>
                <th>보관 장소</th>
                <td>{{ item.storageLocation || '-' }}</td>
              </tr>
              <tr>
                <th>내용</th>
                <td>{{ item.content || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else class="py-10 text-center">
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

const router = useRouter()
const route = useRoute()
const item = ref(null)
const loading = ref(true)
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '';

const goBack = () => {
  router.push('/admin/found')
}

const goToEditPage = () => {
  router.push(`/admin/found/edit/${route.params.id}`)
}

const fetchItem = async () => {
  try {
    loading.value = true
    const { data } = await axios.get(`/api/admin/found/${route.params.id}`)
    item.value = data
  } catch (error) {
    console.error('습득물 상세 정보 조회 실패:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}

const statusLabel = (status) => {
  const map = {
    IN_STORAGE: '보관중',
    RETURNED: '수령완료'
  }
  return map[status] || status
}

onMounted(() => {
  fetchItem()
})
</script>

<style scoped>
.container {
  max-width: 900px;
}

th {
  width: 30%;
  background-color: #f8f9fa;
}

td {
  white-space: pre-wrap;
}
</style>
