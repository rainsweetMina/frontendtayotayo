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
              <p class="text-sm text-gray-500">
                총 {{ totalItems }}개의 정류장
                <span v-if="busStops.length < totalItems">
                  (현재 {{ busStops.length }}개 로드됨)
                </span>
              </p>
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
              <p class="mt-1 text-sm text-gray-500">
                <span v-if="stop.geocodedAddress || stop.city || stop.district || stop.neighborhood">
                  {{ getStopAddress(stop) }}
                </span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  주소 정보 로딩 중111...
                </span>
              </p>
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
                  <!-- 맨 처음 페이지로 -->
                  <button
                    @click="handlePageChange(1)"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                  >
                    <span class="sr-only">맨 처음</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <!-- 이전 페이지 -->
                  <button
                    @click="handlePageChange(currentPage - 1)"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                  >
                    <span class="sr-only">이전</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
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
                  
                  <!-- 다음 페이지 -->
                  <button
                    @click="handlePageChange(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                  >
                    <span class="sr-only">다음</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <!-- 맨 마지막 페이지로 -->
                  <button
                    @click="handlePageChange(totalPages)"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                  >
                    <span class="sr-only">맨 끝</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
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
let geocoder = null
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

// 주소 캐싱을 위한 객체
const addressCache = ref({})

// 현재 페이지에 표시할 정류장 목록 계산
const displayedBusStops = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return busStops.value.slice(start, end)
})

// 페이지네이션 - 표시할 페이지 번호 계산
const displayedPageNumbers = computed(() => {
  const result = []
  const maxDisplayed = 5 // 한 번에 표시할 페이지 번호 개수
  
  // 현재 페이지 기준으로 표시할 페이지 범위 계산
  let startPage = Math.max(1, Math.floor((currentPage.value - 1) / maxDisplayed) * maxDisplayed + 1)
  let endPage = Math.min(totalPages.value, startPage + maxDisplayed - 1)
    
    for (let i = startPage; i <= endPage; i++) {
      result.push(i)
  }
  
  return result
})

// 지도 초기화
const initMap = async () => {
  await nextTick()
  
  if (!mapContainer.value) {
    console.error('Map container not found')
    return
  }

  try {
    // 기본 위치로 지도 초기화 (나중에 현재 위치로 변경될 수 있음)
    map = L.map(mapContainer.value, {
      center: defaultCenter,
      zoom: 15,
      zoomAnimation: true,
      markerZoomAnimation: true
    })
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
    
    // Nominatim 역지오코딩 서비스 초기화 (백엔드 프록시 API 사용)
    geocoder = L.Nominatim = {
      reverseGeocode: async (lat, lng) => {
        try {
          // 백엔드 프록시 API 사용
          const { reverseGeocode } = await import('@/api/axiosInstance');
          return await reverseGeocode(lat, lng);
        } catch (error) {
          console.error('역지오코딩 오류:', error);
          return null;
        }
      }
    };
    
    // 현재 위치 가져오기 시도
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // 성공 시
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('현재 위치:', latitude, longitude);
          
          // 지도 중심 변경
          map.setView([latitude, longitude], 15);
          
          // 현재 위치 마커 추가
          const currentLocationIcon = L.divIcon({
            className: 'current-location-icon',
    html: `
              <div class="current-location-marker">
                <div class="pulse"></div>
      </div>
    `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          const currentLocationMarker = L.marker([latitude, longitude], {
            icon: currentLocationIcon,
            zIndexOffset: 1000
          }).addTo(map);

          // 현재 위치 기반으로 주변 정류장 검색
          searchNearbyBusStops(latitude, longitude, 500);
        },
        // 실패 시
        (error) => {
          console.error('현재 위치 가져오기 실패:', error);
          alert('현재 위치를 가져올 수 없어 기본 위치로 지도를 표시합니다.');
          // 기본 검색 수행
          handleSearch();
        },
        // 옵션
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.warn('Geolocation API를 지원하지 않는 브라우저입니다.');
      // 기본 검색 수행
      handleSearch();
    }
    
    console.log('Leaflet 지도 초기화 완료')
  } catch (error) {
    console.error('지도 초기화 오류:', error)
  }
}

// 현재 위치 주변 정류장 검색
const searchNearbyBusStops = async (latitude, longitude, radius) => {
  try {
    console.log(`현재 위치(${latitude}, ${longitude}) 반경 ${radius}m 내 정류장 검색`);
    
    // 정류장 데이터 로딩 표시
    busStops.value = [];
    totalItems.value = 0;
    
    // 전체 정류장 데이터 가져오기 (페이지 크기를 늘려서 더 많은 정류장 가져오기)
    console.log('정류장 데이터 요청 중...');
    const response = await getAllBusStops('', 0, 5000);
    
    if (!response || !response.content) {
      console.error('정류장 데이터를 가져오는데 실패했습니다:', response);
      alert('정류장 데이터를 가져오는데 실패했습니다.');
      return;
    }
    
    const allStops = response.content || [];
    
    console.log(`전체 정류장 ${allStops.length}개 중 반경 ${radius}m 내 정류장 필터링 중...`);
    console.log('정류장 데이터 샘플:', allStops.slice(0, 2));
    
    // 좌표 변환 및 거리 계산을 위한 정류장 데이터 전처리
    const stopsWithCoords = allStops.map(stop => {
    // 좌표 정보 확인 (대소문자 모두 확인)
      let xpos = stop.xPos !== undefined ? stop.xPos : stop.xpos;
      let ypos = stop.yPos !== undefined ? stop.yPos : stop.ypos;
      
      if (!ypos || !xpos) return { ...stop, validCoords: false };
      
      // 좌표가 문자열이면 숫자로 변환
      const lat = typeof ypos === 'string' ? parseFloat(ypos) : ypos;
      const lng = typeof xpos === 'string' ? parseFloat(xpos) : xpos;
      
      if (isNaN(lat) || isNaN(lng)) return { ...stop, validCoords: false };
      
      // 거리 계산 (Haversine 공식)
      const distance = calculateDistance(latitude, longitude, lat, lng);
      
      return {
        ...stop,
        validCoords: true,
        lat,
        lng,
        distance
      };
    });
    
    // 유효한 좌표를 가진 정류장만 필터링
    const validStops = stopsWithCoords.filter(stop => stop.validCoords);
    
    console.log(`유효한 좌표를 가진 정류장: ${validStops.length}개`);
    
    // 반경 내 정류장 필터링
    const nearbyStops = validStops.filter(stop => stop.distance <= radius);
    
    console.log(`반경 ${radius}m 내 정류장 ${nearbyStops.length}개 찾음`);
    
    // 디버깅을 위해 가장 가까운 정류장 5개 출력
    const closestStops = [...validStops]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
    
    console.log('가장 가까운 정류장 5개:');
    closestStops.forEach(stop => {
      console.log(`- ${stop.bsNm || '이름 없음'} (ID: ${stop.bsId}): 거리 ${Math.round(stop.distance)}m, 좌표: [${stop.lat}, ${stop.lng}]`);
    });
    
    if (nearbyStops.length === 0) {
      console.warn('반경 내 정류장이 없습니다. 반경을 1km로 늘려서 다시 검색합니다.');
      
      // 반경을 늘려서 다시 검색
      const extendedNearbyStops = validStops.filter(stop => stop.distance <= 1000);
      
      console.log(`확장된 반경 1km 내 정류장 ${extendedNearbyStops.length}개 찾음`);
      
      if (extendedNearbyStops.length > 0) {
        // 결과 업데이트
        busStops.value = extendedNearbyStops;
        totalItems.value = extendedNearbyStops.length;
        totalPages.value = Math.ceil(extendedNearbyStops.length / itemsPerPage) || 1;
        currentPage.value = 1;
        
        // 반경 표시 원 업데이트 (1km)
        if (map) {
          // 기존 원 제거
          map.eachLayer(layer => {
            if (layer instanceof L.Circle) {
              map.removeLayer(layer);
            }
          });
          
          // 새 원 추가
          L.circle([latitude, longitude], {
            radius: 1000,
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 2,
            opacity: 0.5
          }).addTo(map);
        }
        
        // 마커 생성
        await createMarkers();
        return;
      } else {
        console.warn('1km 반경 내에도 정류장이 없습니다. 가장 가까운 정류장 10개를 표시합니다.');
        
        // 가장 가까운 정류장 10개 선택
        const closest10Stops = [...validStops]
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 10);
        
        busStops.value = closest10Stops;
        totalItems.value = closest10Stops.length;
        totalPages.value = Math.ceil(closest10Stops.length / itemsPerPage) || 1;
        currentPage.value = 1;
        
        // 마커 생성
        await createMarkers();
        return;
      }
    }
    
    // 결과 업데이트
    busStops.value = nearbyStops;
    totalItems.value = nearbyStops.length;
    totalPages.value = Math.ceil(nearbyStops.length / itemsPerPage) || 1;
    currentPage.value = 1;
    
    // 반경 표시 원 추가
    if (map) {
      // 기존 원 제거
      map.eachLayer(layer => {
        if (layer instanceof L.Circle) {
          map.removeLayer(layer);
        }
      });
      
      // 새 원 추가
      L.circle([latitude, longitude], {
        radius: radius,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 2,
        opacity: 0.5
      }).addTo(map);
    }
    
    // 마커 생성
    await createMarkers();
    
  } catch (error) {
    console.error('주변 정류장 검색 실패:', error);
    alert('주변 정류장을 검색하는 중 오류가 발생했습니다.');
    
    // 오류 발생 시 기본 검색 수행
    handleSearch();
  }
};

// 두 좌표 사이의 거리 계산 (Haversine 공식, 미터 단위 반환)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // 지구 반지름 (미터)
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // 미터 단위 거리
};

// 정류장의 주소 정보 가져오기
const getStopAddress = (stop) => {
  // 주소 정보가 있는 경우 사용
  if (stop.city || stop.district || stop.neighborhood) {
    const addressParts = []
    if (stop.city) addressParts.push(stop.city)
    if (stop.district) addressParts.push(stop.district)
    if (stop.neighborhood) addressParts.push(stop.neighborhood)
    return addressParts.join(' ')
  }
  
  // 역지오코딩으로 가져온 주소가 있는 경우
  if (stop.geocodedAddress) {
    return stop.geocodedAddress
  }
  
  // 좌표 정보 확인
    let xpos = stop.xPos !== undefined ? stop.xPos : stop.xpos
    let ypos = stop.yPos !== undefined ? stop.yPos : stop.ypos
    
  if (!ypos || !xpos) return '주소 정보 없음'
    
    // 좌표가 문자열이면 숫자로 변환
    const lat = typeof ypos === 'string' ? parseFloat(ypos) : ypos
    const lng = typeof xpos === 'string' ? parseFloat(xpos) : xpos
    
  if (isNaN(lat) || isNaN(lng)) return '주소 정보 없음'
  
  // 캐시 키 생성 (소수점 5자리까지만 사용하여 비슷한 좌표는 같은 주소로 처리)
  const cacheKey = `${Math.round(lat * 100000) / 100000},${Math.round(lng * 100000) / 100000}`
  
  // 캐시에 있으면 캐시된 값 반환
  if (addressCache.value[cacheKey]) {
    return addressCache.value[cacheKey]
  }
  
  // 선택된 정류장인 경우 주소 즉시 로드 시도
  if (selectedStop.value && selectedStop.value.bsId === stop.bsId) {
    getAddressFromCoordinates(lat, lng).then(address => {
      if (address) {
        stop.geocodedAddress = address;
        // 선택된 정류장 객체에도 주소 정보 적용
        if (selectedStop.value && selectedStop.value.bsId === stop.bsId) {
          selectedStop.value.geocodedAddress = address;
        }
      }
    }).catch(error => {
      console.warn('주소 로드 실패:', error);
    });
  }
  
  return '주소 정보 로딩 중...'
}

// 좌표로 주소 가져오기 (캐싱 적용)
const getAddressFromCoordinates = async (lat, lng) => {
  if (!geocoder) return null;
  
  // 캐시 키 생성 (소수점 5자리까지만 사용하여 비슷한 좌표는 같은 주소로 처리)
  const cacheKey = `${Math.round(lat * 100000) / 100000},${Math.round(lng * 100000) / 100000}`;
  
  // 캐시에 있으면 캐시된 값 반환
  if (addressCache.value[cacheKey]) {
    return addressCache.value[cacheKey];
  }
  
  try {
    const result = await geocoder.reverseGeocode(lat, lng);
    if (result && result.display_name) {
      // 주소 형식 변환 (대한민국, 우편번호 제거 및 한국 표기 방식으로 변경)
      let address = result.display_name;
      
      // "대한민국" 또는 "South Korea" 제거
      address = address.replace(/(대한민국|South Korea),?\s*/g, '');
      
      // 우편번호 패턴 제거 (예: 12345, 123-456)
      address = address.replace(/\b\d{5}\b|\b\d{3}-\d{3}\b,?\s*/g, '');
      
      // 주소 요소 추출 및 재구성
      if (result.address) {
        const addressParts = [];
        
        // 한국 주소 형식으로 구성 (시/도 > 군/구 > 읍/면/동 > 상세주소)
        if (result.address.state) addressParts.push(result.address.state);
        if (result.address.county) addressParts.push(result.address.county);
        if (result.address.city) addressParts.push(result.address.city);
        if (result.address.town) addressParts.push(result.address.town);
        if (result.address.suburb) addressParts.push(result.address.suburb);
        if (result.address.village) addressParts.push(result.address.village);
        if (result.address.neighbourhood) addressParts.push(result.address.neighbourhood);
        if (result.address.road) addressParts.push(result.address.road);
        
        if (addressParts.length > 0) {
          const formattedAddress = addressParts.join(' ');
          // 결과를 캐시에 저장
          addressCache.value[cacheKey] = formattedAddress;
          return formattedAddress;
        }
      }
      
      // 주소 객체에서 추출 실패한 경우 기본 문자열에서 처리
      const formattedAddress = address.trim();
      // 결과를 캐시에 저장
      addressCache.value[cacheKey] = formattedAddress;
      return formattedAddress;
    }
  } catch (error) {
    console.error('주소 변환 오류:', error);
  }
  
  return null;
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
    let totalCount = 0
    const searchKeyword = keyword.value.trim()
    
    // 숫자로만 이루어진 경우 ID로 간주하여 상세 검색 시도
    const isNumeric = /^\d+$/.test(searchKeyword)
    
    if (isNumeric) {
      try {
        console.log('정류장 ID로 검색 시도:', searchKeyword)
        const stopDetail = await getBusStopDetail(searchKeyword)
        if (stopDetail && stopDetail.bsId) {
          result = [stopDetail]
          totalCount = 1
        }
      } catch (detailError) {
        console.warn('정류장 ID로 상세 검색 실패:', detailError)
      }
    }
    
    // ID 검색 결과가 없거나 숫자가 아닌 경우 이름으로 검색
    if (result.length === 0) {
      console.log('정류장 이름으로 검색 시도:', searchKeyword)
      const nameSearchResponse = await searchBusStopsApi(searchKeyword)
      if (nameSearchResponse) {
        // API 응답 형식에 따라 처리
        if (Array.isArray(nameSearchResponse)) {
          // 배열로 응답이 온 경우
          result = nameSearchResponse
          totalCount = nameSearchResponse.length
        } else if (nameSearchResponse.content && Array.isArray(nameSearchResponse.content)) {
          // 페이지네이션 객체로 응답이 온 경우
          result = nameSearchResponse.content
          totalCount = nameSearchResponse.totalElements || result.length
        }
      }
    }
    
    if (!result || !Array.isArray(result)) {
      console.warn('검색 결과가 없거나 배열이 아님:', result)
      busStops.value = []
      totalItems.value = 0
      totalPages.value = 1
      return
    }
    
    console.log(`검색 결과: ${result.length}개 정류장 찾음, 전체: ${totalCount}개`)
    
    // 검색 결과에 캐시된 주소 정보 적용
    result.forEach(stop => {
      // 좌표 정보 확인
      let xpos = stop.xPos !== undefined ? stop.xPos : stop.xpos
      let ypos = stop.yPos !== undefined ? stop.yPos : stop.ypos
      
      if (ypos && xpos) {
        // 좌표가 문자열이면 숫자로 변환
        const lat = typeof ypos === 'string' ? parseFloat(ypos) : ypos
        const lng = typeof xpos === 'string' ? parseFloat(xpos) : xpos
        
        if (!isNaN(lat) && !isNaN(lng)) {
          // 캐시 키 생성
          const cacheKey = `${Math.round(lat * 100000) / 100000},${Math.round(lng * 100000) / 100000}`
          
          // 캐시된 주소가 있으면 적용
          if (addressCache.value[cacheKey]) {
            stop.geocodedAddress = addressCache.value[cacheKey]
          }
        }
      }
    })
    
    busStops.value = result
    totalItems.value = totalCount
    totalPages.value = Math.ceil(busStops.value.length / itemsPerPage) || 1 // 실제 불러온 데이터 기준으로 페이지 계산
    currentPage.value = 1
    
    if (map) {
      await createMarkers()
    }
    
    // 검색 결과 표시 후 주소 정보 로드
    nextTick(() => {
      loadAddressesForVisibleStops();
    });
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
      
      // 검색 결과에 캐시된 주소 정보 적용
      result.forEach(stop => {
        // 좌표 정보 확인
        let xpos = stop.xPos !== undefined ? stop.xPos : stop.xpos
        let ypos = stop.yPos !== undefined ? stop.yPos : stop.ypos
        
        if (ypos && xpos) {
          // 좌표가 문자열이면 숫자로 변환
          const lat = typeof ypos === 'string' ? parseFloat(ypos) : ypos
          const lng = typeof xpos === 'string' ? parseFloat(xpos) : xpos
          
          if (!isNaN(lat) && !isNaN(lng)) {
            // 캐시 키 생성
            const cacheKey = `${Math.round(lat * 100000) / 100000},${Math.round(lng * 100000) / 100000}`
            
            // 캐시된 주소가 있으면 적용
            if (addressCache.value[cacheKey]) {
              stop.geocodedAddress = addressCache.value[cacheKey]
            }
          }
        }
      })
      
      // 결과 업데이트
      busStops.value = result
      totalItems.value = response.totalElements || result.length // 전체 정류장 수 (API에서 제공하는 경우)
      totalPages.value = Math.ceil(busStops.value.length / itemsPerPage) || 1 // 실제 불러온 데이터 기준으로 페이지 계산
      currentPage.value = 1
      
      if (map) {
        await createMarkers()
      }
      
      // 검색 결과 표시 후 주소 정보 로드
      nextTick(() => {
        loadAddressesForVisibleStops();
      });
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
    
    // 좌표 확인 (대소문자 모두 확인)
    let xpos = data.xPos !== undefined ? data.xPos : data.xpos
    let ypos = data.yPos !== undefined ? data.yPos : data.ypos
    
    if (ypos && xpos) {
      // 좌표가 문자열이면 숫자로 변환
      const lat = typeof ypos === 'string' ? parseFloat(ypos) : ypos
      const lng = typeof xpos === 'string' ? parseFloat(xpos) : xpos
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // 주소 정보가 없는 경우 역지오코딩으로 주소 가져오기
        if (!data.city && !data.district && !data.neighborhood && !data.geocodedAddress) {
          // 캐시 확인
          const cacheKey = `${Math.round(lat * 100000) / 100000},${Math.round(lng * 100000) / 100000}`;
          const cachedAddress = addressCache.value[cacheKey];
          
          if (cachedAddress) {
            // 캐시된 주소가 있으면 바로 적용
            data.geocodedAddress = cachedAddress;
            
            // 검색 결과 목록의 해당 정류장에도 적용
            const stopInList = busStops.value.find(stop => stop.bsId === data.bsId);
            if (stopInList) {
              stopInList.geocodedAddress = cachedAddress;
            }
          } else {
            // 캐시된 주소가 없으면 역지오코딩 수행
            try {
              const address = await getAddressFromCoordinates(lat, lng);
              if (address) {
                data.geocodedAddress = address;
                console.log('역지오코딩 주소:', address);
                
                // 주소 정보를 검색 결과 목록의 해당 정류장에도 적용
                const stopInList = busStops.value.find(stop => stop.bsId === data.bsId);
                if (stopInList) {
                  stopInList.geocodedAddress = address;
                }
                
                // 마커 팝업 내용도 업데이트
                const marker = markers.value.find(m => {
                  const pos = m.getLatLng()
                  return Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lng) < 0.0001
                });
                
                if (marker && marker.getPopup()) {
                  marker.getPopup().setContent(`
                    <div class="popup-content">
                      <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 5px; color: #2563eb;">${data.bsNm}</h3>
                      <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">ID: ${data.bsId}</p>
                      <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">${address}</p>
                    </div>
                  `);
                }
              }
            } catch (geoError) {
              console.warn('역지오코딩 실패:', geoError);
            }
          }
        }
      }
    }
    
    // 선택된 정류장 정보 업데이트
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
        // 주소 정보가 있으면 팝업 내용 업데이트
        const address = getStopAddress(data);
        if (address !== '주소 정보 로딩 중...') {
          marker.getPopup().setContent(`
            <div class="popup-content">
              <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 5px; color: #2563eb;">${data.bsNm}</h3>
              <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">ID: ${data.bsId}</p>
              <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">${address}</p>
            </div>
          `);
        }
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
  
  // 페이지 변경 후 표시되는 정류장의 주소 정보 로드
  nextTick(() => {
    loadAddressesForVisibleStops();
  });
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
    await createMarkers()
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

// 마커 생성 및 관리
const createMarkers = async () => {
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
  
  // 정류장 데이터 처리 및 마커 생성
  for (const stop of busStops.value) {
    // 좌표 정보 확인 (대소문자 모두 확인)
    let xpos = stop.xPos !== undefined ? stop.xPos : stop.xpos
    let ypos = stop.yPos !== undefined ? stop.yPos : stop.ypos
    
    if (!ypos || !xpos) {
      console.warn('정류장 좌표 없음:', stop.bsId, stop.bsNm)
      continue
    }
    
    // 좌표가 문자열이면 숫자로 변환
    const lat = typeof ypos === 'string' ? parseFloat(ypos) : ypos
    const lng = typeof xpos === 'string' ? parseFloat(xpos) : xpos
    
    if (isNaN(lat) || isNaN(lng)) {
      console.warn('유효하지 않은 좌표:', stop.bsId, stop.bsNm, ypos, xpos)
      continue
    }

    try {
      // 마커 생성
      const marker = L.marker([lat, lng], {
        icon: busStopIcon,
        riseOnHover: true,
        bubblingMouseEvents: false
      }).addTo(markerLayer)

      // 주소 정보 미리 로드 (캐시 확인)
      const cacheKey = `${Math.round(lat * 100000) / 100000},${Math.round(lng * 100000) / 100000}`;
      const cachedAddress = addressCache.value[cacheKey];
      
      if (cachedAddress) {
        // 캐시된 주소가 있으면 바로 적용
        stop.geocodedAddress = cachedAddress;
      }

      // 팝업 추가 - 스타일 개선
      const address = getStopAddress(stop);
      marker.bindPopup(`
        <div class="popup-content">
          <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 5px; color: #2563eb;">${stop.bsNm}</h3>
          <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">ID: ${stop.bsId}</p>
          <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">${address !== '주소 정보 없음' ? address : '주소 정보 로딩 중...'}</p>
        </div>
      `, {
        className: 'custom-popup',
        closeButton: false,
        autoClose: false,
        closeOnEscapeKey: false
      })

      // 주소 정보가 없으면 비동기로 로드
      if (address === '주소 정보 로딩 중...') {
        getAddressFromCoordinates(lat, lng).then(fetchedAddress => {
          if (fetchedAddress) {
            stop.geocodedAddress = fetchedAddress;
            // 팝업 내용 업데이트
            if (marker && marker.getPopup()) {
              marker.getPopup().setContent(`
                <div class="popup-content">
                  <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 5px; color: #2563eb;">${stop.bsNm}</h3>
                  <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">ID: ${stop.bsId}</p>
                  <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">${fetchedAddress}</p>
                </div>
              `);
            }
          }
        }).catch(error => {
          console.warn('주소 로드 실패:', error);
        });
      }

      // 클릭 이벤트 추가
      marker.on('click', () => {
        fetchBusStopDetail(stop.bsId)
      })

      markers.value.push(marker)
      validStops.push({ lat, lng })
    } catch (error) {
      console.error('마커 생성 오류:', error, stop)
    }
  }

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
  
  // 현재 화면에 표시되는 정류장의 주소 정보 로드
  loadAddressesForVisibleStops();
}

// 현재 화면에 표시되는 정류장의 주소 정보 로드
const loadAddressesForVisibleStops = async () => {
  // 현재 페이지에 표시되는 정류장만 처리
  for (const stop of displayedBusStops.value) {
    if (!stop.city && !stop.district && !stop.neighborhood && !stop.geocodedAddress) {
      // 좌표 정보 확인 (대소문자 모두 확인)
      let xpos = stop.xPos !== undefined ? stop.xPos : stop.xpos
      let ypos = stop.yPos !== undefined ? stop.yPos : stop.ypos
      
      if (!ypos || !xpos) continue;
      
      // 좌표가 문자열이면 숫자로 변환
      const lat = typeof ypos === 'string' ? parseFloat(ypos) : ypos
      const lng = typeof xpos === 'string' ? parseFloat(xpos) : xpos
      
      if (isNaN(lat) || isNaN(lng)) continue;
      
      // 캐시 확인
      const cacheKey = `${Math.round(lat * 100000) / 100000},${Math.round(lng * 100000) / 100000}`;
      const cachedAddress = addressCache.value[cacheKey];
      
      if (cachedAddress) {
        // 캐시된 주소가 있으면 바로 적용
        stop.geocodedAddress = cachedAddress;
        continue; // 캐시에서 가져왔으므로 API 호출 불필요
      }
      
      try {
        const address = await getAddressFromCoordinates(lat, lng);
        if (address) {
          stop.geocodedAddress = address;
          console.log(`정류장 ${stop.bsId} 역지오코딩 주소:`, address);
          
          // 마커 팝업 내용도 업데이트
          const marker = markers.value.find(m => {
            const pos = m.getLatLng()
            return Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lng) < 0.0001
          });
          
          if (marker && marker.getPopup()) {
            marker.getPopup().setContent(`
              <div class="popup-content">
                <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 5px; color: #2563eb;">${stop.bsNm}</h3>
                <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">ID: ${stop.bsId}</p>
                <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">${address}</p>
              </div>
            `);
  }
        }
      } catch (geoError) {
        console.warn('역지오코딩 실패:', geoError);
      }
    }
  }
};

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

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  await initMap()
  
  // URL 파라미터 확인
  const params = new URLSearchParams(window.location.search)
  const bsId = params.get('bsId')
  
  if (bsId) {
    // 특정 정류장 상세 정보 조회
    await fetchBusStopDetail(bsId)
  }
  // 기본 검색은 initMap에서 현재 위치를 가져온 후 수행하므로 여기서는 제거

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
  
  // 현재 페이지에 표시되는 정류장의 주소 정보 로드
  nextTick(() => {
    loadAddressesForVisibleStops();
  });
})

// 검색 결과 목록 갱신 시 주소 정보도 함께 업데이트
watch(() => displayedBusStops.value, () => {
  nextTick(() => {
    loadAddressesForVisibleStops();
  });
}, { deep: true });
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

/* 현재 위치 마커 스타일 */
:deep(.current-location-marker) {
  position: relative;
  width: 20px;
  height: 20px;
}

:deep(.current-location-marker::before) {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  background: #3b82f6;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  z-index: 2;
  border: 2px solid white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

:deep(.pulse) {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.4);
  animation: pulse 2s infinite;
  z-index: 1;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
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