<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">길찾기 설정</h1>
    </div>

    <div class="space-y-6">
      <!-- 알고리즘 설정 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">알고리즘 설정</h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="algorithm" class="block text-sm font-medium text-gray-700">경로 탐색 알고리즘</label>
            <select
              id="algorithm"
              v-model="settings.algorithm"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="shortest">최단 거리 우선</option>
              <option value="fastest">최소 시간 우선</option>
              <option value="minimum_transfer">최소 환승 우선</option>
              <option value="balanced">종합 최적화</option>
            </select>
          </div>
          <div>
            <label for="maxTransfers" class="block text-sm font-medium text-gray-700">최대 환승 횟수</label>
            <input
              type="number"
              id="maxTransfers"
              v-model="settings.maxTransfers"
              min="0"
              max="5"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- 가중치 설정 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">가중치 설정</h2>
        <div class="space-y-6">
          <div>
            <label for="walkingWeight" class="block text-sm font-medium text-gray-700">
              도보 이동 가중치
              <span class="text-sm text-gray-500">(현재: {{ settings.weights.walking }})</span>
            </label>
            <input
              type="range"
              id="walkingWeight"
              v-model="settings.weights.walking"
              min="0"
              max="100"
              step="5"
              class="mt-2 w-full"
            />
          </div>
          <div>
            <label for="transferWeight" class="block text-sm font-medium text-gray-700">
              환승 가중치
              <span class="text-sm text-gray-500">(현재: {{ settings.weights.transfer }})</span>
            </label>
            <input
              type="range"
              id="transferWeight"
              v-model="settings.weights.transfer"
              min="0"
              max="100"
              step="5"
              class="mt-2 w-full"
            />
          </div>
          <div>
            <label for="waitingWeight" class="block text-sm font-medium text-gray-700">
              대기 시간 가중치
              <span class="text-sm text-gray-500">(현재: {{ settings.weights.waiting }})</span>
            </label>
            <input
              type="range"
              id="waitingWeight"
              v-model="settings.weights.waiting"
              min="0"
              max="100"
              step="5"
              class="mt-2 w-full"
            />
          </div>
        </div>
      </div>

      <!-- 도보 설정 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">도보 설정</h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="maxWalkingDistance" class="block text-sm font-medium text-gray-700">최대 도보 거리 (m)</label>
            <input
              type="number"
              id="maxWalkingDistance"
              v-model="settings.walking.maxDistance"
              min="100"
              max="2000"
              step="100"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="walkingSpeed" class="block text-sm font-medium text-gray-700">평균 도보 속도 (m/분)</label>
            <input
              type="number"
              id="walkingSpeed"
              v-model="settings.walking.speed"
              min="50"
              max="100"
              step="5"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- 환승 설정 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">환승 설정</h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="transferTime" class="block text-sm font-medium text-gray-700">기본 환승 소요 시간 (분)</label>
            <input
              type="number"
              id="transferTime"
              v-model="settings.transfer.defaultTime"
              min="1"
              max="15"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="transferBuffer" class="block text-sm font-medium text-gray-700">환승 여유 시간 (분)</label>
            <input
              type="number"
              id="transferBuffer"
              v-model="settings.transfer.bufferTime"
              min="0"
              max="10"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- 경로 표시 설정 -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">경로 표시 설정</h2>
        <div class="space-y-4">
          <div>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="settings.display.showAlternativeRoutes"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">대체 경로 표시</span>
            </label>
          </div>
          <div>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="settings.display.showRealtime"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">실시간 도착 정보 표시</span>
            </label>
          </div>
          <div>
            <label for="maxAlternatives" class="block text-sm font-medium text-gray-700">최대 대체 경로 수</label>
            <input
              type="number"
              id="maxAlternatives"
              v-model="settings.display.maxAlternatives"
              min="1"
              max="5"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- 저장 버튼 -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="resetSettings"
        >
          초기화
        </button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="saveSettings"
        >
          저장
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const settings = ref({
  algorithm: 'balanced',
  maxTransfers: 2,
  weights: {
    walking: 30,
    transfer: 50,
    waiting: 20
  },
  walking: {
    maxDistance: 800,
    speed: 70
  },
  transfer: {
    defaultTime: 5,
    bufferTime: 3
  },
  display: {
    showAlternativeRoutes: true,
    showRealtime: true,
    maxAlternatives: 3
  }
})

// 설정 불러오기
const loadSettings = async () => {
  try {
    const response = await fetch('/api/admin/route-finder/settings')
    const data = await response.json()
    settings.value = { ...settings.value, ...data }
  } catch (error) {
    console.error('설정 로딩 실패:', error)
    alert('설정을 불러오는 중 오류가 발생했습니다.')
  }
}

// 설정 저장
const saveSettings = async () => {
  try {
    const response = await fetch('/api/admin/route-finder/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings.value)
    })

    if (response.ok) {
      alert('설정이 성공적으로 저장되었습니다.')
    } else {
      const error = await response.json()
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('설정 저장 실패:', error)
    alert('설정 저장 중 오류가 발생했습니다.')
  }
}

// 설정 초기화
const resetSettings = () => {
  if (!confirm('모든 설정을 기본값으로 초기화하시겠습니까?')) return

  settings.value = {
    algorithm: 'balanced',
    maxTransfers: 2,
    weights: {
      walking: 30,
      transfer: 50,
      waiting: 20
    },
    walking: {
      maxDistance: 800,
      speed: 70
    },
    transfer: {
      defaultTime: 5,
      bufferTime: 3
    },
    display: {
      showAlternativeRoutes: true,
      showRealtime: true,
      maxAlternatives: 3
    }
  }
}

onMounted(() => {
  loadSettings()
})
</script> 