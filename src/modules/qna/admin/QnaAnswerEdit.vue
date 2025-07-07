<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="Q&A 답변수정" />
    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">QnA 답변 수정</h2>
        <div v-if="loading" class="text-center py-12 text-gray-500">로딩 중...</div>
        <div v-else>
          <div class="bg-gray-50 rounded-md p-4 mb-6 border border-gray-100">
            <div class="mb-2"><b>질문 제목:</b> {{ qna.title }}</div>
            <div class="mb-2"><b>질문:</b> {{ qna.question }}</div>
            <div class="mb-2"><b>내용:</b> {{ qna.content }}</div>
            <div class="mb-2"><b>작성자:</b> {{ qna.userName }}</div>
            <div class="mb-2"><b>작성일:</b> {{ formatDate(qna.createdAt) }}</div>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="mb-6">
              <label class="block mb-2 text-sm font-medium text-gray-700">답변</label>
              <textarea v-model="answer" rows="6" class="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition" required placeholder="답변을 입력하세요"></textarea>
            </div>
            <div class="flex justify-end space-x-3 mt-8">
              <button type="button" class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" @click="$router.push('/admin/qna')">취소</button>
              <button type="submit" class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">저장</button>
            </div>
          </form>
        </div>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const route = useRoute()
const router = useRouter()
const qna = ref({})
const answer = ref('')
const loading = ref(true)

const modalOpen = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalConfirmText = ref('확인')
const modalConfirmType = ref('primary')

const fetchQna = async () => {
  try {
    const res = await api.get(`/api/qna/${route.params.id}`)
    qna.value = res.data
    answer.value = res.data.answer || ''
    loading.value = false
  } catch (e) {
    showErrorModal('QnA 정보를 불러올 수 없습니다.', true)
  }
}

const handleSubmit = async () => {
  try {
    await api.put(`/api/qna/${route.params.id}/answer`, { answer: answer.value })
    showSuccessModal('답변이 수정되었습니다.')
  } catch (e) {
    showErrorModal('답변 수정에 실패했습니다.')
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
  if (redirect) setTimeout(() => router.push('/admin/qna'), 1000)
}
function handleModalClose() {
  modalOpen.value = false
  if (modalConfirmType.value === 'success') {
    router.push('/admin/qna')
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

onMounted(fetchQna)
</script> 