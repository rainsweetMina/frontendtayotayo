<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="Q&A 상세" />
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <div v-if="!qna" class="flex justify-center items-center py-20 text-gray-400 text-base">로딩 중...</div>
        <div v-else>
          <div class="border-b border-gray-200 pb-4 mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ qna.title }}</h2>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                {{ qna.username || '-' }}
              </span>
              <span>{{ formatDate(qna.createdAt) }}</span>
            </div>
          </div>
          <div v-if="qna.deleted" class="mb-4 p-3 bg-red-50 text-red-700 rounded font-bold text-center">삭제된 게시글입니다. (내용 확인만 가능)</div>
          <div class="py-4">
            <div class="prose max-w-none">
              <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ qna.content }}</div>
            </div>
          </div>
          <div v-if="qna.answer" class="bg-blue-50 p-4 rounded mb-2">
            <b>답변</b><br />
            <div class="prose max-w-none mt-2">
              <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ qna.answer }}</div>
            </div>
          </div>
          <div v-else class="text-gray-400 mb-2">아직 답변이 등록되지 않았습니다.</div>
          <div class="pt-4 mt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button v-if="!qna.deleted" @click="openHideConfirm" class="px-4 py-2 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition">숨김</button>
            <button v-if="!qna.deleted" @click="openDeleteConfirm" class="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition">삭제</button>
            <router-link v-if="qna.answer && !qna.deleted" :to="`/admin/qna/${qna.id}/edit`" class="px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition">답변수정</router-link>
            <router-link v-if="!qna.answer && !qna.deleted" :to="`/admin/qna/${qna.id}/answer`" class="px-4 py-2 border border-green-200 text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition">답변</router-link>
            <button class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" @click="goList">목록</button>
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
import api from '@/api/axiosInstance.js'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const route = useRoute()
const router = useRouter()
const qna = ref(null)

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

const fetchQna = async () => {
  try {
    const res = await api.get(`/api/qna/${route.params.id}`)
    qna.value = res.data
  } catch (e) {
    openModal('오류', 'QnA 정보를 불러올 수 없습니다.', '확인', 'danger')
    setTimeout(() => router.push('/admin/qna'), 1000)
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

const goList = () => router.push('/admin/qna')

const openHideConfirm = () => {
  openModal('숨김 확인', '정말 숨기시겠습니까?', '숨김', 'danger', true, handleHide)
}
const openDeleteConfirm = () => {
  openModal('삭제 확인', '정말 삭제하시겠습니까?', '삭제', 'danger', true, handleDelete)
}

const handleHide = async () => {
  modalOpen.value = false
  try {
    await api.patch(`/api/qna/admin/hide/${qna.value.id}`)
    openModal('완료', '숨김 처리되었습니다.', '확인', 'success')
    await fetchQna()
  } catch (e) {
    openModal('오류', '숨김 처리에 실패했습니다.', '확인', 'danger')
  }
}

const handleDelete = async () => {
  modalOpen.value = false
  try {
    await api.delete(`/api/qna/admin/${qna.value.id}`)
    openModal('완료', '삭제되었습니다.', '확인', 'success', false, () => router.push('/admin/qna'))
  } catch (e) {
    openModal('오류', '삭제에 실패했습니다.', '확인', 'danger')
  }
}

onMounted(fetchQna)
</script> 