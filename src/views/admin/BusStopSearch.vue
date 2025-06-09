<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">정류장 검색</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 왼쪽: 검색 필터 및 결과 목록 -->
      <div class="lg:col-span-1 space-y-6">
        <!-- 검색 필터 -->
        <div class="bg-white shadow rounded-lg p-6">
          <form @submit.prevent="handleSearch" class="space-y-4">
            <div>
              <label for="searchType" class="block text-sm font-medium text-gray-700">검색 유형</label>
              <select
                id="searchType"
                v-model="searchParams.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="name">정류장 이름</option>
                <option value="code">정류장 코드</option>
                <option value="address">주소</option>
                <option value="route">경유 노선</option>
              </select>
            </div>

            <div>
              <label for="keyword" class="block text-sm font-medium text-gray-700">검색어</label>
              <input
                type="text"
                id="keyword"
                v-model="searchParams.keyword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">정류장 유형</label>
              <select
                id="type"
                v-model="searchParams.stopType"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="일반">일반</option>
                <option value="환승">환승</option>
                <option value="종점">종점</option>
              </select>
            </div>

            <div>
              <label for="facilities" class="block text-sm font-medium text-gray-700">시설물</label>
              <div class="mt-2 space-y-2">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="shelter"
                    v-model="searchParams.facilities.shelter"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="shelter" class="ml-2 text-sm text-gray-700">승객 대기 쉘터</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="bench"
                    v-model="searchParams.facilities.bench"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="bench" class="ml-2 text-sm text-gray-700">벤치</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="lcd"
                    v-model="searchParams.facilities.lcd"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="lcd" class="ml-2 text-sm text-gray-700">도착 정보 안내 단말기</label>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        <!-- 검색 결과 목록 -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">검색 결과</h2>
            <p class="mt-1 text-sm text-gray-500">총 {{ totalItems }}개의 정류장</p>
          </div>
          <ul class="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            <li
              v-for="stop in stops"
              :key="stop.id"
              class="p-4 hover:bg-gray-50 cursor-pointer"
              @click="selectStop(stop)"
              :class="{ 'bg-blue-50': selectedStop?.id === stop.id }"
            >
              <div class="flex justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ stop.name }}</p>
                  <p class="text-sm text-gray-500">{{ stop.code }}</p>
                </div>
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    stop.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ stop.status === 'active' ? '사용중' : '미사용' }}
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500">{{ stop.address }}</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-if="stop.facilities.shelter"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  쉘터
                </span>
                <span
                  v-if="stop.facilities.bench"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                >
                  벤치
                </span>
                <span
                  v-if="stop.facilities.lcd"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                >
                  LCD
                </span>
              </div>
            </li>
          </ul>

          <!-- 페이지네이션 -->
          <div class="bg-white px-4 py-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  @click="handlePageChange(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  이전
                </button>
                <button
                  @click="handlePageChange(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  다음
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                    -
                    <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
                    /
                    <span class="font-medium">{{ totalItems }}</span>
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 지도 -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow rounded-lg p-6">
          <div id="map" class="w-full h-[800px] rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const map = ref(null)
const markers = ref([])
const selectedStop = ref(null)

const stops = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const itemsPerPage = 10

const searchParams = ref({
  type: 'name',
  keyword: '',
  stopType: '',
  facilities: {
    shelter: false,
    bench: false,
    lcd: false
  }
})

// 지도 초기화
const initMap = () => {
  map.value = new window.kakao.maps.Map(document.getElementById('map'), {
    center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
    level: 7
  })
}

// 마커 생성
const createMarkers = () => {
  // 기존 마커 제거
  markers.value.forEach(marker => marker.setMap(null))
  markers.value = []

  // 새로운 마커 생성
  stops.value.forEach(stop => {
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(stop.latitude, stop.longitude),
      map: map.value
    })

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, 'click', () => {
      selectStop(stop)
    })

    markers.value.push(marker)
  })
}

// 정류장 선택
const selectStop = (stop) => {
  selectedStop.value = stop
  
  // 지도 중심 이동
  if (map.value) {
    const moveLatLng = new window.kakao.maps.LatLng(stop.latitude, stop.longitude)
    map.value.panTo(moveLatLng)
  }
}

// 검색 처리
const handleSearch = async (page = 1) => {
  try {
    const params = new URLSearchParams({
      page,
      type: searchParams.value.type,
      keyword: searchParams.value.keyword,
      stopType: searchParams.value.stopType,
      ...searchParams.value.facilities
    })

    const response = await fetch(`/api/admin/bus-stops/search?${params}`)
    const data = await response.json()
    
    stops.value = data.stops
    totalPages.value = data.totalPages
    totalItems.value = data.totalItems
    currentPage.value = page

    // 마커 업데이트
    createMarkers()
  } catch (error) {
    console.error('정류장 검색 실패:', error)
    alert('정류장 검색 중 오류가 발생했습니다.')
  }
}

// 페이지 변경
const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return
  handleSearch(page)
}

// 검색 결과 변경 시 지도 범위 조정
watch(stops, () => {
  if (stops.value.length > 0 && map.value) {
    const bounds = new window.kakao.maps.LatLngBounds()
    stops.value.forEach(stop => {
      bounds.extend(new window.kakao.maps.LatLng(stop.latitude, stop.longitude))
    })
    map.value.setBounds(bounds)
  }
})

onMounted(() => {
  initMap()
  handleSearch()
})
</script> 