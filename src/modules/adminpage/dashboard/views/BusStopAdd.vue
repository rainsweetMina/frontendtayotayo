<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">정류장 추가</h1>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
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
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="latitude" class="block text-sm font-medium text-gray-700">위도</label>
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
                  <label for="longitude" class="block text-sm font-medium text-gray-700">경도</label>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { addBusStop } from '@/api/busStop'

const router = useRouter()

const form = ref({
  bsId: '',
  bsNm: '',
  type: '',
  direction: '',
  address: '',
  xpos: '',
  ypos: '',
  facilities: {
    shelter: false,
    bench: false,
    lcd: false
  },
  notes: '',
  status: 'active'
})

// 주소 검색 팝업 열기
const openAddressSearch = () => {
  // 카카오 주소 검색 API 연동
  new window.daum.Postcode({
    oncomplete: (data) => {
      form.value.address = data.address
      // 주소로 좌표 검색
      searchCoordinates(data.address)
    }
  }).open()
}

// 주소로 좌표 검색
const searchCoordinates = (address) => {
  // 카카오 맵 API를 사용하여 주소를 좌표로 변환
  const geocoder = new window.kakao.maps.services.Geocoder()
  
  geocoder.addressSearch(address, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      form.value.ypos = result[0].y
      form.value.xpos = result[0].x
    } else {
      alert('좌표를 찾을 수 없습니다. 수동으로 입력해주세요.')
    }
  })
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
      type: form.value.type,
      direction: form.value.direction,
      facilities: form.value.facilities,
      notes: form.value.notes,
      status: form.value.status
    }

    await addBusStop(busStopData)
    alert('정류장이 성공적으로 추가되었습니다.')
    router.push('/admin/bus-stops')
  } catch (error) {
    console.error('정류장 추가 실패:', error)
    alert(`정류장 추가 실패: ${error.response?.data?.message || '서버 오류가 발생했습니다.'}`)
  }
}
</script> 