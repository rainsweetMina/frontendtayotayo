<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">정류장 추가</h1>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <!-- 지도 영역 추가 -->
      <div class="mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">지도에서 위치 선택</h2>
        <div id="map" class="w-full h-96 rounded-lg border border-gray-300"></div>
        <p class="mt-2 text-sm text-gray-500">지도를 클릭하여 정류장 위치를 지정하거나 주소 검색을 이용하세요.</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- 기본 정보 -->
        <div class="space-y-6">
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">기본 정보</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="code" class="block text-sm font-medium text-gray-700">정류장 코드</label>
                <input
                  type="text"
                  id="code"
                  v-model="form.bsId"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">정류장명</label>
                <input
                  type="text"
                  id="name"
                  v-model="form.bsNm"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700">정류장 유형</label>
                <select
                  id="type"
                  v-model="form.type"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="일반">일반</option>
                  <option value="환승">환승</option>
                  <option value="종점">종점</option>
                </select>
              </div>
              <div>
                <label for="direction" class="block text-sm font-medium text-gray-700">진행 방향</label>
                <select
                  id="direction"
                  v-model="form.direction"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">선택하세요</option>
                  <option value="상행">상행</option>
                  <option value="하행">하행</option>
                  <option value="순환">순환</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 위치 정보 -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">위치 정보</h2>
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700">주소</label>
                <div class="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="address"
                    v-model="form.address"
                    class="flex-1 min-w-0 block w-full rounded-none rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    readonly
                    required
                  />
                  <button
                    type="button"
                    class="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm"
                    @click="openAddressSearch"
                  >
                    주소 검색
                  </button>
                </div>
              </div>
              
              <!-- 주소 상세 정보 필드 추가 -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700">시/도</label>
                  <input
                    type="text"
                    id="city"
                    v-model="form.city"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label for="district" class="block text-sm font-medium text-gray-700">구/군</label>
                  <input
                    type="text"
                    id="district"
                    v-model="form.district"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label for="neighborhood" class="block text-sm font-medium text-gray-700">동</label>
                  <input
                    type="text"
                    id="neighborhood"
                    v-model="form.neighborhood"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="latitude" class="block text-sm font-medium text-gray-700">위도 (Y)</label>
                  <input
                    type="number"
                    id="latitude"
                    v-model="form.ypos"
                    step="0.000001"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label for="longitude" class="block text-sm font-medium text-gray-700">경도 (X)</label>
                  <input
                    type="number"
                    id="longitude"
                    v-model="form.xpos"
                    step="0.000001"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 추가 정보 -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">추가 정보</h2>
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="facilities" class="block text-sm font-medium text-gray-700">시설물 정보</label>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="shelter"
                      v-model="form.facilities.shelter"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="shelter" class="ml-2 text-sm text-gray-700">승객 대기 쉘터</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="bench"
                      v-model="form.facilities.bench"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="bench" class="ml-2 text-sm text-gray-700">벤치</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="lcd"
                      v-model="form.facilities.lcd"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="lcd" class="ml-2 text-sm text-gray-700">도착 정보 안내 단말기</label>
                  </div>
                </div>
              </div>
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700">비고</label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 버튼 -->
        <div class="mt-6 flex items-center justify-end space-x-4">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="$router.back()"
          >
            취소
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            정류장 추가
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { addBusStop } from '@/api/busStop'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const router = useRouter()

// 지도 관련 변수
let map = null
let selectedMarker = null
const markers = [] // 모든 마커를 저장할 배열
const defaultCenter = [35.8714, 128.6014] // 대구 중심 좌표

const form = ref({
  bsId: '',
  bsNm: '',
  type: '',
  direction: '',
  address: '',
  xpos: '',
  ypos: '',
  city: '',           // 시/도 정보
  district: '',       // 구/군 정보
  neighborhood: '',   // 동 정보
  facilities: {
    shelter: false,
    bench: false,
    lcd: false
  },
  notes: '',
  status: 'active'
})

// 지도 초기화 함수
const initMap = async () => {
  // DOM이 렌더링된 후 지도 초기화
  await nextTick()
  
  // 지도 요소가 있는지 확인
  const mapElement = document.getElementById('map')
  if (!mapElement) {
    console.error('Map container not found')
    return
  }

  // 지도 생성
  map = L.map('map').setView(defaultCenter, 16)

  // 타일 레이어 설정
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map)

  // 지도 더블클릭 이벤트 처리
  map.on('dblclick', (e) => {
    const { lat, lng } = e.latlng
    
    // 마커 생성 및 좌표 설정
    createMarkerAndSetCoordinates(lat, lng)
    
    // 기본 더블클릭 동작(줌인) 방지
    L.DomEvent.preventDefault(e)
  })
}

// 마커 생성 및 좌표 설정 함수
const createMarkerAndSetCoordinates = (lat, lng) => {
  // 이전 마커들 모두 제거
  if (markers.length > 0) {
    markers.forEach(marker => {
      if (map) map.removeLayer(marker)
    })
    markers.length = 0 // 배열 비우기
  }
  
  // 새 마커 생성
  const newMarker = L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: '/images/start_icon.png',
      iconSize: [32, 32],
      iconAnchor: [12, 36],
      popupAnchor: [0, -36]
    })
  }).addTo(map)
  
  // 마커를 배열에 추가
  markers.push(newMarker)
  
  // 현재 선택된 마커로 설정
  selectedMarker = newMarker
  
  console.log(`새 마커 생성: 위도=${lat}, 경도=${lng}, 총 마커 수=${markers.length}`)
  
  // 위도, 경도 값 즉시 업데이트
  form.value.ypos = lat.toFixed(6)
  form.value.xpos = lng.toFixed(6)
  
  // 주소 검색 (OpenStreetMap API 사용)
  reverseGeocode(lat, lng).then(address => {
    if (address) {
      form.value.address = address
      
      // 주소 정보가 업데이트되었음을 알림
      console.log('업데이트된 주소 정보:', {
        address: form.value.address,
        city: form.value.city,
        district: form.value.district,
        neighborhood: form.value.neighborhood
      })
    }
  })
  
  // 간단한 텍스트만 있는 팝업 표시 (버튼 기능 제거)
  const popupOptions = { 
    className: 'simple-popup',
    closeButton: false,  // 닫기 버튼 제거
    autoClose: true,
    closeOnEscapeKey: true,
    closeOnClick: false  // 지도 클릭 시 닫히지 않도록 설정
  }
  
  newMarker.bindPopup('새 정류장 위치', popupOptions).openPopup()
  
  // 1.5초 후 팝업 자동 닫기
  setTimeout(() => {
    if (newMarker) {
      newMarker.closePopup()
    }
  }, 1500)
}

// OpenStreetMap Nominatim API를 사용한 주소 검색
const searchCoordinatesByNominatim = async (address) => {
  try {
    // 한글 주소를 인코딩
    const encodedAddress = encodeURIComponent(address)
    
    // 백엔드 프록시 API 사용
    const { geocode } = await import('@/api/axiosInstance')
    const data = await geocode(address)
    
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      
      // 지도 이동 및 마커 생성
      if (map) {
        map.setView([lat, lng], 16)
        createMarkerAndSetCoordinates(lat, lng)
      }
      
      // 주소 상세 정보가 이미 다음 주소 API에서 설정되었으므로 여기서는 추가 처리 안함
    } else {
      alert('좌표를 찾을 수 없습니다. 수동으로 입력해주세요.')
    }
  } catch (error) {
    console.error('주소 검색 오류:', error)
    alert('주소 검색 중 오류가 발생했습니다. 지도에서 직접 위치를 선택해주세요.')
  }
}

// 역방향 지오코딩 (좌표 → 주소)
const reverseGeocode = async (lat, lng) => {
  try {
    // 백엔드 프록시 API 사용
    const { reverseGeocode } = await import('@/api/axiosInstance')
    const data = await reverseGeocode(lat, lng)
    
    if (data && data.display_name) {
      // 주소 정보 저장
      form.value.address = data.display_name
      
      // 주소 상세 정보 분리 (한국 주소 체계에 맞게 개선)
      if (data.address) {
        console.log('OpenStreetMap 원본 주소 데이터:', data.address)
        
        // 한국 주소 체계에 맞게 시/도 정보 추출
        if (data.address.country === 'South Korea' || data.address.country === '대한민국') {
          // 시/도 정보 (province, state, city_district 등)
          form.value.city = data.address.province || 
                           data.address.state || 
                           (data.address.city && data.address.city.includes('광역시') ? data.address.city : '') ||
                           (data.address.city && data.address.city.includes('특별시') ? data.address.city : '') ||
                           ''
          
          // 구/군 정보 (city, county, district 등)
          form.value.district = data.address.city_district || 
                               data.address.county || 
                               (data.address.city && !data.address.city.includes('광역시') && !data.address.city.includes('특별시') ? data.address.city : '') ||
                               data.address.district ||
                               ''
          
          // 동 정보 (suburb, village, town, neighbourhood 등)
          form.value.neighborhood = data.address.suburb || 
                                   data.address.neighbourhood || 
                                   data.address.village || 
                                   data.address.town || 
                                   data.address.quarter ||
                                   ''
          
          // 대구광역시 특별 처리
          if (data.address.city === '대구광역시' || data.address.city === 'Daegu' || form.value.city.includes('대구')) {
            form.value.city = '대구광역시'
            
            // 구/군 정보가 없는 경우 추가 처리
            if (!form.value.district) {
              // 주소에서 구 이름 추출 시도
              const addressParts = data.display_name.split(',').map(part => part.trim())
              for (const part of addressParts) {
                if (part.includes('구') && !part.includes('대구광역시')) {
                  form.value.district = part
                  break
                }
              }
            }
          }
          
          // 빈 값 처리
          form.value.city = form.value.city || '정보 없음'
          form.value.district = form.value.district || '정보 없음'
          form.value.neighborhood = form.value.neighborhood || '정보 없음'
        }
        
        console.log('처리된 주소 상세 정보:', {
          city: form.value.city,
          district: form.value.district,
          neighborhood: form.value.neighborhood,
          raw: data.address
        })
      }
      
      return data.display_name
    }
    return null
  } catch (error) {
    console.error('역방향 지오코딩 오류:', error)
    return null
  }
}

// 폼 제출 처리
const handleSubmit = async () => {
  try {
    // 백엔드 API 형식에 맞게 데이터 변환
    const busStopData = {
      bsId: form.value.bsId,
      bsNm: form.value.bsNm,
      xpos: form.value.xpos,
      ypos: form.value.ypos,
      address: form.value.address,
      city: form.value.city,           // 시/도 정보 추가
      district: form.value.district,   // 구/군 정보 추가
      neighborhood: form.value.neighborhood, // 동 정보 추가
      type: form.value.type,
      direction: form.value.direction,
      facilities: form.value.facilities,
      notes: form.value.notes,
      status: form.value.status
    }

    console.log('정류장 추가 데이터:', busStopData)
    await addBusStop(busStopData)
    alert('정류장이 성공적으로 추가되었습니다.')
    router.push('/admin/bus-stops')
  } catch (error) {
    console.error('정류장 추가 실패:', error)
    alert(`정류장 추가 실패: ${error.response?.data?.message || '서버 오류가 발생했습니다.'}`)
  }
}

// 주소 검색 팝업 열기
const openAddressSearch = () => {
  if (window.daum && window.daum.Postcode) {
    new window.daum.Postcode({
      oncomplete: (data) => {
        // 전체 주소 정보 저장
        form.value.address = data.address
        
        // 주소 상세 정보 분리하여 저장
        form.value.city = data.sido || ''  // 시/도 정보
        form.value.district = data.sigungu || '' // 구/군 정보
        form.value.neighborhood = data.bname || '' // 동 정보
        
        console.log('다음 주소 API 응답:', data)
        console.log('주소 상세 정보 설정:', {
          city: form.value.city,
          district: form.value.district,
          neighborhood: form.value.neighborhood
        })
        
        // 주소로 좌표 검색 - 카카오맵 API 대신 OpenStreetMap Nominatim API 사용
        searchCoordinatesByNominatim(data.address)
      }
    }).open()
  } else {
    alert('주소 검색 API를 불러올 수 없습니다.')
  }
}

// 컴포넌트가 마운트될 때 지도 초기화
onMounted(() => {
  initMap()
})

// 컴포넌트가 언마운트될 때 정리
onBeforeUnmount(() => {
  // 마커 정리
  if (markers.length > 0) {
    markers.forEach(marker => {
      if (map) map.removeLayer(marker)
    })
  }
  
  // 지도 정리
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.custom-emoji-icon {
  font-size: 28px;
  line-height: 1;
  text-align: center;
}

/* Leaflet 마커 스타일 조정 */
:deep(.leaflet-div-icon) {
  background: transparent;
  border: none;
}

/* 팝업 스타일 조정 - 간소화된 스타일 */
:deep(.simple-popup .leaflet-popup-content-wrapper) {
  padding: 2px 5px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
}

:deep(.simple-popup .leaflet-popup-content) {
  margin: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  color: #333;
}

:deep(.simple-popup .leaflet-popup-tip) {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

:deep(.popup-content) {
  cursor: pointer;
  padding: 3px 6px;
  transition: background-color 0.2s;
  border-radius: 4px;
  display: inline-block;
}
</style> 