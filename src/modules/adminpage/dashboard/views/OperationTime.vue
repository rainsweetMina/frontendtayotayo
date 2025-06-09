<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">운행 시간 관리</h1>
    </div>

    <!-- 노선 선택 -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label for="route" class="block text-sm font-medium text-gray-700">노선 선택</label>
          <select
            id="route"
            v-model="selectedRouteId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="loadSchedule"
          >
            <option value="">노선을 선택하세요</option>
            <option v-for="route in routes" :key="route.id" :value="route.id">
              {{ route.routeNumber }} - {{ route.routeName }}
            </option>
          </select>
        </div>
        <div>
          <label for="day" class="block text-sm font-medium text-gray-700">요일 선택</label>
          <select
            id="day"
            v-model="selectedDay"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="loadSchedule"
          >
            <option value="weekday">평일</option>
            <option value="saturday">토요일</option>
            <option value="sunday">일요일</option>
            <option value="holiday">공휴일</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="selectedRouteId" class="space-y-6">
      <!-- 기본 운행 정보 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">기본 운행 정보</h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label for="firstBus" class="block text-sm font-medium text-gray-700">첫차 시간</label>
            <input
              type="time"
              id="firstBus"
              v-model="schedule.firstBus"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="lastBus" class="block text-sm font-medium text-gray-700">막차 시간</label>
            <input
              type="time"
              id="lastBus"
              v-model="schedule.lastBus"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="baseInterval" class="block text-sm font-medium text-gray-700">기본 배차 간격 (분)</label>
            <input
              type="number"
              id="baseInterval"
              v-model="schedule.baseInterval"
              min="1"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- 시간대별 배차 간격 -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">시간대별 배차 간격</h2>
          <button
            type="button"
            @click="addTimeSlot"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            시간대 추가
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="(slot, index) in schedule.timeSlots"
            :key="index"
            class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label :for="'startTime-' + index" class="block text-sm font-medium text-gray-700">시작 시간</label>
                <input
                  type="time"
                  :id="'startTime-' + index"
                  v-model="slot.startTime"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label :for="'endTime-' + index" class="block text-sm font-medium text-gray-700">종료 시간</label>
                <input
                  type="time"
                  :id="'endTime-' + index"
                  v-model="slot.endTime"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label :for="'interval-' + index" class="block text-sm font-medium text-gray-700">배차 간격 (분)</label>
                <input
                  type="number"
                  :id="'interval-' + index"
                  v-model="slot.interval"
                  min="1"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="button"
              @click="removeTimeSlot(index)"
              class="flex-shrink-0 text-red-600 hover:text-red-800"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 특이사항 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">특이사항</h2>
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">비고</label>
          <textarea
            id="notes"
            v-model="schedule.notes"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="운행 시간 관련 특이사항을 입력하세요."
          ></textarea>
        </div>
      </div>

      <!-- 저장 버튼 -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="resetForm"
        >
          초기화
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="saveSchedule"
        >
          저장
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const routes = ref([])
const selectedRouteId = ref('')
const selectedDay = ref('weekday')

const schedule = ref({
  firstBus: '',
  lastBus: '',
  baseInterval: '',
  timeSlots: [],
  notes: ''
})

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

// 운행 스케줄 불러오기
const loadSchedule = async () => {
  if (!selectedRouteId.value || !selectedDay.value) return

  try {
    const response = await fetch(`/api/admin/operation-times/${selectedRouteId.value}/${selectedDay.value}`)
    const data = await response.json()
    schedule.value = {
      firstBus: data.firstBus,
      lastBus: data.lastBus,
      baseInterval: data.baseInterval,
      timeSlots: data.timeSlots || [],
      notes: data.notes
    }
  } catch (error) {
    console.error('스케줄 로딩 실패:', error)
    alert('운행 스케줄을 불러오는 중 오류가 발생했습니다.')
  }
}

// 시간대 추가
const addTimeSlot = () => {
  schedule.value.timeSlots.push({
    startTime: '',
    endTime: '',
    interval: ''
  })
}

// 시간대 제거
const removeTimeSlot = (index) => {
  schedule.value.timeSlots.splice(index, 1)
}

// 폼 초기화
const resetForm = () => {
  schedule.value = {
    firstBus: '',
    lastBus: '',
    baseInterval: '',
    timeSlots: [],
    notes: ''
  }
}

// 스케줄 저장
const saveSchedule = async () => {
  try {
    const response = await fetch(`/api/admin/operation-times/${selectedRouteId.value}/${selectedDay.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schedule.value)
    })

    if (response.ok) {
      alert('운행 스케줄이 성공적으로 저장되었습니다.')
    } else {
      const error = await response.json()
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('스케줄 저장 실패:', error)
    alert('운행 스케줄 저장 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  fetchRoutes()
})
</script> 