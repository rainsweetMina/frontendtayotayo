<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Q&A 관리</h1>
    </div>

    <!-- Q&A 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="divide-y divide-gray-200">
        <div v-for="qna in qnaList" :key="qna.id" class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    qna.isAnswered
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ qna.isAnswered ? '답변완료' : '미답변' }}
                </span>
                <h3 class="text-sm font-medium text-gray-900">
                  {{ qna.title }}
                </h3>
              </div>
              <div class="mt-1 text-sm text-gray-500">
                작성자: {{ qna.author }} | 작성일: {{ formatDate(qna.createdAt) }}
              </div>
            </div>
            <button
              class="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              @click="toggleAnswer(qna)"
            >
              {{ qna.isExpanded ? '접기' : '답변하기' }}
            </button>
          </div>

          <!-- 질문 내용 -->
          <div class="mt-2 text-sm text-gray-700">
            {{ qna.content }}
          </div>

          <!-- 답변 영역 -->
          <div v-if="qna.isExpanded" class="mt-4">
            <div class="bg-gray-50 p-4 rounded-md">
              <textarea
                v-model="qna.answer"
                rows="4"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :placeholder="qna.isAnswered ? '' : '답변을 입력하세요...'"
                :disabled="qna.isAnswered"
              ></textarea>
              <div class="mt-3 flex justify-end space-x-3">
                <button
                  v-if="!qna.isAnswered"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  @click="submitAnswer(qna)"
                >
                  답변 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 상태 데이터
const qnaList = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

// 데이터 가져오기
const fetchQnaList = async (page) => {
  try {
    const response = await fetch(`/api/admin/qna?page=${page}`)
    const data = await response.json()
    qnaList.value = data.qnaList.map(qna => ({
      ...qna,
      isExpanded: false
    }))
    totalPages.value = data.totalPages
  } catch (error) {
    console.error('Q&A 데이터 로딩 실패:', error)
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchQnaList(page)
}

// 답변 토글
const toggleAnswer = (qna) => {
  qna.isExpanded = !qna.isExpanded
}

// 답변 제출
const submitAnswer = async (qna) => {
  try {
    await fetch(`/api/admin/qna/${qna.id}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: qna.answer
      })
    })
    await fetchQnaList(currentPage.value)
  } catch (error) {
    console.error('답변 등록 실패:', error)
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

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchQnaList(1)
})
</script> 