<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">이용 통계</h1>
      <div class="flex space-x-4">
        <select
          v-model="period"
          class="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="day">일간</option>
          <option value="week">주간</option>
          <option value="month">월간</option>
          <option value="year">연간</option>
        </select>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="downloadStats"
        >
          통계 다운로드
        </button>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- 총 이용자 수 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">총 이용자 수</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <span>{{ stats.userGrowth }}%</span>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- 버스 이용 횟수 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">버스 이용 횟수</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.totalRides }}</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <span>{{ stats.rideGrowth }}%</span>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- 분실물 신고 건수 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">분실물 신고</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.totalLostItems }}</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-yellow-600">
                    <span>{{ stats.lostItemGrowth }}%</span>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- API 응답 시간 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">평균 API 응답 시간</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.avgResponseTime }}ms</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <span>{{ stats.responseTimeImprovement }}%</span>
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 차트 -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- 시간대별 이용자 수 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">시간대별 이용자 수</h3>
        <div class="h-64">
          <!-- TODO: 차트 컴포넌트 구현 -->
        </div>
      </div>

      <!-- 노선별 이용자 수 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">노선별 이용자 수</h3>
        <div class="h-64">
          <!-- TODO: 차트 컴포넌트 구현 -->
        </div>
      </div>
    </div>

    <!-- 최근 관리자 작업 로그 -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">최근 관리자 작업 내역</h2>
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="divide-y divide-gray-200">
          <div v-for="log in adminLogs" :key="log.id" class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3',
                    getActionClass(log.action)
                  ]"
                >
                  {{ getActionText(log.action) }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ formatDateTime(log.timestamp) }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                {{ log.adminName }}
              </div>
            </div>
            <p class="mt-1 text-sm text-gray-700">
              {{ log.description }}
            </p>
            <div class="mt-1 text-xs text-gray-500">
              {{ log.category }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// 상태 데이터
const period = ref('day')
const stats = ref({
  totalUsers: 0,
  userGrowth: 0,
  totalRides: 0,
  rideGrowth: 0,
  totalLostItems: 0,
  lostItemGrowth: 0,
  avgResponseTime: 0,
  responseTimeImprovement: 0
})

// 관리자 로그 데이터
const adminLogs = ref([])

// 데이터 가져오기
const fetchStats = async () => {
  try {
    const response = await fetch(`/api/admin/usage-stats?period=${period.value}`)
    const data = await response.json()
    stats.value = data
  } catch (error) {
    console.error('통계 데이터 로딩 실패:', error)
  }
}

// 통계 다운로드
const downloadStats = async () => {
  try {
    const response = await fetch(`/api/admin/usage-stats/download?period=${period.value}`)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `usage-stats-${period.value}-${new Date().toISOString()}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('통계 다운로드 실패:', error)
  }
}

// 작업 로그 가져오기
const fetchAdminLogs = async () => {
  try {
    const response = await fetch('/api/admin/activity-logs')
    const data = await response.json()
    adminLogs.value = data.logs
  } catch (error) {
    console.error('관리자 로그 데이터 로딩 실패:', error)
  }
}

// 작업 유형에 따른 스타일 클래스
const getActionClass = (action) => {
  const classes = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800',
    block: 'bg-red-100 text-red-800',
    unblock: 'bg-green-100 text-green-800',
    match: 'bg-purple-100 text-purple-800',
    activate: 'bg-green-100 text-green-800',
    deactivate: 'bg-red-100 text-red-800'
  }
  return classes[action] || 'bg-gray-100 text-gray-800'
}

// 작업 유형 텍스트
const getActionText = (action) => {
  const texts = {
    create: '등록',
    update: '수정',
    delete: '삭제',
    block: '차단',
    unblock: '차단해제',
    match: '매칭',
    activate: '활성화',
    deactivate: '비활성화'
  }
  return texts[action] || action
}

// 날짜/시간 포맷
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 기간 변경 시 데이터 다시 로드
watch(period, () => {
  Promise.all([
    fetchStats(),
    fetchAdminLogs()
  ])
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  Promise.all([
    fetchStats(),
    fetchAdminLogs()
  ])
})
</script> 