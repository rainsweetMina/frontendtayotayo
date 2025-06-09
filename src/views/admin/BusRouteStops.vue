<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">노선 정류장 추가</h1>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- 왼쪽: 노선 선택 및 현재 정류장 목록 -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-6">
          <label for="route" class="block text-sm font-medium text-gray-700">노선 선택</label>
          <select
            id="route"
            v-model="selectedRouteId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="handleRouteChange"
          >
            <option value="">노선을 선택하세요</option>
            <option v-for="route in routes" :key="route.id" :value="route.id">
              {{ route.routeNumber }} - {{ route.routeName }}
            </option>
          </select>
        </div>

        <template v-if="selectedRouteId">
          <h3 class="text-lg font-medium text-gray-900 mb-4">현재 정류장 목록</h3>
          <div class="space-y-2">
            <VueDraggableNext
              v-model="currentStops"
              item-key="id"
              handle=".handle"
              @end="handleStopOrderChange"
            >
              <template #item="{ element }">
                <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div class="handle flex-shrink-0 text-gray-400 cursor-move">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">{{ element.name }}</div>
                    <div class="text-sm text-gray-500">{{ element.address }}</div>
                  </div>
                  <button
                    @click="removeStop(element)"
                    class="flex-shrink-0 text-red-600 hover:text-red-800"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </template>
            </VueDraggableNext>
          </div>
        </template>
      </div>

      <!-- 오른쪽: 정류장 검색 및 추가 -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-6">
          <label for="searchKeyword" class="block text-sm font-medium text-gray-700">정류장 검색</label>
          <div class="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="searchKeyword"
              v-model="searchKeyword"
              class="flex-1 min-w-0 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="정류장 이름 또는 주소 입력"
              @keyup.enter="searchStops"
            />
            <button
              type="button"
              class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm"
              @click="searchStops"
            >
              검색
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div
            v-for="stop in searchResults"
            :key="stop.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <div class="font-medium text-gray-900">{{ stop.name }}</div>
              <div class="text-sm text-gray-500">{{ stop.address }}</div>
            </div>
            <button
              @click="addStop(stop)"
              class="flex-shrink-0 text-blue-600 hover:text-blue-800"
              :disabled="isStopAdded(stop)"
            >
              <svg
                class="h-5 w-5"
                :class="{ 'text-gray-400': isStopAdded(stop) }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 검색 결과 페이지네이션 -->
        <div v-if="searchResults.length > 0" class="mt-4 flex justify-center">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="handlePageChange(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              이전
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="handlePageChange(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
import { VueDraggableNext } from 'vue-draggable-next'

const routes = ref([])
const selectedRouteId = ref('')
const currentStops = ref([])
const searchKeyword = ref('')
const searchResults = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = 10

// 노선 목록 가져오기
const fetchRoutes = async () => {
  try {
    const response = await fetch('/api/admin/bus-routes')
    const data = await response.json()
    routes.value = data.routes
  } catch (error) {
    console.error('노선 데이터 로딩 실패:', error)
    alert('노선 데이터를 불러오는 중 오류가 발생했습니다.')
  }
}

// 노선 변경 시 해당 노선의 정류장 목록 가져오기
const handleRouteChange = async () => {
  if (!selectedRouteId.value) {
    currentStops.value = []
    return
  }

  try {
    const response = await fetch(`/api/admin/bus-routes/${selectedRouteId.value}/stops`)
    const data = await response.json()
    currentStops.value = data.stops
  } catch (error) {
    console.error('정류장 데이터 로딩 실패:', error)
    alert('정류장 데이터를 불러오는 중 오류가 발생했습니다.')
  }
}

// 정류장 검색
const searchStops = async (page = 1) => {
  if (!searchKeyword.value) return

  try {
    const params = new URLSearchParams({
      keyword: searchKeyword.value,
      page,
      limit: itemsPerPage
    })

    const response = await fetch(`/api/admin/bus-stops/search?${params}`)
    const data = await response.json()
    
    searchResults.value = data.stops
    totalPages.value = data.totalPages
    currentPage.value = page
  } catch (error) {
    console.error('정류장 검색 실패:', error)
    alert('정류장 검색 중 오류가 발생했습니다.')
  }
}

// 페이지 변경
const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return
  searchStops(page)
}

// 정류장이 이미 추가되어 있는지 확인
const isStopAdded = (stop) => {
  return currentStops.value.some(s => s.id === stop.id)
}

// 정류장 추가
const addStop = async (stop) => {
  if (isStopAdded(stop)) return

  try {
    const response = await fetch(`/api/admin/bus-routes/${selectedRouteId.value}/stops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stopId: stop.id,
        order: currentStops.value.length + 1
      })
    })

    if (response.ok) {
      currentStops.value.push(stop)
    } else {
      const error = await response.json()
      alert(`정류장 추가 실패: ${error.message}`)
    }
  } catch (error) {
    console.error('정류장 추가 실패:', error)
    alert('정류장 추가 중 오류가 발생했습니다.')
  }
}

// 정류장 제거
const removeStop = async (stop) => {
  if (!confirm('정말 이 정류장을 제거하시겠습니까?')) return

  try {
    const response = await fetch(`/api/admin/bus-routes/${selectedRouteId.value}/stops/${stop.id}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      currentStops.value = currentStops.value.filter(s => s.id !== stop.id)
    } else {
      const error = await response.json()
      alert(`정류장 제거 실패: ${error.message}`)
    }
  } catch (error) {
    console.error('정류장 제거 실패:', error)
    alert('정류장 제거 중 오류가 발생했습니다.')
  }
}

// 정류장 순서 변경
const handleStopOrderChange = async () => {
  try {
    const response = await fetch(`/api/admin/bus-routes/${selectedRouteId.value}/stops/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stops: currentStops.value.map((stop, index) => ({
          id: stop.id,
          order: index + 1
        }))
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('정류장 순서 변경 실패:', error)
    alert('정류장 순서 변경을 저장하는 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  fetchRoutes()
})
</script>

<style scoped>
.sortable-ghost {
  opacity: 0.5;
  background: #c8e6c9;
}

.sortable-drag {
  opacity: 0.9;
  background: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style> 