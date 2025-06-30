<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="습득물 등록" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          습득물 등록
        </h2>

        <!-- 폼 -->
        <FoundItemForm @submitted="handleSubmit" @error="handleError" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FoundItemForm from '@/modules/lostFound/components/FoundItemForm.vue'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'
import { registerFoundItem } from '@/modules/lostFound/api/foundAdmin'

const router = useRouter()

// 모달 상태 관리
const modalConfig = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  confirmType: 'primary',
  showCancel: false
})

const handleSubmit = async () => {
  try {
    modalConfig.value = {
      isOpen: true,
      title: '등록 완료',
      message: '습득물이 성공적으로 등록되었습니다.',
      confirmText: '확인',
      confirmType: 'success',
      showCancel: false
    }
  } catch (error) {
    modalConfig.value = {
      isOpen: true,
      title: '등록 실패',
      message: '습득물 등록 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message),
      confirmText: '확인',
      confirmType: 'danger',
      showCancel: false
    }
  }
}

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

const closeModal = () => {
  modalConfig.value.isOpen = false
}

const handleModalConfirm = () => {
  closeModal()
  router.push('/admin/found')
}
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style>
