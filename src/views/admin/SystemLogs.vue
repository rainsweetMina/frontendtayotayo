<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">시스템 로그</h1>
      <div class="flex space-x-4">
        <select
          v-model="logLevel"
          class="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">전체</option>
          <option value="error">에러</option>
          <option value="warn">경고</option>
          <option value="info">정보</option>
          <option value="debug">디버그</option>
        </select>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="downloadLogs"
        >
          로그 다운로드
        </button>
      </div>
    </div>

    <!-- 로그 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="divide-y divide-gray-200">
        <div v-for="log in logs" :key="log.id" class="p-4">
          <div class="flex items-center">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3',
                getLogLevelClass(log.level)
              ]"
            >
              {{ log.level.toUpperCase() }}
            </span>
            <span class="text-sm text-gray-500">
              {{ formatDateTime(log.timestamp) }}
            </span>
          </div>
          <div class="mt-2">
            <pre class="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded">{{ log.message }}</pre>
          </div>
          <div v-if="log.details" class="mt-2">
            <button
              class="text-sm text-blue-600 hover:text-blue-800"
              @click="log.isExpanded = !log.isExpanded"
            >
              {{ log.isExpanded ? '상세 정보 접기' : '상세 정보 보기' }}
            </button>
            <pre
              v-if="log.isExpanded"
              class="mt-2 text-sm text-gray-600 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded"
            >{{ JSON.stringify(log.details, null, 2) }}</pre>
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
import { ref, onMounted, watch } from 'vue'

// 상태 데이터
const logs = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const logLevel = ref('all')

// 데이터 가져오기
const fetchLogs = async (page) => {
  try {
    const response = await fetch(
      `/api/admin/system-logs?page=${page}&level=${logLevel.value}`
    )
    const data = await response.json()
    logs.value = data.logs.map(log => ({
      ...log,
      isExpanded: false
    }))
    totalPages.value = data.totalPages
  } catch (error) {
    console.error('시스템 로그 데이터 로딩 실패:', error)
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchLogs(page)
}

// 로그 레벨에 따른 스타일 클래스
const getLogLevelClass = (level) => {
  const classes = {
    error: 'bg-red-100 text-red-800',
    warn: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    debug: 'bg-gray-100 text-gray-800'
  }
  return classes[level] || 'bg-gray-100 text-gray-800'
}

// 로그 다운로드
const downloadLogs = async () => {
  try {
    const response = await fetch('/api/admin/system-logs/download')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${new Date().toISOString()}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('로그 다운로드 실패:', error)
  }
}

// 날짜/시간 포맷
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 로그 레벨 변경 시 데이터 다시 로드
watch(logLevel, () => {
  currentPage.value = 1
  fetchLogs(1)
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchLogs(1)
})
</script> 