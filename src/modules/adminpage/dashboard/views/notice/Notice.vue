<template>
  <div>
    <!-- 에러 메시지 표시 -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">오류!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- 로딩 표시 -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">공지사항 관리</h1>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="openCreateModal"
        >
          공지사항 작성
        </button>
      </div>

      <!-- 공지사항 목록 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="notice in notices" :key="notice.id">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-blue-600 truncate">
                    {{ notice.title }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    작성일: {{ formatDate(notice.createdAt) }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    @click="editNotice(notice)"
                  >
                    수정
                  </button>
                  <button
                    class="px-3 py-1 text-sm text-red-600 hover:text-red-800"
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
      <div class="flex justify-center mt-6">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            이전
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            :class="[
              'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium',
              currentPage === page
                ? 'text-blue-600 border-blue-500'
                : 'text-gray-700 hover:bg-gray-50'
            ]"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :disabled="currentPage === totalPages"
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