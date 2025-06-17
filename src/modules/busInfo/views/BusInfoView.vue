<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">정류장 조회</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">정류장 검색</h2>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label for="searchType" class="block text-sm font-medium text-gray-700 mb-2">검색 조건</label>
            <select 
              id="searchType" 
              v-model="searchType" 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
              <option value="name">정류장 이름</option>
              <option value="number">정류장 번호</option>
              <option value="route">경유 노선</option>
            </select>
          </div>
          <div class="flex-1">
            <label for="searchKeyword" class="block text-sm font-medium text-gray-700 mb-2">검색어</label>
            <input 
              type="text" 
              id="searchKeyword" 
              v-model="searchKeyword"
              placeholder="검색어를 입력하세요" 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              @keyup.enter="searchBusStops"
            />
          </div>
          <div class="flex items-end">
            <button 
              @click="searchBusStops" 
              class="w-full md:w-auto px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
              검색
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="busStops && busStops.length > 0">
        <h3 class="text-lg font-medium mb-4">검색 결과 ({{ busStops.length }}개)</h3>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-3 px-4 text-left">정류장 번호</th>
                <th class="py-3 px-4 text-left">정류장 이름</th>
                <th class="py-3 px-4 text-left">위치</th>
                <th class="py-3 px-4 text-left">경유 노선</th>
                <th class="py-3 px-4 text-left">상세보기</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-for="stop in busStops" :key="stop.id" class="border-b">
                <td class="py-3 px-4">{{ stop.number }}</td>
                <td class="py-3 px-4">{{ stop.name }}</td>
                <td class="py-3 px-4">{{ stop.location }}</td>
                <td class="py-3 px-4">{{ stop.routes.join(', ') }}</td>
                <td class="py-3 px-4">
                  <button 
                    @click="viewBusStopDetail(stop.id)" 
                    class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else-if="searched" class="text-center py-8 text-gray-500">
        검색 결과가 없습니다. 다른 검색어로 다시 시도해보세요.
      </div>
      
      <div v-else class="text-center py-8 text-gray-500">
        정류장 이름, 번호 또는 경유 노선으로 검색하세요.
      </div>
    </div>
    
    <!-- 정류장 상세 정보 모달 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">{{ selectedStop.name }} ({{ selectedStop.number }})</h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">정류장 정보</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">위치</p>
                <p class="font-medium">{{ selectedStop.location }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">시설 정보</p>
                <p class="font-medium">{{ selectedStop.facilities }}</p>
              </div>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">경유 노선</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="route in selectedStop.routes" 
                :key="route" 
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {{ route }}
              </span>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-2">실시간 도착 정보</h3>
            <div v-if="arrivalInfo.length > 0" class="space-y-3">
              <div v-for="(arrival, index) in arrivalInfo" :key="index" class="p-3 border rounded-md">
                <div class="flex justify-between">
                  <span class="font-medium">{{ arrival.routeNumber }}</span>
                  <span :class="getArrivalTimeClass(arrival.remainingTime)">{{ arrival.remainingTime }}분 후 도착</span>
                </div>
                <div class="text-sm text-gray-600">
                  {{ arrival.destination }} 방면 | {{ arrival.currentLocation }}
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              현재 도착 예정인 버스가 없습니다.
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 검색 관련 상태
const searchType = ref('name');
const searchKeyword = ref('');
const isLoading = ref(false);
const busStops = ref([]);
const searched = ref(false);

// 모달 관련 상태
const showModal = ref(false);
const selectedStop = ref({});
const arrivalInfo = ref([]);

// 정류장 검색 함수
const searchBusStops = async () => {
  if (!searchKeyword.value.trim()) return;
  
  isLoading.value = true;
  searched.value = true;
  
  try {
    // API 호출 대신 임시 데이터 사용
    await new Promise(resolve => setTimeout(resolve, 800)); // 로딩 시뮬레이션
    
    // 임시 데이터
    const mockData = [
      { 
        id: '1', 
        number: '1234', 
        name: '대구역', 
        location: '대구시 중구 대신동', 
        routes: ['101', '202', '303', '급행1'],
        facilities: '승차대, 의자, 전자안내판'
      },
      { 
        id: '2', 
        number: '2345', 
        name: '동대구역', 
        location: '대구시 동구 신천동', 
        routes: ['101', '303', '급행2'],
        facilities: '승차대, 의자, 전자안내판, 냉난방'
      },
      { 
        id: '3', 
        number: '3456', 
        name: '대구대학교', 
        location: '대구시 북구 산격동', 
        routes: ['202', '급행1'],
        facilities: '승차대, 의자'
      },
      { 
        id: '4', 
        number: '4567', 
        name: '동성로', 
        location: '대구시 중구 동성로', 
        routes: ['101', '202', '303'],
        facilities: '승차대, 의자, 전자안내판'
      },
      { 
        id: '5', 
        number: '5678', 
        name: '범어동', 
        location: '대구시 수성구 범어동', 
        routes: ['303', '급행2'],
        facilities: '승차대, 의자'
      }
    ];
    
    // 검색 조건에 따라 필터링
    if (searchType.value === 'name') {
      busStops.value = mockData.filter(stop => stop.name.includes(searchKeyword.value));
    } else if (searchType.value === 'number') {
      busStops.value = mockData.filter(stop => stop.number.includes(searchKeyword.value));
    } else if (searchType.value === 'route') {
      busStops.value = mockData.filter(stop => stop.routes.some(route => route.includes(searchKeyword.value)));
    }
  } catch (error) {
    console.error('정류장 검색 중 오류 발생:', error);
    busStops.value = [];
  } finally {
    isLoading.value = false;
  }
};

// 정류장 상세 정보 조회
const viewBusStopDetail = async (stopId) => {
  isLoading.value = true;
  
  try {
    // API 호출 대신 임시 데이터 사용
    await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
    
    // 선택한 정류장 정보 찾기
    selectedStop.value = busStops.value.find(stop => stop.id === stopId) || {};
    
    // 임시 도착 정보 데이터
    arrivalInfo.value = [
      { 
        routeNumber: '101', 
        destination: '동대구역', 
        remainingTime: 3, 
        currentLocation: '대구역 2번 전' 
      },
      { 
        routeNumber: '202', 
        destination: '동성로', 
        remainingTime: 12, 
        currentLocation: '대구역 5번 전' 
      },
      { 
        routeNumber: '303', 
        destination: '범어동', 
        remainingTime: 18, 
        currentLocation: '대구역 7번 전' 
      }
    ];
    
    showModal.value = true;
  } catch (error) {
    console.error('정류장 상세 정보 조회 중 오류 발생:', error);
  } finally {
    isLoading.value = false;
  }
};

// 모달 닫기
const closeModal = () => {
  showModal.value = false;
};

// 도착 시간에 따른 스타일 클래스
const getArrivalTimeClass = (time) => {
  if (time <= 5) return 'font-bold text-red-600';
  if (time <= 10) return 'font-bold text-orange-500';
  return 'text-green-600';
};
</script>

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style> 