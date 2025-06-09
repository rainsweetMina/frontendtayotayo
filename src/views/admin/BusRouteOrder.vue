<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">노선 순서 수정</h1>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <div class="mb-4">
        <p class="text-sm text-gray-500">
          노선의 순서를 변경하려면 드래그 앤 드롭으로 항목을 이동하세요.
          변경된 순서는 자동으로 저장됩니다.
        </p>
      </div>

      <!-- 노선 목록 -->
      <div class="space-y-2">
        <draggable
          v-model="routes"
          item-key="id"
          handle=".handle"
          @end="handleOrderChange"
        >
          <template #item="{ element }">
            <div
              class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
            >
              <div class="handle flex-shrink-0 text-gray-400">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center">
                  <span class="font-medium text-gray-900">{{ element.routeNumber }}</span>
                  <span class="ml-2 text-gray-500">{{ element.routeName }}</span>
                </div>
                <div class="mt-1 text-sm text-gray-500">
                  {{ element.company }} | {{ element.routeType }}
                </div>
              </div>
              <div class="flex-shrink-0">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    element.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ element.status === 'active' ? '운행중' : '운행중지' }}
                </span>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <!-- 저장 중 표시 -->
      <div
        v-if="isSaving"
        class="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg"
      >
        저장 중...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const routes = ref([])
const isSaving = ref(false)

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

// 순서 변경 처리
const handleOrderChange = async () => {
  isSaving.value = true

  try {
    const response = await fetch('/api/admin/bus-routes/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        routes: routes.value.map((route, index) => ({
          id: route.id,
          order: index + 1
        }))
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('순서 변경 실패:', error)
    alert('순서 변경을 저장하는 중 오류가 발생했습니다.')
  } finally {
    isSaving.value = false
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