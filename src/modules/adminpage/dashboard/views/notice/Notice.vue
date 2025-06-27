<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="공지사항" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          공지사항 게시판
        </h2>

        <!-- 에러 메시지 표시 -->
        <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
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

        <!-- 검색 및 필터 -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            <select class="border border-gray-200 rounded-md px-3 py-2 focus:border-blue-600 focus:ring focus:ring-opacity-40 focus:ring-blue-500 text-gray-700 w-24">
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>
            <div class="relative mx-4 lg:mx-0">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <input
                class="w-32 pl-10 pr-4 text-gray-700 border-gray-200 rounded-md sm:w-64 focus:border-blue-600 focus:ring focus:ring-opacity-40 focus:ring-blue-500"
                type="text"
                placeholder="검색어를 입력하세요"
              />
            </div>
          </div>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            @click="openCreateModal"
          >
            글쓰기
          </button>
        </div>

        <!-- 로딩 표시 -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  번호
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!notices || notices.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">등록된 공지사항이 없습니다.</td>
              </tr>
              <tr v-for="notice in notices" :key="notice.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ notice.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ notice.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  작성일: {{ formatDate(notice.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ formatDate(notice.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <button
                    class="text-blue-600 hover:text-blue-900 mr-2"
                    @click="editNotice(notice)"
                  >
                    수정
                  </button>
                  <button
                    class="text-red-600 hover:text-red-900"
                    @click="deleteNotice(notice.id)"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <div class="flex justify-center mt-4">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :disabled="currentPage === 1"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              @click="changePage(currentPage - 1)"
            >
              이전
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50',
                currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : ''
              ]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import noticeApi from '@/api/notice.js'
import Breadcrumb from '../../partials/AppBreadcrumb.vue'

const router = useRouter()
const notices = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const error = ref('')
const isLoading = ref(false)

// 공지사항 목록 조회
const fetchNotices = async (page = 1) => {
  try {
    isLoading.value = true
    error.value = ''
    console.log(`페이지 ${page} 데이터 요청 중...`)
    
    // 페이지 번호는 백엔드가 0부터 시작하는 경우 조정 필요
    const apiPage = page - 1
    const response = await noticeApi.getAll(apiPage, 10)
    console.log('공지사항 응답 데이터:', response.data)
    
    if (response.data && response.data.content) {
      console.log('페이지네이션 데이터 구조 확인:', {
        content: response.data.content.length,
        totalPages: response.data.totalPages,
        currentPage: response.data.number + 1
      })
      notices.value = response.data.content
      totalPages.value = response.data.totalPages || 1
      currentPage.value = response.data.number + 1 || page
    } else if (Array.isArray(response.data)) {
      console.log('배열 데이터 구조 확인:', {
        length: response.data.length,
        calculatedPages: Math.ceil(response.data.length / 10)
      })
      notices.value = response.data
      totalPages.value = Math.ceil(response.data.length / 10) // 기본 페이지 크기 10
      currentPage.value = page
    } else {
      console.log('기타 데이터 구조:', response.data)
      notices.value = []
      totalPages.value = 1
      currentPage.value = 1
    }
    
    console.log(`페이지 ${page} 로딩 완료, 현재 페이지: ${currentPage.value}, 전체 페이지: ${totalPages.value}`)
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
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchNotices(page);
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
  fetchNotices(1);
})
</script> 