<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="습득물 상세" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <div v-if="!item" class="flex justify-center items-center py-20 text-gray-400 text-base">
          <div v-if="loading" class="flex justify-center">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
          <p v-else>정보를 찾을 수 없습니다.</p>
        </div>
        <div v-else>
          <div class="border-b border-gray-200 pb-4 mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ item.itemName }}</h2>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                ID: {{ item.id }}
              </span>
              <span>{{ formatDate(item.foundTime) }}</span>
            </div>
          </div>

          <div v-if="item.isDeleted || item.deleted" class="mb-4 p-3 bg-red-50 text-red-700 rounded font-bold text-center">삭제된 습득물입니다. (내용 확인만 가능)</div>
          <div v-else-if="item.visible === false" class="mb-4 p-3 bg-blue-50 text-blue-700 rounded font-bold text-center">숨김 처리된 습득물입니다.</div>

          <!-- 이미지 -->
          <div class="flex flex-col items-center mb-6">
            <img 
              v-if="item.photoUrl" 
              :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`" 
              alt="등록된 이미지" 
              class="w-64 h-40 object-cover rounded-lg shadow border" 
            />
            <div v-else class="w-64 h-40 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
              이미지 없음
            </div>
          </div>

          <!-- 상세 정보 -->
          <div class="py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">물품명</span>
                  <span class="text-sm text-gray-900">{{ item.itemName || '-' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">버스 회사</span>
                  <span class="text-sm text-gray-900">{{ item.busCompany || '-' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">노선 번호</span>
                  <span class="text-sm text-gray-900">{{ item.busNumber || '-' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">습득 위치</span>
                  <span class="text-sm text-gray-900">{{ item.foundPlace || '-' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">습득일</span>
                  <span class="text-sm text-gray-900">{{ formatDate(item.foundTime) }}</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">연락처</span>
                  <span class="text-sm text-gray-900">{{ item.handlerContact || '-' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">이메일</span>
                  <span class="text-sm text-gray-900">{{ item.handlerEmail || '-' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">처리 상태</span>
                  <span :class="getStatusClass(item.status)">{{ statusLabel(item.status) }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">보관 장소</span>
                  <span class="text-sm text-gray-900">{{ item.storageLocation || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- 내용 -->
            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-500 mb-2">내용</h3>
              <div class="prose max-w-none">
                <div class="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">{{ item.content || '-' }}</div>
              </div>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="pt-4 mt-6 border-t border-gray-200 flex justify-end space-x-3">
            <router-link 
              v-if="!item.isDeleted && !item.deleted && authStore.role === 'BUS'"
              :to="`/admin/found/edit/${item.id}`"
              class="px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
            >
              수정
            </router-link>
            <button 
              @click="goBack" 
              class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              목록
            </button>
          </div>
        </div>
      </div>
    </div>

    <CommonModal
      :is-open="modalConfig.isOpen"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :confirm-text="modalConfig.confirmText"
      :confirm-type="modalConfig.confirmType"
      :show-cancel="modalConfig.showCancel"
      @close="closeModal"
      @confirm="handleModalConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api/axiosInstance.js'
import { useAuthStore } from '@/stores/auth'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const router = useRouter()
const route = useRoute()
const item = ref(null)
const loading = ref(true)
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '';
const authStore = useAuthStore()

// 모달 상태 관리
const modalConfig = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  confirmType: 'primary',
  showCancel: false
})

const goBack = () => {
  router.push('/admin/found')
}

const fetchItem = async () => {
  try {
    loading.value = true
    const { data } = await api.get(`/api/admin/found/${route.params.id}`)
    item.value = data
  } catch (error) {
    console.error('습득물 상세 정보 조회 실패:', error)
    modalConfig.value = {
      isOpen: true,
      title: '조회 실패',
      message: '습득물 정보를 불러오는 중 오류가 발생했습니다.',
      confirmText: '확인',
      confirmType: 'danger',
      showCancel: false
    }
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

const getStatusClass = (status) => {
  const map = {
    IN_STORAGE: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    RETURNED: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
  }
  return map[status] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

const closeModal = () => {
  modalConfig.value.isOpen = false
}

const handleModalConfirm = () => {
  closeModal()
}

onMounted(() => {
  fetchItem()
})

watchEffect(() => {
  if (item.value && item.value.createdAt) {
    const created = new Date(item.value.createdAt)
    const now = new Date()
    const diff = (now - created) / (1000 * 60 * 60 * 24)
    if (diff > 30) {
      item.value = null
    }
  }
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
