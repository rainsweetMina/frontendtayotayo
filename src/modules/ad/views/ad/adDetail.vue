<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="광고 상세" />
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <div v-if="!ad" class="flex justify-center items-center py-20 text-gray-400 text-base">로딩 중...</div>
        <div v-else>
          <div class="border-b border-gray-200 pb-4 mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ ad.title }}</h2>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                ID: {{ ad.id }}
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                {{ statusText(ad.status) }}
              </span>
            </div>
          </div>
          
          <div class="py-4">
            <div class="bg-gray-50 rounded-md p-4 mb-6 border border-gray-100">
              <div class="mb-2"><b>제목:</b> {{ ad.title }}</div>
              <div class="mb-2"><b>링크:</b> <a :href="ad.linkUrl" target="_blank" class="text-blue-600 underline">{{ ad.linkUrl }}</a></div>
              <div class="mb-2"><b>광고회사:</b> {{ ad.companyName }}</div>
              <div class="mb-2"><b>시작일:</b> {{ formatDate(ad.startDateTime) }}</div>
              <div class="mb-2"><b>종료일:</b> {{ formatDate(ad.endDateTime) }}</div>
              <div class="mb-2"><b>연장횟수:</b> {{ ad.extensionCount }}회</div>
              <div class="mb-2"><b>팝업 표시:</b> {{ ad.showPopup ? '예' : '아니오' }}</div>
            </div>
            
            <!-- 광고 이미지 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-700 mb-3">광고 이미지</h3>
              <div class="flex justify-center">
                <img
                    v-if="ad.imageUrl"
                    :src="`/uploads/ad/${ad.imageUrl}`"
                    alt="광고 이미지"
                    class="max-w-full h-auto rounded-lg shadow-lg"
                    style="max-height: 400px;"
                />
                <span v-else class="text-gray-400">이미지가 없습니다.</span>
              </div>
            </div>
          </div>
          
          <div class="pt-4 mt-6 border-t border-gray-200 flex justify-end space-x-3">
            <router-link 
              :to="`/admin/ad/edit/${ad.id}`" 
              class="px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition"
            >수정</router-link>
            <router-link 
              :to="`/admin/ad/extend/${ad.id}`" 
              class="px-4 py-2 border border-green-200 text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition"
            >연장</router-link>
            <button 
              @click="openDeleteConfirm" 
              class="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition"
            >삭제</button>
            <button 
              class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" 
              @click="goList"
            >목록</button>
          </div>
        </div>
      </div>
    </div>
    <CommonModal
      :isOpen="modalOpen"
      :title="modalTitle"
      :message="modalMessage"
      :confirmText="modalConfirmText"
      :confirmType="modalConfirmType"
      :showCancel="modalShowCancel"
      @close="closeModal"
      @confirm="modalConfirmAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAd, deleteAd } from '@/modules/ad/api/adApi.js'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const route = useRoute()
const router = useRouter()
const ad = ref(null)

// Modal state
const modalOpen = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalConfirmText = ref('확인')
const modalConfirmType = ref('primary')
const modalShowCancel = ref(false)
let modalConfirmAction = () => { modalOpen.value = false }

const openModal = (title, message, confirmText = '확인', confirmType = 'primary', showCancel = false, onConfirm = null) => {
  modalTitle.value = title
  modalMessage.value = message
  modalConfirmText.value = confirmText
  modalConfirmType.value = confirmType
  modalShowCancel.value = showCancel
  modalOpen.value = true
  modalConfirmAction = onConfirm || (() => { modalOpen.value = false })
}

const closeModal = () => { modalOpen.value = false }

const fetchAdData = async () => {
  try {
    ad.value = await fetchAd(route.params.id)
  } catch (e) {
    openModal('오류', '광고 정보를 불러올 수 없습니다.', '확인', 'danger')
    setTimeout(() => router.push('/admin/ad'), 1000)
  }
}

const goList = () => router.push('/admin/ad')

const openDeleteConfirm = () => {
  openModal('삭제 확인', '정말 삭제하시겠습니까?', '삭제', 'danger', true, handleDelete)
}

const handleDelete = async () => {
  modalOpen.value = false
  try {
    await deleteAd(ad.value.id)
    openModal('완료', '삭제되었습니다.', '확인', 'success', false, () => router.push('/admin/ad'))
  } catch (e) {
    openModal('오류', '삭제에 실패했습니다.', '확인', 'danger')
  }
}

const statusText = (status) => {
  switch (status) {
    case 'SCHEDULED': return '예정'
    case 'ONGOING': return '진행중'
    case 'ENDING_SOON': return '종료임박'
    case 'ENDED': return '종료됨'
    case 'DELETED': return '삭제됨'
    default: return status
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

onMounted(fetchAdData)
</script> 