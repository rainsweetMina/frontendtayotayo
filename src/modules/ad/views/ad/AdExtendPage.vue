<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="광고 연장" />
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">광고 연장</h2>
        
        <form @submit.prevent="handleExtension" class="space-y-6">
          <!-- 광고 ID -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">광고 ID</label>
            <input
                type="text"
                :value="adId"
                disabled
                class="block w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <!-- 기존 종료일 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">기존 종료일</label>
            <input
                type="text"
                :value="ad?.endDateTime ? formatDate(ad.endDateTime) : '-'"
                disabled
                class="block w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <!-- 새 종료일 -->
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-700">새 종료일 *</label>
            <input
                type="datetime-local"
                v-model="newEndDateTime"
                :min="minEndDateTime"
                class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition"
                required
            />
          </div>

          <!-- 버튼 -->
          <div class="flex justify-end space-x-3 mt-8">
            <button
                type="button"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                @click="goBack"
            >취소</button>
            <button
                type="submit"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >연장 요청</button>
          </div>
        </form>
        
        <CommonModal
          :isOpen="modalOpen"
          :title="modalTitle"
          :message="modalMessage"
          :confirmText="modalConfirmText"
          :confirmType="modalConfirmType"
          :showCancel="false"
          @close="handleModalClose"
          @confirm="handleModalClose"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { extendAd, fetchAd } from '@/modules/ad/api/adApi.js'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const router = useRouter()
const route = useRoute()

const adId = route.params.id
const ad = ref(null)
const newEndDateTime = ref('')

// Modal state
const modalOpen = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalConfirmText = ref('확인')
const modalConfirmType = ref('primary')

const fetchAdData = async () => {
  try {
    ad.value = await fetchAd(adId)
  } catch (e) {
    showErrorModal('광고 정보를 불러오지 못했습니다.', true)
  }
}

onMounted(fetchAdData)

const minEndDateTime = computed(() => {
  return new Date().toISOString().slice(0, 16)
})

const handleExtension = async () => {
  if (!newEndDateTime.value) {
    showErrorModal('새 종료일을 입력해주세요.')
    return
  }

  try {
    await extendAd(adId, newEndDateTime.value)
    showSuccessModal(`광고가 성공적으로 연장되었습니다.\n새 종료일: ${newEndDateTime.value.replace('T', ' ')}`)
  } catch (e) {
    showErrorModal('광고 연장에 실패했습니다.')
  }
}

function showSuccessModal(msg) {
  modalTitle.value = '완료'
  modalMessage.value = msg
  modalConfirmText.value = '확인'
  modalConfirmType.value = 'success'
  modalOpen.value = true
}

function showErrorModal(msg, redirect = false) {
  modalTitle.value = '오류'
  modalMessage.value = msg
  modalConfirmText.value = '확인'
  modalConfirmType.value = 'danger'
  modalOpen.value = true
  if (redirect) setTimeout(() => router.push('/admin/ad'), 1000)
}

function handleModalClose() {
  modalOpen.value = false
  if (modalConfirmType.value === 'success') {
    router.push('/admin/ad')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr.replace('T', ' ').slice(0, 16)
}

const goBack = () => {
  router.push('/admin/ad')
}
</script>

<style scoped>
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
}
</style>
