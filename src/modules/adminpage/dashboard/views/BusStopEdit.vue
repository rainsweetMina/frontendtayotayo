<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        정류장 정보 수정
      </h1>
      <button
        @click="$router.back()"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        뒤로 가기
      </button>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
      <strong class="font-bold">오류 발생!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">정류장 정보 수정</h2>
      </div>
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 정류장 ID -->
            <div>
              <label for="bsId" class="block text-sm font-medium text-gray-700">정류장 ID</label>
              <input
                type="text"
                id="bsId"
                v-model="formData.bsId"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled
              />
              <p class="mt-1 text-xs text-gray-500">정류장 ID는 수정할 수 없습니다.</p>
            </div>

            <!-- 정류장 이름 -->
            <div>
              <label for="bsNm" class="block text-sm font-medium text-gray-700">정류장 이름</label>
              <input
                type="text"
                id="bsNm"
                v-model="formData.bsNm"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <!-- 위도(Y) -->
            <div>
              <label for="ypos" class="block text-sm font-medium text-gray-700">위도(Y)</label>
              <input
                type="number"
                id="ypos"
                v-model="formData.ypos"
                step="0.000001"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- 경도(X) -->
            <div>
              <label for="xpos" class="block text-sm font-medium text-gray-700">경도(X)</label>
              <input
                type="number"
                id="xpos"
                v-model="formData.xpos"
                step="0.000001"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- 시/도 -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">시/도</label>
              <input
                type="text"
                id="city"
                v-model="formData.city"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- 구/군 -->
            <div>
              <label for="district" class="block text-sm font-medium text-gray-700">구/군</label>
              <input
                type="text"
                id="district"
                v-model="formData.district"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- 동 -->
            <div>
              <label for="neighborhood" class="block text-sm font-medium text-gray-700">동</label>
              <input
                type="text"
                id="neighborhood"
                v-model="formData.neighborhood"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- 지도 -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">위치 정보</label>
            <div ref="mapContainer" class="w-full h-96 rounded-lg border border-gray-300"></div>
            <p class="mt-1 text-xs text-gray-500">지도에서 마커를 드래그하여 위치를 조정할 수 있습니다.</p>
          </div>

          <!-- 버튼 그룹 -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$router.back()"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              취소
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="submitting"
            >
              {{ submitting ? '저장 중...' : '저장' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBusStopDetail, updateBusStop } from '@/api/busStop'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const error = ref(null)
const submitting = ref(false)
const mapContainer = ref(null)
let map = null
let marker = null

// 폼 데이터
const formData = reactive({
  bsId: '',
  bsNm: '',
  xpos: '',
  ypos: '',
  city: '',
  district: '',
  neighborhood: ''
})

// 정류장 상세 정보 조회
const fetchBusStopDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const bsId = route.params.id
    if (!bsId) {
      throw new Error('정류장 ID가 없습니다.')
    }

    // 정류장 상세 정보 조회
    const busStopData = await getBusStopDetail(bsId)
    console.log('정류장 상세 정보:', busStopData)
    
    // 좌표 정보 처리 (대소문자 모두 확인)
    const xpos = busStopData.xPos !== undefined ? busStopData.xPos : busStopData.xpos
    const ypos = busStopData.yPos !== undefined ? busStopData.yPos : busStopData.ypos
    
    // 폼 데이터 설정
    formData.bsId = busStopData.bsId || ''
    formData.bsNm = busStopData.bsNm || ''
    formData.xpos = xpos || ''
    formData.ypos = ypos || ''
    formData.city = busStopData.city || busStopData.sido || ''
    formData.district = busStopData.district || busStopData.gugun || ''
    formData.neighborhood = busStopData.neighborhood || busStopData.dong || ''
    
    loading.value = false
    
    // 지도 초기화
    nextTick(() => {
      initMap()
    })
  } catch (err) {
    console.error('정류장 상세 정보 조회 실패:', err)
    error.value = '정류장 정보를 불러오는데 실패했습니다.'
    loading.value = false
  }
}

// 지도 초기화
const initMap = () => {
  if (!mapContainer.value) return
  
  // 기본 좌표 (정보가 없는 경우 대한민국 중심 좌표)
  const lat = formData.ypos || 36.5
  const lng = formData.xpos || 127.5
  const zoom = formData.ypos && formData.xpos ? 16 : 7
  
  // 지도 생성
  map = L.map(mapContainer.value).setView([lat, lng], zoom)
  
  // 타일 레이어 추가
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  
  // 마커 생성
  marker = L.marker([lat, lng], {
    draggable: true  // 드래그 가능하도록 설정
  }).addTo(map)
  
  // 마커 드래그 이벤트 처리
  marker.on('dragend', function(event) {
    const position = marker.getLatLng()
    formData.ypos = position.lat
    formData.xpos = position.lng
  })
  
  // 지도 크기 업데이트
  setTimeout(() => {
    map.invalidateSize()
  }, 200)
}

// 폼 제출 처리
const handleSubmit = async () => {
  submitting.value = true
  error.value = null
  
  try {
    // 필수 필드 검증
    if (!formData.bsId || !formData.bsNm) {
      throw new Error('정류장 ID와 이름은 필수 항목입니다.')
    }
    
    // 요청 데이터 준비
    const requestData = {
      bsId: formData.bsId,
      bsNm: formData.bsNm,
      xpos: formData.xpos,
      ypos: formData.ypos,
      city: formData.city,
      district: formData.district,
      neighborhood: formData.neighborhood
    }
    
    // 백엔드 API 호출 (대소문자 일치를 위해 추가 필드 설정)
    requestData.xPos = formData.xpos
    requestData.yPos = formData.ypos
    requestData.sido = formData.city
    requestData.gugun = formData.district
    requestData.dong = formData.neighborhood
    
    console.log('정류장 수정 요청 데이터:', requestData)
    
    // 정류장 정보 업데이트
    await updateBusStop(formData.bsId, requestData)
    
    alert('정류장 정보가 성공적으로 수정되었습니다.')
    router.push(`/admin/bus-stops/${formData.bsId}`)
  } catch (err) {
    console.error('정류장 수정 실패:', err)
    error.value = err.message || '정류장 정보 수정 중 오류가 발생했습니다.'
  } finally {
    submitting.value = false
  }
}

// 컴포넌트 마운트 시 정류장 정보 조회
onMounted(() => {
  fetchBusStopDetail()
})

// 컴포넌트 언마운트 시 지도 정리
onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
    marker = null
  }
})
</script>

<style scoped>
/* Leaflet 스타일 오버라이드 */
:deep(.leaflet-control-attribution) {
  font-size: 10px;
}

:deep(.leaflet-control-zoom) {
  border: none;
  box-shadow: 0 1px 5px rgba(0,0,0,0.2);
}
</style> 