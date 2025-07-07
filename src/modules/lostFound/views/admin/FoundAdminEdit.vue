<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="습득물 수정" />

    <div class="mt-4">
      <div v-if="item">
        <!-- 메인 카드 -->
        <div class="p-6 bg-white rounded-md shadow-md">
          <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
            습득물 수정
          </h2>

          <!-- 폼 -->
          <FoundItemForm :item="item" @submitted="handleSubmit" @error="handleError" />
        </div>

        <!-- 매칭 섹션 -->
        <div class="p-6 bg-white rounded-md shadow-md mt-4">
          <h6 class="text-lg font-semibold text-gray-700 capitalize mb-4">
            분실물 매칭
          </h6>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">분실물 ID (매칭용)</label>
              <input 
                v-model="matchLostId" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="예: 10 (선택)" 
              />
              <small class="text-gray-500 text-sm">매칭할 분실물 ID를 입력하세요</small>
            </div>
            <div class="flex items-end">
              <button
                type="button"
                class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                @click="matchWithLostItem"
              >
                매칭하기
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="p-6 bg-white rounded-md shadow-md">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
        <p v-else class="text-center text-gray-400">정보를 찾을 수 없습니다.</p>
      </div>
    </div>

    <!-- 모달 -->
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import FoundItemForm from '@/modules/lostFound/components/FoundItemForm.vue'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'
import { matchFoundItem } from '@/modules/lostFound/api/foundAdmin'

const router = useRouter()
const route = useRoute()
const item = ref(null)
const loading = ref(true)
const matchLostId = ref('')

// 모달 상태 관리
const modalConfig = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  confirmType: 'primary',
  showCancel: false
})

const fetchItem = async () => {
  try {
    loading.value = true
    const { data } = await api.get(`/api/admin/found/${route.params.id}`)
    item.value = data
  } catch (error) {
    console.error('습득물 정보 조회 실패:', error)
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

// 1️⃣ 저장 버튼: FoundItemForm에서 emit('submitted') 수신
const handleSubmit = async () => {
  try {
    modalConfig.value = {
      isOpen: true,
      title: '수정 완료',
      message: '습득물이 성공적으로 수정되었습니다.',
      confirmText: '확인',
      confirmType: 'success',
      showCancel: false
    }
  } catch (error) {
    modalConfig.value = {
      isOpen: true,
      title: '수정 실패',
      message: '처리 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message),
      confirmText: '확인',
      confirmType: 'danger',
      showCancel: false
    }
  }
}

// 에러 처리
const handleError = (errorMessage) => {
  modalConfig.value = {
    isOpen: true,
    title: '오류',
    message: errorMessage,
    confirmText: '확인',
    confirmType: 'danger',
    showCancel: false
  }
}

// 2️⃣ 매칭하기 버튼: 분실물ID까지 포함해서 매칭까지 처리
const matchWithLostItem = async () => {
  try {
    if (!matchLostId.value) {
      modalConfig.value = {
        isOpen: true,
        title: '입력 오류',
        message: '매칭할 분실물 ID를 입력해주세요.',
        confirmText: '확인',
        confirmType: 'danger',
        showCancel: false
      }
      return
    }
    await matchFoundItem(item.value.id, matchLostId.value)
    modalConfig.value = {
      isOpen: true,
      title: '매칭 완료',
      message: '분실물과 성공적으로 매칭되었습니다.',
      confirmText: '확인',
      confirmType: 'success',
      showCancel: false
    }
  } catch (e) {
    console.error('매칭 실패:', e)
    modalConfig.value = {
      isOpen: true,
      title: '매칭 실패',
      message: '매칭 중 오류가 발생했습니다: ' + (e.response?.data?.message || e.message),
      confirmText: '확인',
      confirmType: 'danger',
      showCancel: false
    }
  }
}

const closeModal = () => {
  modalConfig.value.isOpen = false
}

const handleModalConfirm = () => {
  closeModal()
  if (modalConfig.value.confirmType === 'success') {
    if (modalConfig.value.title === '수정 완료') {
      router.push(`/admin/found/${route.params.id}`)
    } else if (modalConfig.value.title === '매칭 완료') {
      router.push('/admin/found')
    }
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
