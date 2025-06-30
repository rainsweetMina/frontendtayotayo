<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="Q&A 관리" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          Q&A 게시판
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

        <!-- 성공 메시지(AlertMessage) -->
        <AlertMessage
          v-if="showAlert"
          type="success"
          title="성공"
          :message="alertMessage"
          :dismissible="true"
          :show="showAlert"
          @close="showAlert = false"
        />

        <!-- 검색 및 필터 -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            <select class="border border-gray-200 rounded-md px-3 py-2 focus:border-blue-600 focus:ring focus:ring-opacity-40 focus:ring-blue-500 text-gray-700 w-24">
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="user">작성자</option>
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
                v-model="searchKeyword"
                class="w-32 pl-10 pr-4 text-gray-700 border-gray-200 rounded-md sm:w-64 focus:border-blue-600 focus:ring focus:ring-opacity-40 focus:ring-blue-500"
                type="text"
                placeholder="검색어를 입력하세요"
                @keyup.enter="handleSearch(searchKeyword)"
              />
            </div>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              @click="handleSearch(searchKeyword)"
            >
              검색
            </button>
            <button
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              @click="resetSearch"
            >
              초기화
            </button>
          </div>
        </div>

        <!-- 필터 버튼들 -->
        <div class="mb-6 flex flex-wrap gap-3">
          <button 
            @click="setFilter('all')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            전체 ({{ qnaList.length }})
          </button>
          <button 
            @click="setFilter('unanswered')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === 'unanswered' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            미답변 ({{ unansweredCount }})
          </button>
          <button 
            @click="setFilter('answered')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === 'answered' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            답변완료 ({{ answeredCount }})
          </button>
          <button 
            @click="setFilter('deleted')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === 'deleted' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            삭제됨 ({{ deletedCount }})
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
                  상태
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!pagedQnaList || pagedQnaList.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">등록된 Q&A가 없습니다.</td>
              </tr>
              <tr v-for="qna in pagedQnaList" :key="qna.id" class="hover:bg-gray-50" @click="goDetail(qna.id)">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ qna.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <router-link :to="`/admin/qna/${qna.id}`" class="hover:underline text-blue-700">
                    {{ qna.title }}
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ qna.username || qna.userName || qna.author || qna.memberName || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ formatDate(qna.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <span v-if="qna.deleted" class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-red-100 text-red-500">삭제됨</span>
                  <span v-else-if="!qna.visible" class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-gray-200 text-gray-500">숨김</span>
                  <span v-else-if="!qna.answer" class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-red-100 text-red-600">미답변</span>
                  <span v-else class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-green-100 text-green-700">답변완료</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex justify-center items-center gap-2" @click.stop>
                    <router-link
                      v-if="!qna.answer"
                      :to="`/admin/qna/${qna.id}/answer`"
                      class="text-green-600 hover:text-green-900 mr-2"
                    >
                      답변
                    </router-link>
                    <router-link
                      v-if="qna.answer"
                      :to="`/admin/qna/${qna.id}/edit`"
                      class="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      답변수정
                    </router-link>
                    <button
                      class="text-yellow-600 hover:text-yellow-900 mr-2"
                      @click.stop="handleHide(qna.id)"
                    >
                      숨김
                    </button>
                    <button
                      class="text-red-600 hover:text-red-900"
                      @click.stop="handleDelete(qna.id)"
                    >
                      삭제
                    </button>
                  </div>
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
              :disabled="page === 1"
              :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
              @click="() => { if (page > 1) page--; if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'smooth'}) }"
            >
              이전
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50',
                page === p ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : ''
              ]"
              @click="() => { page = p; if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'smooth'}) }"
            >
              {{ p }}
            </button>
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :disabled="page === totalPages"
              :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
              @click="() => { if (page < totalPages) page++; if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'smooth'}) }"
            >
              다음
            </button>
          </nav>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import SearchBar from '@/modules/ad/components/SearchBar.vue'
import AlertMessage from '@/modules/adminpage/dashboard/components/AlertMessage.vue'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const qnaList = ref([])
const router = useRouter()
const searchKeyword = ref('')
const filteredQnaList = ref([])
const page = ref(1)
const pageSize = 10
const currentFilter = ref('all')
const isLoading = ref(false)
const error = ref('')
const showAlert = ref(false)
const alertMessage = ref('')

// Modal state
const modalOpen = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalConfirmText = ref('확인')
const modalConfirmType = ref('primary')
const modalShowCancel = ref(false)
let modalConfirmAction = () => { modalOpen.value = false }

const totalPages = computed(() => Math.ceil(filteredQnaList.value.length / pageSize))
const pagedQnaList = computed(() =>
  filteredQnaList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

// 필터별 개수 계산
const unansweredCount = computed(() => 
  qnaList.value.filter(qna => !qna.answer && !qna.deleted).length
)
const answeredCount = computed(() => 
  qnaList.value.filter(qna => qna.answer && !qna.deleted).length
)
const deletedCount = computed(() => 
  qnaList.value.filter(qna => qna.deleted).length
)

const fetchQnaList = async () => {
  try {
    isLoading.value = true
    error.value = ''
    const res = await axios.get('/api/qna/admin')
    qnaList.value = res.data
    filterQna()
  } catch (e) {
    console.error('QnA 목록 조회 실패:', e)
    error.value = 'QnA 목록을 불러올 수 없습니다.'
  } finally {
    isLoading.value = false
  }
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword
  filterQna()
}

const resetSearch = () => {
  searchKeyword.value = ''
  currentFilter.value = 'all'
  filterQna()
}

const filterQna = () => {
  let filtered = qnaList.value

  // 필터 적용
  switch (currentFilter.value) {
    case 'unanswered':
      filtered = filtered.filter(qna => !qna.answer && !qna.deleted)
      break
    case 'answered':
      filtered = filtered.filter(qna => qna.answer && !qna.deleted)
      break
    case 'deleted':
      filtered = filtered.filter(qna => qna.deleted)
      break
    case 'all':
    default:
      // 전체는 필터링하지 않음
      break
  }

  // 검색어 적용
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(qna => {
      return (
        (qna.title && qna.title.toLowerCase().includes(keyword)) ||
        (qna.content && qna.content.toLowerCase().includes(keyword)) ||
        (qna.username && qna.username.toLowerCase().includes(keyword)) ||
        (qna.answer && qna.answer.toLowerCase().includes(keyword))
      )
    })
  }

  filteredQnaList.value = filtered
  page.value = 1 // 필터 변경 시 첫 페이지로 이동
}

const rowClass = (qna) => {
  if (qna.deleted) return 'bg-red-50 text-red-700'
  if (!qna.visible) return 'bg-gray-50 text-gray-500'
  return ''
}

const goDetail = (id) => {
  router.push(`/admin/qna/${id}`)
}

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

const handleHide = (id) => {
  openModal('숨김 확인', '정말 숨기시겠습니까?', '숨김', 'danger', true, async () => {
    modalOpen.value = false
    try {
      isLoading.value = true
      error.value = ''
      await axios.patch(`/api/qna/admin/hide/${id}`)
      await fetchQnaList()
      alertMessage.value = '숨김 처리되었습니다.'
      showAlert.value = true
    } catch (e) {
      openModal('오류', '숨김 처리에 실패했습니다.', '확인', 'danger')
    } finally {
      isLoading.value = false
    }
  })
}

const handleDelete = (id) => {
  openModal('삭제 확인', '정말 삭제하시겠습니까?', '삭제', 'danger', true, async () => {
    modalOpen.value = false
    try {
      isLoading.value = true
      error.value = ''
      await axios.delete(`/api/qna/admin/${id}`)
      await fetchQnaList()
      alertMessage.value = '삭제되었습니다.'
      showAlert.value = true
    } catch (e) {
      openModal('오류', '삭제에 실패했습니다.', '확인', 'danger')
    } finally {
      isLoading.value = false
    }
  })
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

const setFilter = (filter) => {
  currentFilter.value = filter
  filterQna()
}

watch(showAlert, (val) => {
  if (val) {
    setTimeout(() => { showAlert.value = false }, 2000)
  }
})

onMounted(fetchQnaList)
watch(qnaList, filterQna)
</script> 