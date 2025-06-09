<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">공지사항</h1>
      <router-link
        v-if="isAdmin"
        to="/notice/write"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        글쓰기
      </router-link>
    </div>

    <!-- 공지사항 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="notice in notices" :key="notice.id">
          <router-link
            :to="'/notice/' + notice.id"
            class="block hover:bg-gray-50"
          >
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-lg font-medium text-gray-900 truncate">
                    {{ notice.title }}
                  </p>
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <span>{{ formatDate(notice.createdAt) }}</span>
                    <span class="mx-2">•</span>
                    <span>조회 {{ notice.viewCount }}</span>
                    <span v-if="notice.hasAttachment" class="ml-2">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 첨부파일 다운로드 섹션 -->
    <div v-if="selectedNotice && selectedNotice.files && selectedNotice.files.length > 0" class="mt-4 p-4 bg-white shadow sm:rounded-md">
      <h3 class="text-lg font-medium text-gray-900 mb-2">첨부파일</h3>
      <ul class="space-y-2">
        <li v-for="(file, index) in selectedNotice.files" :key="index" class="flex items-center">
          <button
            @click="downloadFile(file, index)"
            class="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            {{ file.originalName || file.fileName || '첨부파일' }}
          </button>
        </li>
      </ul>
    </div>

    <!-- 페이지네이션 -->
    <div class="mt-6 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="fetchNotices(page)"
          :class="[
            page === currentPage
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
          ]"
        >
          {{ page }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const notices = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isAdmin = ref(false)
const selectedNotice = ref(null)
const route = useRoute()

const fetchNotices = async (page = 1) => {
  try {
    const response = await axios.get(`/api/notices?page=${page}`)
    notices.value = response.data.content
    totalPages.value = response.data.totalPages
    currentPage.value = page
  } catch (error) {
    console.error('공지사항 로딩 실패:', error)
  }
}

const checkAdminRole = async () => {
  try {
    const response = await axios.get('/api/auth/check-role')
    isAdmin.value = response.data.hasRole === 'ROLE_ADMIN'
  } catch (error) {
    isAdmin.value = false
  }
}

const downloadFile = async (file, index) => {
  try {
    const noticeId = selectedNotice.value.id
    let url = `https://localhost:8081/api/notices/${noticeId}/files/${index}`
    
    const response = await axios.get(url, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = file.originalName || file.fileName || '첨부파일'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('파일 다운로드 실패:', error)
    alert('파일 다운로드에 실패했습니다.')
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// 공지사항 상세 조회
const fetchNoticeDetail = async (id) => {
  try {
    const response = await axios.get(`https://localhost:8081/api/notices/${id}`)
    selectedNotice.value = response.data
  } catch (error) {
    console.error('공지사항 상세 조회 실패:', error)
  }
}

// 라우터 변경 감지
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchNoticeDetail(newId)
  } else {
    selectedNotice.value = null
  }
}, { immediate: true })

onMounted(() => {
  fetchNotices()
  checkAdminRole()
})
</script> 