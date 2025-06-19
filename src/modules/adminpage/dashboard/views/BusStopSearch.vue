<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">정류장 검색</h1>
    </div>

    <!-- 검색 필터 - 상단에 배치 -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-end gap-4">
        <div class="flex-grow">
          <!-- <label for="keyword" class="block text-sm font-medium text-gray-700 mb-1">검색창 위 텍스트</label> -->
          <div class="relative rounded-md shadow-sm">
            <input
              type="text"
              id="keyword"
              v-model="keyword"
              class="block w-full rounded-md border-gray-300 pr-10 focus:border-blue-500 focus:ring-blue-500 h-10"
              placeholder="정류장 이름 또는 ID 입력"
              @keyup.enter="handleSearch"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="md:w-24">
          <button
            @click="handleSearch"
            class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 h-10"
          >
            검색
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 검색 결과 목록 - 왼쪽 -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow rounded-lg overflow-hidden h-[650px] flex flex-col">
          <div class="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 class="text-lg font-medium text-gray-900">검색 결과</h2>
              <p class="text-sm text-gray-500">총 {{ totalItems }}개의 정류장</p>
            </div>
            <div class="text-sm text-blue-600" v-if="busStops.length > 0">
              {{ currentPage }} / {{ totalPages }} 페이지
            </div>
          </div>
          <ul class="divide-y divide-gray-200 overflow-y-auto flex-grow" id="resultList">
            <li
              v-for="stop in displayedBusStops"
              :key="stop.bsId"
              class="p-4 hover:bg-gray-50 cursor-pointer"
              @click="fetchBusStopDetail(stop.bsId)"
              :class="{ 'bg-blue-50': selectedStop?.bsId === stop.bsId }"
            >
              <div class="flex justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ stop.bsNm }}</p>
                  <p class="text-sm text-gray-500">{{ stop.bsId }}</p>
                </div>
              </div>
              <p class="mt-1 text-sm text-gray-500">{{ getStopAddress(stop) }}</p>
            </li>
            <li v-if="busStops.length === 0" class="p-4 text-center text-gray-500">
              검색 결과가 없습니다
            </li>
          </ul>

          <!-- 페이지네이션 -->
          <div class="bg-white px-4 py-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex-1 flex justify-center">
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <!-- 이전 페이지 -->
                  <button
                    @click="handlePageChange(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                  >
                    <span class="sr-only">이전</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <!-- 처음 페이지로 -->
                  <button
                    v-if="currentPage > 3 && totalPages > 5"
                    @click="handlePageChange(1)"
                    class="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    1
                  </button>
                  
                  <!-- 생략 표시 -->
                  <span
                    v-if="currentPage > 3 && totalPages > 5"
                    class="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                  
                  <!-- 페이지 버튼 -->
                  <button
                    v-for="page in displayedPageNumbers"
                    :key="page"
                    @click="handlePageChange(page)"
                    :class="[
                      'relative inline-flex items-center px-3 py-2 border text-sm font-medium',
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  
                  <!-- 생략 표시 -->
                  <span
                    v-if="currentPage < totalPages - 2 && totalPages > 5"
                    class="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                  
                  <!-- 마지막 페이지로 -->
                  <button
                    v-if="currentPage < totalPages - 2 && totalPages > 5"
                    @click="handlePageChange(totalPages)"
                    class="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {{ totalPages }}
                  </button>
                  
                  <!-- 다음 페이지 -->
                  <button
                    @click="handlePageChange(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                  >
                    <span class="sr-only">다음</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 지도 - 오른쪽 -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg p-6 h-[650px]">
          <div ref="mapContainer" id="map" class="w-full h-full rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- 상세 정보 - 하단에 배치 -->
    <div v-if="selectedStop" class="mt-6 bg-white shadow rounded-lg overflow-hidden">
      <!-- 헤더 -->
      <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800 flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-white">📍 {{ selectedStop.bsNm }}</h3>
          <p class="text-sm text-blue-100">{{ selectedStop.bsId }}</p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="updateBusStop"
            class="px-3 py-1 text-sm font-medium text-blue-800 bg-white rounded-md shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ✏️ 수정
          </button>
          <button
            @click="deleteBusStop"
            class="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            🗑️ 삭제
          </button>
        </div>
      </div>
      
      <!-- 탭 메뉴 -->
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            v-for="(tab, index) in tabs"
            :key="index"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-6 text-sm font-medium border-b-2 focus:outline-none transition-all duration-200',
              activeTab === tab.id
                ? 'tab-active'
                : 'tab-inactive'
            ]"
          >
            <span class="flex items-center">
              <span v-html="tab.icon" class="mr-2"></span>
              {{ tab.name }}
            </span>
          </button>
        </nav>
      </div>

      <!-- 탭 내용 -->
      <div class="p-6">
        <!-- 기본 정보 탭 -->
        <div v-if="activeTab === 'info'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-4">정류장 정보</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">정류장 ID</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedStop.bsId }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">정류장 이름</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedStop.bsNm }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">정류장 유형</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedStop.type || selectedStop.stopType || '일반' }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">관리 기관</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedStop.adminNm || '정보 없음' }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">주소</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ getStopAddress(selectedStop) }}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-4">위치 정보</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">위도</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedStop.yPos || selectedStop.ypos }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">경도</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedStop.xPos || selectedStop.xpos }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">설명</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedStop.description || '정보 없음' }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <!-- 노선 정보 탭 -->
        <div v-if="activeTab === 'routes'" class="space-y-4">
          <div v-if="selectedStop.routes && selectedStop.routes.length > 0">
            <ul class="divide-y divide-gray-200">
              <li v-for="route in selectedStop.routes" :key="route.routeId" class="py-4 flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" :class="getBusTypeClass(route.type)">
                  <span class="font-bold text-white">{{ route.routeNo }}</span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">{{ route.routeName }}</p>
                  <p class="text-xs text-gray-500">{{ getBusTypeText(route.type) }} | {{ route.startStop }} → {{ route.endStop }}</p>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500">노선 정보가 없습니다</p>
          </div>
        </div>

        <!-- 시설물 탭 -->
        <div v-if="activeTab === 'facilities'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex items-center space-x-3 p-3 rounded-lg" :class="{ 'bg-blue-50': hasFacility('shelter') }">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">승객 대기 쉘터</p>
                <p class="text-xs text-gray-500">{{ hasFacility('shelter') ? '설치됨' : '미설치' }}</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3 p-3 rounded-lg" :class="{ 'bg-green-50': hasFacility('bench') }">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">벤치</p>
                <p class="text-xs text-gray-500">{{ hasFacility('bench') ? '설치됨' : '미설치' }}</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3 p-3 rounded-lg" :class="{ 'bg-purple-50': hasFacility('lcd') }">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">도착 정보 안내 단말기</p>
                <p class="text-xs text-gray-500">{{ hasFacility('lcd') ? '설치됨' : '미설치' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed } from 'vue'
import { searchBusStops as searchBusStopsApi, getAllBusStops, getBusStopDetail, deleteBusStop as deleteBusStopApi } from '@/api/busStop'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// 상태 변수
const mapContainer = ref(null)
let map = null
const markers = ref([])
const activeTab = ref('info')

// 탭 정의
const tabs = [
  { 
    id: 'info', 
    name: '기본 정보', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>'
  },
  { 
    id: 'routes', 
    name: '노선 정보', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" /><path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>'
  },
  { 
    id: 'facilities', 
    name: '시설물', 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>'
  }
]

// 검색 관련 변수
const keyword = ref('')
const facilities = ref({})

// 결과 관련 변수
const busStops = ref([])
const selectedStop = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10
const defaultCenter = [35.8714, 128.6014] // 대구 중심 좌표

// 현재 페이지에 표시할 정류장 목록 계산
const displayedBusStops = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return busStops.value.slice(start, end)
})

// 페이지네이션 - 표시할 페이지 번호 계산
const displayedPageNumbers = computed(() => {
  const result = []
  
  if (totalPages.value <= 5) {
    // 전체 페이지가 5개 이하면 모든 페이지 번호 표시
    for (let i = 1; i <= totalPages.value; i++) {
      result.push(i)
    }
  } else {
    // 전체 페이지가 5개 초과면 현재 페이지 주변 페이지만 표시
    const startPage = Math.max(1, Math.min(currentPage.value - 1, totalPages.value - 4))
    const endPage = Math.min(totalPages.value, startPage + 2)
    
    for (let i = startPage; i <= endPage; i++) {
      result.push(i)
    }
  }
  
  return result
})

// 페이지네이션 계산
const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 5
  
  let start = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2))
  let end = Math.min(totalPages.value, start + maxDisplayed - 1)
  
  if (end - start + 1 < maxDisplayed) {
    start = Math.max(1, end - maxDisplayed + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 지도 초기화
const initMap = async () => {
  await nextTick()
  
  if (!mapContainer.value) {
    console.error('Map container not found')
    return
  }

  try {
    map = L.map(mapContainer.value, {
      center: defaultCenter,
      zoom: 12,
      zoomAnimation: true,
      markerZoomAnimation: true
    })
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
    
    console.log('Leaflet 지도 초기화 완료')
  } catch (error) {
    console.error('지도 초기화 오류:', error)
  }
}

// 마커 생성 및 관리
const createMarkers = () => {
  // 기존 마커 제거
  if (markers.value.length > 0) {
    markers.value.forEach(marker => {
      if (map) map.removeLayer(marker)
    })
    markers.value = []
  }

  if (!busStops.value || busStops.value.length === 0) {
    console.log('표시할 정류장이 없습니다.')
    return
  }

  // 커스텀 마커 아이콘 정의
  const busStopIcon = L.divIcon({
    className: 'custom-bus-stop-icon',
    html: `
      <div class="marker-container">
        <div class="marker-base">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="bus-icon">
            <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
          </svg>
        </div>
        <div class="marker-pole"></div>
        <div class="marker-shadow"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  // 새로운 마커 생성
  const validStops = []
  const markerLayer = L.layerGroup().addTo(map)
  
  busStops.value.forEach(stop => {
    // 좌표 정보 확인 (대소문자 모두 확인)
    let xpos = stop.xPos !== undefined ? stop.xPos : stop.xpos
    let ypos = stop.yPos !== undefined ? stop.yPos : stop.ypos
    
    if (!ypos || !xpos) {
      console.warn('정류장 좌표 없음:', stop.bsId, stop.bsNm)
      return
    }
    
    // 좌표가 문자열이면 숫자로 변환
    const lat = typeof ypos === 'string' ? parseFloat(ypos) : ypos
    const lng = typeof xpos === 'string' ? parseFloat(xpos) : xpos
    
    if (isNaN(lat) || isNaN(lng)) {
      console.warn('유효하지 않은 좌표:', stop.bsId, stop.bsNm, ypos, xpos)
      return
    }

    try {
      // 마커 생성
      const marker = L.marker([lat, lng], {
        icon: busStopIcon,
        riseOnHover: true,
        bubblingMouseEvents: false
      }).addTo(markerLayer)

      // 팝업 추가 - 스타일 개선
      marker.bindPopup(`
        <div class="popup-content">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 5px; color: #2563eb;">${stop.bsNm}</h3>
          <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">ID: ${stop.bsId}</p>
          <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">${getStopAddress(stop) || '주소 정보 없음'}</p>
        </div>
      `, {
        className: 'custom-popup',
        closeButton: false,
        autoClose: false,
        closeOnEscapeKey: false
      })

      // 클릭 이벤트 추가
      marker.on('click', () => {
        fetchBusStopDetail(stop.bsId)
      })

      markers.value.push(marker)
      validStops.push({ lat, lng })
    } catch (error) {
      console.error('마커 생성 오류:', error, stop)
    }
  })

  // 지도 범위 재설정
  if (validStops.length > 0) {
    try {
      const bounds = L.latLngBounds(validStops.map(coord => [coord.lat, coord.lng]))
      map.fitBounds(bounds.pad(0.1))
    } catch (error) {
      console.error('지도 범위 설정 오류:', error)
      map.setView(defaultCenter, 12)
    }
  } else {
    console.warn('표시할 마커가 없습니다.')
    map.setView(defaultCenter, 12)
  }
}

// 정류장 주소 표시 헬퍼 함수
const getStopAddress = (stop) => {
  const city = stop.city || stop.sido || ''
  const district = stop.district || stop.gugun || ''
  const neighborhood = stop.neighborhood || stop.dong || ''
  
  if (!city && !district && !neighborhood) {
    return '주소 정보 없음'
  }
  
  return [city, district, neighborhood].filter(Boolean).join(' ')
}

// 정류장 검색 (키워드 입력 시)
const handleKeywordSearch = async () => {
  if (!keyword.value || keyword.value.trim().length < 1) {
    busStops.value = []
    totalItems.value = 0
    totalPages.value = 1
    return
  }
  
  try {
    console.log(`키워드로 검색: "${keyword.value}"`)
    let result = []
    const searchKeyword = keyword.value.trim()
    
    // 숫자로만 이루어진 경우 ID로 간주하여 상세 검색 시도
    const isNumeric = /^\d+$/.test(searchKeyword)
    
    if (isNumeric) {
      try {
        console.log('정류장 ID로 검색 시도:', searchKeyword)
        const stopDetail = await getBusStopDetail(searchKeyword)
        if (stopDetail && stopDetail.bsId) {
          result = [stopDetail]
        }
      } catch (detailError) {
        console.warn('정류장 ID로 상세 검색 실패:', detailError)
      }
    }
    
    // ID 검색 결과가 없거나 숫자가 아닌 경우 이름으로 검색
    if (result.length === 0) {
      console.log('정류장 이름으로 검색 시도:', searchKeyword)
      const nameSearchResult = await searchBusStopsApi(searchKeyword)
      if (nameSearchResult && Array.isArray(nameSearchResult)) {
        result = nameSearchResult
      }
    }
    
    if (!result || !Array.isArray(result)) {
      console.warn('검색 결과가 없거나 배열이 아님:', result)
      busStops.value = []
      totalItems.value = 0
      totalPages.value = 1
      return
    }
    
    console.log(`검색 결과: ${result.length}개 정류장 찾음`)
    busStops.value = result
    totalItems.value = result.length
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage) || 1
    currentPage.value = 1
    
    if (map) {
      createMarkers()
    }
  } catch (error) {
    console.error('정류장 검색 실패:', error)
    busStops.value = []
    totalItems.value = 0
    totalPages.value = 1
  }
}

// 정류장 검색 (검색 버튼 클릭 시)
const handleSearch = async () => {
  try {
    console.log('검색 시작:', { keyword: keyword.value })
    
    // 키워드가 있으면 키워드 검색 함수 재사용
    if (keyword.value && keyword.value.trim() !== '') {
      await handleKeywordSearch()
    } else {
      // 키워드가 없으면 전체 정류장 조회
      const response = await getAllBusStops('', 0, 100)
      let result = response.content || []
      
      // 결과 업데이트
      busStops.value = result
      totalItems.value = result.length
      totalPages.value = Math.ceil(totalItems.value / itemsPerPage) || 1
      currentPage.value = 1
      
      if (map) {
        createMarkers()
      }
    }
  } catch (error) {
    console.error('정류장 검색 실패:', error)
    alert('정류장 검색 중 오류가 발생했습니다.')
    busStops.value = []
    totalItems.value = 0
    totalPages.value = 1
  }
}

// 정류장 상세 정보 조회
const fetchBusStopDetail = async (bsId) => {
  try {
    console.log(`정류장 상세 정보 조회: ${bsId}`)
    const data = await getBusStopDetail(bsId)
    
    if (!data) {
      console.error('정류장 정보를 불러올 수 없습니다.')
      return
    }
    
    selectedStop.value = data
    
    // 지도에 마커 표시
    if (map) {
      // 좌표 확인 (대소문자 모두 확인)
      let xpos = data.xPos !== undefined ? data.xPos : data.xpos
      let ypos = data.yPos !== undefined ? data.yPos : data.ypos
      
      if (!ypos || !xpos) {
        console.warn('정류장 좌표 없음:', data.bsId, data.bsNm)
        return
      }
      
      // 좌표가 문자열이면 숫자로 변환
      const lat = typeof ypos === 'string' ? parseFloat(ypos) : ypos
      const lng = typeof xpos === 'string' ? parseFloat(xpos) : xpos
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('유효하지 않은 좌표:', data.bsId, data.bsNm, ypos, xpos)
        return
      }
      
      // 지도 이동
      map.setView([lat, lng], 16)
      
      // 선택한 정류장의 마커 찾기
      const marker = markers.value.find(m => {
        const pos = m.getLatLng()
        return Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lng) < 0.0001
      })
      
      // 마커가 있으면 팝업 열기
      if (marker) {
        marker.openPopup()
      }
    }
  } catch (error) {
    console.error('정류장 상세 정보 조회 실패:', error)
    alert('정류장 정보를 불러올 수 없습니다.')
  }
}

// 페이지 변경
const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = parseInt(page)
  
  // 페이지 변경 시 스크롤을 맨 위로 이동
  const resultList = document.getElementById('resultList')
  if (resultList) {
    resultList.scrollTop = 0
  }
}

// 정류장 삭제
const deleteBusStop = async () => {
  if (!selectedStop.value) return
  
  if (!confirm(`정말로 정류장 [${selectedStop.value.bsId}]을 삭제하시겠습니까?`)) return
  
  try {
    await deleteBusStopApi(selectedStop.value.bsId)
    alert('✅ 정류장이 성공적으로 삭제되었습니다.')
    
    // 목록에서 제거
    busStops.value = busStops.value.filter(stop => stop.bsId !== selectedStop.value.bsId)
    totalItems.value = busStops.value.length
    totalPages.value = Math.ceil(totalItems.value / itemsPerPage) || 1
    
    // 선택 해제
    selectedStop.value = null
    
    // 마커 재생성
    createMarkers()
  } catch (error) {
    console.error('정류장 삭제 실패:', error)
    alert('❌ 삭제 요청 중 오류가 발생했습니다.')
  }
}

// 정류장 수정 페이지로 이동
const updateBusStop = () => {
  if (!selectedStop.value) return
  window.location.href = `/UpdateBusStop?bsId=${encodeURIComponent(selectedStop.value.bsId)}`
}

// 시설물 확인 함수
const hasFacility = (type) => {
  if (!selectedStop.value || !selectedStop.value.facilities) return false
  return !!selectedStop.value.facilities[type]
}

// 노선 상세 정보 보기
const viewRouteDetails = (routeId) => {
  if (!routeId) return
  window.location.href = `/RouteDetail?routeId=${encodeURIComponent(routeId)}`
}

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  await initMap()
  
  // URL 파라미터 확인
  const params = new URLSearchParams(window.location.search)
  const bsId = params.get('bsId')
  
  if (bsId) {
    // 특정 정류장 상세 정보 조회
    await fetchBusStopDetail(bsId)
  } else {
    // 기본 검색 수행
    handleSearch()
  }

  // 지도 이벤트 리스너 추가
  if (map) {
    map.on('zoomend', () => {
      console.log('지도 줌 레벨 변경:', map.getZoom())
      updateMarkers()
    })

    map.on('moveend', () => {
      console.log('지도 이동 완료')
    })

    // 지도 로드 완료 후 마커 재배치
    map.whenReady(() => {
      console.log('지도 로드 완료')
      updateMarkers()
    })
  }
})

// 마커 업데이트 함수
const updateMarkers = () => {
  if (!map || markers.value.length === 0) return
  
  markers.value.forEach(marker => {
    marker.update()
  })
  
  console.log('마커 업데이트 완료')
}

// 컴포넌트가 언마운트될 때 정리
onBeforeUnmount(() => {
  // 마커 정리
  if (markers.value.length > 0) {
    markers.value.forEach(marker => {
      if (map) map.removeLayer(marker)
    })
    markers.value = []
  }
  
  // 지도 정리
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
/* Leaflet 마커 스타일 조정 */
:deep(.leaflet-div-icon) {
  background: transparent;
  border: none;
}

/* 커스텀 버스 정류장 마커 스타일 */
:deep(.custom-bus-stop-icon) {
  background: transparent;
  border: none;
}

:deep(.marker-container) {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

:deep(.marker-base) {
  position: absolute;
  top: 0;
  width: 28px;
  height: 28px;
  background: #2563eb;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border: 2px solid white;
}

:deep(.bus-icon) {
  width: 18px;
  height: 18px;
  color: white;
}

:deep(.marker-pole) {
  position: absolute;
  top: 28px;
  width: 4px;
  height: 12px;
  background: #2563eb;
  z-index: 1;
}

:deep(.marker-shadow) {
  position: absolute;
  bottom: 0;
  width: 14px;
  height: 3px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  filter: blur(1px);
}

/* 팝업 스타일 조정 */
:deep(.leaflet-popup-content-wrapper) {
  padding: 3px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.custom-popup) {
  min-width: 200px;
}

:deep(.custom-popup .leaflet-popup-content-wrapper) {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.custom-popup .leaflet-popup-tip) {
  background-color: white;
}

:deep(.custom-popup .leaflet-popup-content) {
  margin: 10px 12px;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
}

:deep(.popup-content) {
  text-align: center;
}

/* 탭 스타일 개선 */
.tab-active {
  color: #2563eb;
  border-color: #2563eb;
  font-weight: 600;
}

.tab-inactive {
  color: #6b7280;
  border-color: transparent;
  font-weight: 500;
}

.tab-inactive:hover {
  color: #374151;
  border-color: #d1d5db;
}
</style> 