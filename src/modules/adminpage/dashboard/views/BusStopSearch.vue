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
import { ref, onMounted, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axiosInstance'
import { searchBusStops as searchBusStopsApi, getAllBusStops, getBusStopDetail, deleteBusStop as deleteBusStopApi, getBusStopsInBounds } from '@/api/busStop'
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
    
    // 지도 초기화 상태 설정 (처음에는 false로 설정하여 첫 마커 생성 시에만 범위 재설정)
    map._mapInitialized = false;
    
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
          const { latitude, longitude, accuracy } = position.coords;
          console.log('현재 위치:', latitude, longitude);
          console.log('위치 정확도:', accuracy, 'meters');
          
          // 지도 중심 변경 (자동 이동임을 표시)
          map._isAutomaticMove = true;
          map.setView([latitude, longitude], 15);
          
          // 현재 위치 마커 추가
          const currentLocationIcon = L.divIcon({
            className: 'current-location-icon',
            html: `
              <div class="current-location-marker">
                <div class="pulse"></div>
                <div class="accuracy-circle" style="width:${accuracy}px;height:${accuracy}px"></div>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          const currentLocationMarker = L.marker([latitude, longitude], {
            icon: currentLocationIcon,
            zIndexOffset: 1000
          }).addTo(map);

          // 정확도 원 추가
          L.circle([latitude, longitude], {
            radius: accuracy,
            color: '#4A90E2',
            fillColor: '#4A90E2',
            fillOpacity: 0.15
          }).addTo(map);

          // 현재 위치 기반으로 주변 정류장 검색 
          // 반경을 500m로 고정
          const searchRadius = 500;
          searchNearbyBusStops(latitude, longitude, searchRadius);
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
          enableHighAccuracy: true, // 높은 정확도 요청
          timeout: 10000, // 10초로 늘림
          maximumAge: 30000 // 30초 이내 캐시된 위치 허용
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
    console.log(`현재 위치(${latitude}, ${longitude}) 반경 ${radius}m 내 정류장 검색 (백엔드 API 사용)`);
    
    // 정류장 데이터 로딩 표시
    busStops.value = [];
    totalItems.value = 0;
    
    // 백엔드 API를 통해 반경 내 정류장 검색
    const apiUrl = `/api/bus/nearbyBusStops?lat=${latitude}&lon=${longitude}&radius=${radius}`;
    console.log('API 요청:', apiUrl);
    
    const response = await api.get(apiUrl);
    
    if (!response || !response.data) {
      console.error('정류장 데이터를 가져오는데 실패했습니다:', response);
      alert('정류장 데이터를 가져오는데 실패했습니다.');
      return;
    }
    
    const stopsFromApi = response.data || [];
    
    console.log(`백엔드에서 반환된 정류장: ${stopsFromApi.length}개`);
    console.log('정류장 데이터 샘플:', stopsFromApi.slice(0, 2));
    
    if (stopsFromApi.length === 0) {
      console.warn('반경 내 정류장이 없습니다. 기본 검색을 수행합니다.');
      handleSearch();
      return;
    }
    
    // 결과 업데이트
    busStops.value = stopsFromApi;
    totalItems.value = stopsFromApi.length;
    totalPages.value = Math.ceil(stopsFromApi.length / itemsPerPage) || 1;
    currentPage.value = 1;
    
    // 반경 표시 원 추가
    if (map) {
      // 기존 원 제거
      map.eachLayer(layer => {
        if (layer instanceof L.Circle) {
          map.removeLayer(layer);
        }
      });
      
      // 반경을 500m로 고정하여 표시
      const displayRadius = 500;
      
      L.circle([latitude, longitude], {
        radius: displayRadius,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 2,
        opacity: 0.5
      }).addTo(map);
    }
    
    // 마커 생성 (처음 로드 시에는 지도 범위 재설정 허용)
    // 현재 위치 기반 검색은 초기 로드로 간주
    map._mapInitialized = false;
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
    // 좌표 형식의 주소는 표시하지 않음
    if (stop.geocodedAddress.startsWith('좌표:') || stop.geocodedAddress.startsWith('위도:')) {
      return '주소 정보 없음'
    }
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
    // 좌표 형식의 주소는 표시하지 않음
    if (addressCache.value[cacheKey].startsWith('좌표:') || addressCache.value[cacheKey].startsWith('위도:')) {
      return '주소 정보 없음'
    }
    return addressCache.value[cacheKey]
  }
  
  // 이미 로드 시도 중인지 확인하기 위한 플래그
  if (!stop.addressLoading) {
    // 로딩 중 플래그 설정
    stop.addressLoading = true;
    
    // 주소 정보가 없는 모든 정류장에 대해 주소 로드 시도
    getAddressFromCoordinates(lat, lng).then(address => {
      if (address) {
        // 플래그 해제
        stop.addressLoading = false;
        Object.assign(stop, { geocodedAddress: address });
      }
    }).catch(error => {
      // 플래그 해제
      stop.addressLoading = false;
      console.warn('주소 로드 실패:', error);
      // 오류 시 주소 정보 없음으로 표시
      Object.assign(stop, { geocodedAddress: '주소 정보 없음' });
    });
  }
  
  // 로딩 중인 경우 간결한 메시지 표시
  return '주소 정보 로딩 중';
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
  
  // 현재 진행 중인 역지오코딩 요청 수 확인 및 제한
  if (!window._activeGeocodingRequests) {
    window._activeGeocodingRequests = 0;
  }
  
  // 동시 요청이 5개를 초과하면 대기
  if (window._activeGeocodingRequests >= 5) {
    // 기본 주소 반환 (나중에 백그라운드에서 업데이트)
    const tempAddress = '주소 정보 로딩 중...';
    
    // 백그라운드에서 나중에 로드 시도
    setTimeout(() => {
      getAddressFromCoordinates(lat, lng).then(address => {
        if (address && address !== '주소 정보 로딩 중...') {
          addressCache.value[cacheKey] = address;
          
          // 마커 팝업 내용 업데이트 (해당 좌표의 마커 찾기)
          const marker = markers.value.find(m => {
            const pos = m.getLatLng();
            return Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lng) < 0.0001;
          });
          
          if (marker && marker.getPopup()) {
            // 마커의 팝업 내용 업데이트
            const popupContent = marker.getPopup().getContent();
            if (popupContent) {
              const updatedContent = popupContent.replace(/주소 정보 로딩 중\.\.\./, address);
              marker.getPopup().setContent(updatedContent);
            }
          }
          
          // 선택된 정류장의 주소도 업데이트
          if (selectedStop.value) {
            const stopLat = selectedStop.value.yPos || selectedStop.value.ypos;
            const stopLng = selectedStop.value.xPos || selectedStop.value.xpos;
            
            if (Math.abs(stopLat - lat) < 0.0001 && Math.abs(stopLng - lng) < 0.0001) {
              selectedStop.value.geocodedAddress = address;
            }
          }
        }
      }).catch(error => {
        console.warn('백그라운드 주소 로드 실패:', error);
      });
    }, Math.random() * 2000 + 1000); // 1-3초 사이 랜덤 딜레이
    
    return tempAddress;
  }
  
  try {
    // 활성 요청 카운터 증가
    window._activeGeocodingRequests++;
    
    // API 호출 시간 제한 설정 (5초로 증가)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('역지오코딩 API 타임아웃')), 5000)
    );
    
    // API 호출과 타임아웃 중 먼저 완료되는 것 처리
    const result = await Promise.race([
      geocoder.reverseGeocode(lat, lng),
      timeoutPromise
    ]);
    
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
          
          // 활성 요청 카운터 감소
          window._activeGeocodingRequests--;
          
          return formattedAddress;
        }
      }
      
      // 주소 객체에서 추출 실패한 경우 기본 문자열에서 처리
      const formattedAddress = address.trim();
      // 결과를 캐시에 저장
      addressCache.value[cacheKey] = formattedAddress;
      
      // 활성 요청 카운터 감소
      window._activeGeocodingRequests--;
      
      return formattedAddress;
    }
  } catch (error) {
    console.error('주소 변환 오류:', error);
    
    // 오류 발생 시 기본 메시지 사용
    const fallbackAddress = '주소 정보 없음';
    
    // 오류 발생 시에도 캐시에 저장 (반복적인 API 호출 방지)
    addressCache.value[cacheKey] = fallbackAddress;
    
    // 활성 요청 카운터 감소
    window._activeGeocodingRequests--;
    
    return fallbackAddress;
  }
  
  // 활성 요청 카운터 감소 (여기까지 도달하면 오류 발생)
  window._activeGeocodingRequests--;
  
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
            Object.assign(stop, { geocodedAddress: addressCache.value[cacheKey] })
          }
        }
      }
    })
    
    busStops.value = result
    
    // 검색 결과가 업데이트되면 바로 주소 정보 로드 시도
    nextTick(() => {
      loadAddressesForVisibleStops();
    });
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
              Object.assign(stop, { geocodedAddress: addressCache.value[cacheKey] })
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
        // 검색 버튼으로 검색 시에는 처음 로드로 간주하여 지도 범위 재설정 허용
        map._mapInitialized = false;
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
                  Object.assign(stopInList, { geocodedAddress: address });
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
      
      // 지도 이동 (자동 이동임을 표시)
      map._isAutomaticMove = true;
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

  // 지도 범위 재설정 - 초기 로드 시에만 적용 (지도 이동 시에는 적용하지 않음)
  if (validStops.length > 0 && !map._mapInitialized) {
    try {
      const bounds = L.latLngBounds(validStops.map(coord => [coord.lat, coord.lng]))
      // 자동 이동임을 표시
      map._isAutomaticMove = true;
      map.fitBounds(bounds.pad(0.1))
      // 지도 초기화 완료 표시
      map._mapInitialized = true;
    } catch (error) {
      console.error('지도 범위 설정 오류:', error)
      map._isAutomaticMove = true;
      map.setView(defaultCenter, 12)
      map._mapInitialized = true;
    }
  } else if (!map._mapInitialized) {
    console.warn('표시할 마커가 없습니다.')
    map._isAutomaticMove = true;
    map.setView(defaultCenter, 12)
    map._mapInitialized = true;
  }
  // 이미 초기화된 지도는 범위를 재설정하지 않음
  
  // 현재 화면에 표시되는 정류장의 주소 정보 로드
  loadAddressesForVisibleStops();
}

// 현재 화면에 표시되는 정류장의 주소 정보 로드
const loadAddressesForVisibleStops = async () => {
  // 현재 페이지에 표시되는 정류장만 처리
  const promises = [];
  let loadCount = 0;
  
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
        Object.assign(stop, { geocodedAddress: cachedAddress });
        continue; // 캐시에서 가져왔으므로 API 호출 불필요
      }
      
      // 이미 로드 시도 중인지 확인
      if (stop.addressLoading) continue;
      
      // 로드 중 플래그 설정
      stop.addressLoading = true;
      
      // 한 번에 최대 3개까지만 동시 로드
      if (loadCount < 3) {
        loadCount++;
        
        // 약간의 딜레이 추가 (각 요청 사이에 100-300ms 간격)
        const delayTime = loadCount * (Math.random() * 200 + 100);
        
        const loadPromise = new Promise(resolve => {
          setTimeout(async () => {
            try {
              const address = await getAddressFromCoordinates(lat, lng);
              if (address) {
                // 플래그 해제
                stop.addressLoading = false;
                Object.assign(stop, { geocodedAddress: address });
                
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
              // 플래그 해제
              stop.addressLoading = false;
              console.warn('역지오코딩 실패:', geoError);
              
              // 오류 시 주소 정보 없음으로 표시
              const fallbackAddress = '주소 정보 없음';
              Object.assign(stop, { geocodedAddress: fallbackAddress });
              
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
                    <p style="margin: 2px 0; font-size: 13px; color: #4b5563;">주소 정보 없음</p>
                  </div>
                `);
              }
            }
            resolve();
          }, delayTime);
        });
        
        promises.push(loadPromise);
      } else {
        // 나머지는 기본 주소로 표시하고 나중에 백그라운드에서 로드
        Object.assign(stop, { geocodedAddress: '주소 정보 로딩 중...' });
        
        // 백그라운드 로드를 위해 타이머 설정 (5-10초 후)
        setTimeout(() => {
          if (stop.addressLoading) {
            getAddressFromCoordinates(lat, lng).then(address => {
              if (address) {
                stop.addressLoading = false;
                Object.assign(stop, { geocodedAddress: address });
              }
            }).catch(() => {
              stop.addressLoading = false;
            });
          }
        }, 5000 + Math.random() * 5000);
      }
    }
  }
  
  // 모든 주소 로딩 완료 대기 (최대 3개)
  if (promises.length > 0) {
    await Promise.all(promises);
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

// 지도 영역 내 정류장 불러오기
const loadBusStopsInView = async () => {
  if (!map) return;
  
  // 현재 줌 레벨 확인 - 너무 작은 줌 레벨에서는 정류장을 불러오지 않음
  const currentZoom = map.getZoom();
  if (currentZoom < 14) {
    console.log(`줌 레벨(${currentZoom})이 너무 작아 정류장을 불러오지 않습니다. (최소 14 이상)`);
    return;
  }
  
  // 현재 지도 화면의 좌표 범위 구하기
  const bounds = map.getBounds();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  
  // 영역이 너무 넓은 경우 검색하지 않음 (무한 루프 방지)
  const latDiff = Math.abs(ne.lat - sw.lat);
  const lngDiff = Math.abs(ne.lng - sw.lng);
  
  if (latDiff > 0.1 || lngDiff > 0.1) {
    console.log('검색 영역이 너무 넓습니다. 더 확대해주세요.');
    return;
  }
  
  try {
    console.log(`지도 영역 내 정류장 검색: (${sw.lng}, ${sw.lat}) ~ (${ne.lng}, ${ne.lat})`);
    
    // API 호출해서 정류장 데이터 받아오기
    const stopsFromApi = await getBusStopsInBounds(sw.lng, sw.lat, ne.lng, ne.lat);
    console.log(`지도 영역 내 정류장: ${stopsFromApi.length}개`);
    
    // 결과가 너무 많은 경우 처리하지 않음 (무한 루프 방지)
    if (stopsFromApi.length > 300) {
      console.log(`정류장이 너무 많습니다(${stopsFromApi.length}개). 더 확대해주세요.`);
      return;
    }
    
    // 결과 업데이트
    busStops.value = stopsFromApi;
    totalItems.value = stopsFromApi.length;
    totalPages.value = Math.ceil(stopsFromApi.length / itemsPerPage) || 1;
    currentPage.value = 1;
    
    // 마커 생성 - 지도 범위 재설정 없이 마커만 생성
    map._isAutomaticMove = true;
    // 지도 이동 시에는 초기화된 상태로 설정하여 범위 재설정 방지
    map._mapInitialized = true;
    await createMarkers();
    
    // 주소 정보는 점진적으로 로드 (한 번에 모두 로드하지 않음)
    nextTick(() => {
      loadAddressesForVisibleStops();
    });
    
  } catch (error) {
    console.error('지도 영역 내 정류장 검색 실패:', error);
  }
};

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
      // 사용자가 직접 지도를 이동한 경우에만 정류장 로드
      if (!map._isAutomaticMove) {
        loadBusStopsInView();
      }
      // 자동 이동 플래그 초기화
      map._isAutomaticMove = false;
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