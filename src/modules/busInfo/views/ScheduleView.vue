<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">버스 운행 시간표</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="mb-6">
        <label for="busRoute" class="block text-sm font-medium text-gray-700 mb-2">노선 선택</label>
        <div class="flex gap-2">
          <select 
            id="busRoute" 
            v-model="selectedRoute" 
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
          >
            <option value="">노선을 선택하세요</option>
            <option v-for="route in routes" :key="route.id" :value="route.id">
              {{ route.name }}
            </option>
          </select>
          <button 
            @click="searchSchedule" 
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            조회
          </button>
        </div>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="scheduleData && scheduleData.length > 0">
        <div class="mb-4 p-4 bg-gray-50 rounded-md">
          <h2 class="text-xl font-semibold">{{ selectedRouteName }} 노선 시간표</h2>
          <p class="text-sm text-gray-600">첫차: {{ firstBusTime }} / 막차: {{ lastBusTime }}</p>
          <p class="text-sm text-gray-600">평일 배차간격: {{ weekdayInterval }}</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-3 px-4 text-left">출발 정류장</th>
                <th class="py-3 px-4 text-left">도착 정류장</th>
                <th class="py-3 px-4 text-left">출발 시간</th>
                <th class="py-3 px-4 text-left">도착 예정 시간</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-for="(item, index) in scheduleData" :key="index" class="border-b">
                <td class="py-3 px-4">{{ item.departureStop }}</td>
                <td class="py-3 px-4">{{ item.arrivalStop }}</td>
                <td class="py-3 px-4">{{ item.departureTime }}</td>
                <td class="py-3 px-4">{{ item.arrivalTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else-if="selectedRoute" class="text-center py-8 text-gray-500">
        선택한 노선의 시간표 정보가 없습니다.
      </div>
      
      <div v-else class="text-center py-8 text-gray-500">
        노선을 선택하면 시간표가 표시됩니다.
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">시간표 안내</h2>
      <ul class="list-disc pl-5 space-y-2">
        <li>평일, 토요일, 공휴일에 따라 배차 간격이 다를 수 있습니다.</li>
        <li>기상 상황이나 도로 사정에 따라 실제 운행 시간은 달라질 수 있습니다.</li>
        <li>자세한 정보는 버스 회사에 문의하시기 바랍니다.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 노선 목록 (임시 데이터)
const routes = [
  { id: '1', name: '101번 (대구역 - 동대구역)' },
  { id: '2', name: '202번 (대구대학교 - 동성로)' },
  { id: '3', name: '303번 (칠곡 - 범어동)' },
  { id: '4', name: '급행1번 (화원 - 동대구역)' },
  { id: '5', name: '급행2번 (성서 - 범어동)' }
];

const selectedRoute = ref('');
const isLoading = ref(false);
const scheduleData = ref([]);

// 선택된 노선 이름 계산
const selectedRouteName = computed(() => {
  const route = routes.find(r => r.id === selectedRoute.value);
  return route ? route.name : '';
});

// 첫차, 막차, 배차간격 (임시 데이터)
const firstBusTime = ref('05:30');
const lastBusTime = ref('23:30');
const weekdayInterval = ref('15-20분');

// 시간표 조회 함수
const searchSchedule = async () => {
  if (!selectedRoute.value) return;
  
  isLoading.value = true;
  
  try {
    // API 호출 대신 임시 데이터 사용
    await new Promise(resolve => setTimeout(resolve, 800)); // 로딩 시뮬레이션
    
    // 임시 데이터
    scheduleData.value = [
      { departureStop: '대구역', arrivalStop: '동대구역', departureTime: '05:30', arrivalTime: '06:15' },
      { departureStop: '대구역', arrivalStop: '동대구역', departureTime: '05:50', arrivalTime: '06:35' },
      { departureStop: '대구역', arrivalStop: '동대구역', departureTime: '06:10', arrivalTime: '06:55' },
      { departureStop: '대구역', arrivalStop: '동대구역', departureTime: '06:30', arrivalTime: '07:15' },
      { departureStop: '대구역', arrivalStop: '동대구역', departureTime: '06:50', arrivalTime: '07:35' },
      { departureStop: '대구역', arrivalStop: '동대구역', departureTime: '07:10', arrivalTime: '07:55' },
      { departureStop: '대구역', arrivalStop: '동대구역', departureTime: '07:30', arrivalTime: '08:15' },
      { departureStop: '대구역', arrivalStop: '동대구역', departureTime: '07:50', arrivalTime: '08:35' },
    ];
    
    // 노선에 따라 첫차/막차 시간 변경
    if (selectedRoute.value === '1') {
      firstBusTime.value = '05:30';
      lastBusTime.value = '23:30';
      weekdayInterval.value = '15-20분';
    } else if (selectedRoute.value === '2') {
      firstBusTime.value = '06:00';
      lastBusTime.value = '22:30';
      weekdayInterval.value = '20-25분';
    } else {
      firstBusTime.value = '05:45';
      lastBusTime.value = '23:00';
      weekdayInterval.value = '15-30분';
    }
    
  } catch (error) {
    console.error('시간표 조회 중 오류 발생:', error);
    scheduleData.value = [];
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style> 