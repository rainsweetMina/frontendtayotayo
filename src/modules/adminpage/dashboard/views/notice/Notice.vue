<template>
  <div class="p-6">
    <!-- 에러 메시지 표시 -->
    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- 로딩 표시 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">공지사항 관리</h1>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          @click="openCreateModal"
        >
          공지사항 작성
        </button>
      </div>

      <!-- 공지사항 목록 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul class="divide-y divide-gray-200">
          <li v-for="notice in notices" :key="notice.id" class="hover:bg-gray-50">
            <div class="px-6 py-5">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-blue-600 truncate">
                    {{ notice.title }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    작성일: {{ formatDate(notice.createdAt) }}
                  </p>
                </div>
                <div class="flex items-center space-x-4">
                  <button
                    class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    @click="editNotice(notice)"
                  >
                    수정
                  </button>
                  <button
                    class="text-red-600 hover:text-red-900 text-sm font-medium"
                    @click="deleteNotice(notice.id)"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div class="mt-2 text-sm text-gray-700 line-clamp-2">
                {{ notice.content }}
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 페이지네이션 -->
      <div class="mt-6">
        <nav class="flex justify-center" aria-label="Pagination">
          <button
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 mr-2"
            :disabled="currentPage === 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            @click="changePage(currentPage - 1)"
          >
            이전
          </button>
          <div class="flex items-center space-x-1">
          <button
            v-for="page in totalPages"
            :key="page"
            :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md',
              currentPage === page
                  ? 'bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          </div>
          <button
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 ml-2"
            :disabled="currentPage === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            다음
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import noticeApi from '@/api/notice.js'

const router = useRouter()
const notices = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const error = ref('')
const isLoading = ref(false)

// 공지사항 목록 조회
const fetchNotices = async () => {
  try {
    isLoading.value = true
    error.value = ''
    const response = await noticeApi.getAll()
    notices.value = response.data
    totalPages.value = response.totalPages
  } catch (err) {
    console.error('공지사항 목록 조회 실패:', err)
    if (err.response?.status === 401) {
      error.value = '로그인이 필요합니다. 잠시 후 로그인 페이지로 이동합니다.'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      error.value = '공지사항 목록을 불러오는데 실패했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchNotices()
}

// 공지사항 작성 모달 열기
const openCreateModal = () => {
  // TODO: 공지사항 작성 모달 구현
}

// 공지사항 수정
const editNotice = (notice) => {
  // TODO: 공지사항 수정 모달 구현
}

// 공지사항 삭제
const deleteNotice = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    isLoading.value = true
    error.value = ''
    await noticeApi.remove(id)
    await fetchNotices()
  } catch (err) {
    console.error('공지사항 삭제 실패:', err)
    error.value = '공지사항 삭제에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 날짜 포맷
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchNotices()
})
</script> 