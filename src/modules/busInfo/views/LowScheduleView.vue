<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">저상버스 시간표</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">저상버스란?</h2>
        <p class="text-gray-700 mb-4">
          저상버스는 교통약자(장애인, 고령자, 임산부 등)의 이동 편의를 위해 차체 바닥이 낮고 경사판이 설치된 버스입니다.
          휠체어 이용자도 쉽게 탑승할 수 있도록 설계되어 있습니다.
        </p>
        <div class="flex justify-center mb-4">
          <img src="https://via.placeholder.com/600x300?text=저상버스+이미지" alt="저상버스 이미지" class="rounded-lg max-w-full h-auto">
        </div>
      </div>
      
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
          <h2 class="text-xl font-semibold">{{ selectedRouteName }} 저상버스 시간표</h2>
          <p class="text-sm text-gray-600">운행 대수: {{ busCount }}대</p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-3 px-4 text-left">버스 번호</th>
                <th class="py-3 px-4 text-left">출발 시간</th>
                <th class="py-3 px-4 text-left">출발 정류장</th>
                <th class="py-3 px-4 text-left">특이사항</th>
              </tr>
            </thead>
            <tbody class="text-gray-700">
              <tr v-for="(item, index) in scheduleData" :key="index" class="border-b">
                <td class="py-3 px-4">{{ item.busNumber }}</td>
                <td class="py-3 px-4">{{ item.departureTime }}</td>
                <td class="py-3 px-4">{{ item.departureStop }}</td>
                <td class="py-3 px-4">{{ item.note }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-else-if="selectedRoute" class="text-center py-8 text-gray-500">
        선택한 노선의 저상버스 시간표 정보가 없습니다.
      </div>
      
      <div v-else class="text-center py-8 text-gray-500">
        노선을 선택하면 저상버스 시간표가 표시됩니다.
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">저상버스 이용 안내</h2>
      <ul class="list-disc pl-5 space-y-2">
        <li>저상버스는 휠체어 이용자가 탑승할 경우 경사판 작동 및 안전 확보를 위해 정차 시간이 길어질 수 있습니다.</li>
        <li>저상버스 이용 시 운전기사에게 미리 탑승 의사를 알려주시면 더욱 안전하게 이용하실 수 있습니다.</li>
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
  { id: '3', name: '303번 (칠곡 - 범어동)' }
];

const selectedRoute = ref('');
const isLoading = ref(false);
const scheduleData = ref([]);
const busCount = ref(0);

// 선택된 노선 이름 계산
const selectedRouteName = computed(() => {
  const route = routes.find(r => r.id === selectedRoute.value);
  return route ? route.name : '';
});

// 시간표 조회 함수
const searchSchedule = async () => {
  if (!selectedRoute.value) return;
  
  isLoading.value = true;
  
  try {
    // API 호출 대신 임시 데이터 사용
    await new Promise(resolve => setTimeout(resolve, 800)); // 로딩 시뮬레이션
    
    // 임시 데이터
    if (selectedRoute.value === '1') {
      scheduleData.value = [
        { busNumber: '1001', departureTime: '06:30', departureStop: '대구역', note: '휠체어 리프트 장착' },
        { busNumber: '1002', departureTime: '07:30', departureStop: '대구역', note: '휠체어 리프트 장착' },
        { busNumber: '1003', departureTime: '08:30', departureStop: '대구역', note: '휠체어 리프트 장착' },
        { busNumber: '1004', departureTime: '09:30', departureStop: '대구역', note: '휠체어 리프트 장착' },
        { busNumber: '1005', departureTime: '10:30', departureStop: '대구역', note: '휠체어 리프트 장착' }
      ];
      busCount.value = 5;
    } else if (selectedRoute.value === '2') {
      scheduleData.value = [
        { busNumber: '2001', departureTime: '07:00', departureStop: '대구대학교', note: '휠체어 리프트 장착' },
        { busNumber: '2002', departureTime: '08:00', departureStop: '대구대학교', note: '휠체어 리프트 장착' },
        { busNumber: '2003', departureTime: '09:00', departureStop: '대구대학교', note: '휠체어 리프트 장착' }
      ];
      busCount.value = 3;
    } else {
      scheduleData.value = [
        { busNumber: '3001', departureTime: '06:45', departureStop: '칠곡', note: '휠체어 리프트 장착' },
        { busNumber: '3002', departureTime: '07:45', departureStop: '칠곡', note: '휠체어 리프트 장착' },
        { busNumber: '3003', departureTime: '08:45', departureStop: '칠곡', note: '휠체어 리프트 장착' },
        { busNumber: '3004', departureTime: '09:45', departureStop: '칠곡', note: '휠체어 리프트 장착' }
      ];
      busCount.value = 4;
    }
  } catch (error) {
    console.error('시간표 조회 중 오류 발생:', error);
    scheduleData.value = [];
    busCount.value = 0;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style> 