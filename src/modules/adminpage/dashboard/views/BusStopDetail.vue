<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        정류장 상세정보
      </h1>
      <div class="flex space-x-2">
        <button
          @click="handleEdit"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          수정
        </button>
        <button
          @click="confirmDelete"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          삭제
        </button>
        <button
          @click="$router.back()"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
      <strong class="font-bold">오류 발생!</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <div v-else-if="busStop" class="space-y-6">
      <!-- 기본 정보 카드 -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">정류장 상세정보</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700">ID:</span>
                <span class="block text-lg font-semibold">{{ busStop.bsId }}</span>
              </div>
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700">이름:</span>
                <span class="block text-lg font-semibold">{{ busStop.bsNm }}</span>
              </div>
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700">위도(Y):</span>
                <span class="block">{{ (busStop.yPos !== undefined && busStop.yPos !== null) ? busStop.yPos : (busStop.ypos !== undefined && busStop.ypos !== null ? busStop.ypos : '정보 없음') }}</span>
              </div>
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700">경도(X):</span>
                <span class="block">{{ (busStop.xPos !== undefined && busStop.xPos !== null) ? busStop.xPos : (busStop.xpos !== undefined && busStop.xpos !== null ? busStop.xpos : '정보 없음') }}</span>
              </div>
            </div>
            <div>
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700">시/도:</span>
                <span class="block">{{ busStop.city || '정보 없음' }}</span>
              </div>
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700">구/군:</span>
                <span class="block">{{ busStop.district || '정보 없음' }}</span>
              </div>
              <div class="mb-4">
                <span class="block text-sm font-medium text-gray-700">동:</span>
                <span class="block">{{ busStop.neighborhood || '정보 없음' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 도착 노선 정보 -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">도착 노선 정보</h2>
        </div>
        <div class="p-6">
          <div v-if="routes && routes.length > 0">
            <!-- 노선 표 형식 -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">노선 번호</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">방면 정보</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">노선 유형</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="route in routes" :key="route.routeId || route.routeNo" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold inline-block min-w-[60px] text-center">
                        {{ route.routeNo || route.routeId }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ route.routeNote || route.routeNm || '방면 정보 없음' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ route.routeTp || route.routeType || '노선 유형 없음' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center py-4 text-gray-500">
            이 정류장에 도착하는 노선 정보가 없습니다.
          </div>
        </div>
      </div>

      <!-- 지도 -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">위치 정보</h2>
        </div>
        <div class="p-6">
          <div ref="mapContainer" class="w-full h-96 rounded-lg"></div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white shadow rounded-lg p-6 text-center">
      <p class="text-gray-500">정류장 정보를 찾을 수 없습니다.</p>
    </div>
    
    <!-- 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">정류장 삭제</h3>
        <p class="mb-6">정류장 "{{ busStop?.bsNm }}" (ID: {{ busStop?.bsId }})을 삭제하시겠습니까?</p>
        <div class="flex justify-end space-x-2">
          <button 
            @click="showDeleteModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            취소
          </button>
          <button 
            @click="deleteBusStopData" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBusStopDetail, getRoutesForBusStop, deleteBusStop, updateBusStop } from '@/api/busStop'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const router = useRouter()
const route = useRoute()
const busStop = ref(null)
const routes = ref([])
const loading = ref(true)
const error = ref(null)
const mapContainer = ref(null)
const mapInitialized = ref(false)
const showDeleteModal = ref(false)
let map = null
let markers = []

// 정류장 상세 정보 조회
const fetchBusStopDetail = async () => {
  loading.value = true
  error.value = null
  mapInitialized.value = false

  try {
    const bsId = route.params.id
    if (!bsId) {
      throw new Error('정류장 ID가 없습니다.')
    }

    // 정류장 상세 정보 조회
    const busStopData = await getBusStopDetail(bsId)
    console.log('정류장 상세 정보 원본:', busStopData)
    console.log('좌표 정보:', {
      xPos: busStopData.xPos,
      yPos: busStopData.yPos,
      xpos: busStopData.xpos,
      ypos: busStopData.ypos,
      type_xPos: typeof busStopData.xPos,
      type_yPos: typeof busStopData.yPos,
      type_xpos: typeof busStopData.xpos,
      type_ypos: typeof busStopData.ypos
    })
    
    // 좌표 정보 처리 (대소문자 모두 확인)
    let xposValue = busStopData.xPos || busStopData.xpos
    let yposValue = busStopData.yPos || busStopData.ypos
    
    if (xposValue !== undefined && xposValue !== null) {
      if (typeof xposValue === 'string' && xposValue.trim() !== '') {
        xposValue = parseFloat(xposValue)
      }
      // 일관된 필드명으로 통일
      busStopData.xpos = xposValue
      busStopData.xPos = xposValue
    }
    
    if (yposValue !== undefined && yposValue !== null) {
      if (typeof yposValue === 'string' && yposValue.trim() !== '') {
        yposValue = parseFloat(yposValue)
      }
      // 일관된 필드명으로 통일
      busStopData.ypos = yposValue
      busStopData.yPos = yposValue
    }
    
    busStop.value = busStopData
    console.log('정류장 상세 정보 처리 후:', busStop.value)

    // 정류장에 오는 노선 정보 조회
    const routesData = await getRoutesForBusStop(bsId)
    console.log('노선 정보 원본 응답:', routesData)
    
    // 백엔드 응답 구조 확인 후 적절히 처리
    if (routesData && routesData.routes && Array.isArray(routesData.routes)) {
      // 백엔드가 { routes: [...] } 형태로 응답하는 경우
      routes.value = routesData.routes
    } else if (Array.isArray(routesData)) {
      // 백엔드가 직접 배열로 응답하는 경우
      routes.value = routesData
    } else {
      // 기타 경우 빈 배열로 설정
      routes.value = []
    }
    
    console.log('처리된 노선 정보:', routes.value)
    
    // 데이터 로드 후 지도 초기화를 위해 플래그 설정
    loading.value = false
    
    // 데이터 로드 후 지도 초기화 시도
    nextTick(() => {
      console.log('데이터 로드 후 nextTick - 지도 초기화 시도')
      initLeafletMap()
    })
  } catch (err) {
    console.error('정류장 상세 정보 조회 실패:', err)
    error.value = '정류장 정보를 불러오는데 실패했습니다.'
    loading.value = false
  }
}

// 정류장 수정 페이지로 이동
const handleEdit = () => {
  if (busStop.value && busStop.value.bsId) {
    router.push(`/admin/bus-stops/${busStop.value.bsId}/edit`)
  }
}

// 정류장 삭제 확인 모달 표시
const confirmDelete = () => {
  showDeleteModal.value = true
}

// 정류장 삭제 처리
const deleteBusStopData = async () => {
  if (!busStop.value || !busStop.value.bsId) return
  
  try {
    loading.value = true
    await deleteBusStop(busStop.value.bsId)
    router.push('/admin/bus-stops')
  } catch (err) {
    console.error('정류장 삭제 실패:', err)
    error.value = '정류장 삭제 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
    showDeleteModal.value = false
  }
}

// Leaflet 지도 초기화
const initLeafletMap = () => {
  console.log('initLeafletMap 호출됨')
  
  // 좌표 정보 확인 (대소문자 모두 확인)
  const xpos = busStop.value.xPos !== undefined ? busStop.value.xPos : busStop.value.xpos
  const ypos = busStop.value.yPos !== undefined ? busStop.value.yPos : busStop.value.ypos
  
  console.log('지도 초기화에 사용할 좌표:', { xpos, ypos })
  
  if (!busStop.value || !xpos || !ypos) {
    console.error('정류장 좌표 정보가 없음')
    return
  }
  
  // mapContainer ref 확인
  if (!mapContainer.value) {
    console.error('Map container not found')
    
    // 100ms 후 다시 시도
    setTimeout(() => {
      console.log('지도 초기화 재시도...')
      initLeafletMap()
    }, 100)
    return
  }
  
  console.log('mapContainer 찾음:', mapContainer.value)
  
  try {
    // 이미 지도가 초기화되었다면 제거
    if (map) {
      console.log('기존 지도 제거')
      map.remove()
    }
    
    console.log('새 지도 생성 중...')
    
    // 지도 요소에 ID 부여 (Leaflet이 ID로 요소를 찾는 경우가 있음)
    const mapId = 'leaflet-map-' + Date.now();
    mapContainer.value.id = mapId;
    
    // 지도 초기화
    map = L.map(mapId, {
      center: [ypos, xpos],
      zoom: 18,  // 확대 수준 높임 (16에서 18로)
      zoomControl: true,
      scrollWheelZoom: true
    })

    // 타일 레이어 설정
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // 정류장 마커 추가
    const marker = L.marker([ypos, xpos], {
      icon: L.icon({
        iconUrl: 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="%230078FF" stroke="%23FFFFFF" stroke-width="1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      })
    }).addTo(map)
    
    // 팝업 추가
    marker.bindPopup(`
      <div class="popup-content">
        <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">${busStop.value.bsNm}</h3>
        <p style="margin: 0;">ID: ${busStop.value.bsId}</p>
      </div>
    `).openPopup()
    
    // 마커 배열에 추가
    markers.push(marker)

    // 지도 크기 업데이트
    setTimeout(() => {
      console.log('지도 크기 업데이트')
      map.invalidateSize()
    }, 200)
    
    mapInitialized.value = true
    console.log('지도 초기화 완료')
  } catch (err) {
    console.error('지도 초기화 오류:', err)
  }
}

// 컴포넌트가 마운트된 후 실행
onMounted(() => {
  console.log('컴포넌트 마운트됨')
  fetchBusStopDetail()
})

// 컴포넌트가 언마운트되기 전에 지도 정리
onBeforeUnmount(() => {
  if (map) {
    console.log('컴포넌트 언마운트 - 지도 정리')
    map.remove()
    map = null
    markers = []
  }
})

// 라우트 파라미터가 변경될 때마다 정보 다시 조회
watch(() => route.params.id, (newId) => {
  if (newId) {
    console.log('라우트 파라미터 변경:', newId)
    fetchBusStopDetail()
  }
})

// 로딩 상태가 변경될 때 지도 초기화 시도
watch(() => loading.value, (isLoading) => {
  if (!isLoading && busStop.value && !mapInitialized.value) {
    console.log('로딩 완료 - 지도 초기화 시도')
    nextTick(() => {
      initLeafletMap()
    })
  }
})
</script>

<style scoped>
.custom-emoji-icon {
  font-size: 28px;
  line-height: 1;
  text-align: center;
}

.custom-bus-stop-icon {
  background-color: transparent;
}

.bus-stop-marker {
  font-size: 50px;
  line-height: 1;
  text-align: center;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

.popup-content {
  text-align: center;
  padding: 5px;
}
</style>

<style>
/* 전역 스타일 - Leaflet 팝업 스타일 오버라이드 */
.leaflet-popup-content {
  margin: 10px !important;
  min-width: 150px;
}

.leaflet-popup-content-wrapper {
  border-radius: 8px !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2) !important;
}
</style> 