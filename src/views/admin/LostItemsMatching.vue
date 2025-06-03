<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">분실/습득 매칭 처리</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 신고된 분실물 목록 -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 mb-4">신고된 분실물</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center">
              <input
                type="text"
                v-model="reportedSearch"
                placeholder="물품명 검색..."
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
          <ul class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            <li
              v-for="item in filteredReportedItems"
              :key="item.id"
              :class="[
                'p-4 hover:bg-gray-50 cursor-pointer',
                selectedReported?.id === item.id ? 'bg-blue-50' : ''
              ]"
              @click="selectReported(item)"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ item.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatDateTime(item.reportedAt) }} | {{ item.routeNumber }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 등록된 분실물 목록 -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 mb-4">등록된 분실물</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center">
              <input
                type="text"
                v-model="registeredSearch"
                placeholder="물품명 검색..."
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
          <ul class="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            <li
              v-for="item in filteredRegisteredItems"
              :key="item.id"
              :class="[
                'p-4 hover:bg-gray-50 cursor-pointer',
                selectedRegistered?.id === item.id ? 'bg-blue-50' : ''
              ]"
              @click="selectRegistered(item)"
            >
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ item.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatDateTime(item.registeredAt) }} | {{ item.storageLocation }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 매칭 처리 버튼 -->
    <div class="mt-6 flex justify-center">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!selectedReported || !selectedRegistered"
        @click="matchItems"
      >
        매칭 처리
      </button>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 상태 데이터
const reportedItems = ref([])
const registeredItems = ref([])
const reportedSearch = ref('')
const registeredSearch = ref('')
const selectedReported = ref(null)
const selectedRegistered = ref(null)

// 관리자 로그 데이터
const adminLogs = ref([])

// 필터링된 목록
const filteredReportedItems = computed(() => {
  return reportedItems.value.filter(item =>
    item.name.toLowerCase().includes(reportedSearch.value.toLowerCase())
  )
})

const filteredRegisteredItems = computed(() => {
  return registeredItems.value.filter(item =>
    item.name.toLowerCase().includes(registeredSearch.value.toLowerCase())
  )
})

// 데이터 가져오기
const fetchItems = async () => {
  try {
    const [reportedRes, registeredRes] = await Promise.all([
      fetch('/api/admin/lost-items/reported?status=pending'),
      fetch('/api/admin/lost-items/registered?status=stored')
    ])
    
    const [reportedData, registeredData] = await Promise.all([
      reportedRes.json(),
      registeredRes.json()
    ])

    reportedItems.value = reportedData.lostItems
    registeredItems.value = registeredData.lostItems
  } catch (error) {
    console.error('분실물 데이터 로딩 실패:', error)
  }
}

// 작업 로그 가져오기
const fetchAdminLogs = async () => {
  try {
    const response = await fetch('/api/admin/activity-logs?type=lost-items')
    const data = await response.json()
    adminLogs.value = data.logs
  } catch (error) {
    console.error('관리자 로그 데이터 로딩 실패:', error)
  }
}

// 선택 처리
const selectReported = (item) => {
  selectedReported.value = item
}

const selectRegistered = (item) => {
  selectedRegistered.value = item
}

// 작업 유형에 따른 스타일 클래스
const getActionClass = (action) => {
  const classes = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800',
    match: 'bg-purple-100 text-purple-800'
  }
  return classes[action] || 'bg-gray-100 text-gray-800'
}

// 작업 유형 텍스트
const getActionText = (action) => {
  const texts = {
    create: '등록',
    update: '수정',
    delete: '삭제',
    match: '매칭'
  }
  return texts[action] || action
}

// 매칭 처리
const matchItems = async () => {
  if (!selectedReported.value || !selectedRegistered.value) return
  if (!confirm('선택한 분실물을 매칭 처리하시겠습니까?')) return

  try {
    await fetch('/api/admin/lost-items/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reportedId: selectedReported.value.id,
        registeredId: selectedRegistered.value.id
      })
    })

    // 선택 초기화 및 데이터 새로고침
    selectedReported.value = null
    selectedRegistered.value = null
    await Promise.all([
      fetchItems(),
      fetchAdminLogs()
    ])
  } catch (error) {
    console.error('매칭 처리 실패:', error)
  }
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

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  Promise.all([
    fetchItems(),
    fetchAdminLogs()
  ])
})
</script> 