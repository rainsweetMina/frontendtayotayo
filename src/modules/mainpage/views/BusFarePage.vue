<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">버스 요금 안내</h1>
      <p class="text-gray-600 mb-6">요금(2025.02.24부터 적용)</p>
      
      <!-- 로딩 상태 표시 -->
      <div v-if="loading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- 에러 메시지 표시 -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{{ error }}</p>
        <button @click="fetchFares" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          다시 시도
        </button>
      </div>

      <div v-else>
        <!-- 요금 정보 테이블 -->
        <div class="overflow-x-auto mb-8">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
            <tr>
              <th class="px-4 py-3 border border-gray-200 bg-gray-50 text-center text-sm font-medium text-gray-700" rowspan="2">구분</th>
              <th class="px-4 py-3 border border-gray-200 bg-gray-50 text-center text-sm font-medium text-gray-700" rowspan="2">지불방식</th>
              <th class="px-4 py-3 border border-gray-200 bg-gray-50 text-center text-sm font-medium text-gray-700" colspan="3">요금</th>
            </tr>
            <tr>
              <th class="px-4 py-3 border border-gray-200 bg-gray-50 text-center text-sm font-medium text-gray-700">일반<br/>(19세이상)</th>
              <th class="px-4 py-3 border border-gray-200 bg-gray-50 text-center text-sm font-medium text-gray-700">청소년<br/>(13~18세)</th>
              <th class="px-4 py-3 border border-gray-200 bg-gray-50 text-center text-sm font-medium text-gray-700">어린이<br/>(6~12세)</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- 일반버스 -->
              <tr>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700" rowspan="2">일반버스</td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">카드</td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('G', 'card', 'adult')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('G', 'card', 'teen')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('G', 'card', 'child')) }}
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">현금</td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('G', 'cash', 'adult')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('G', 'cash', 'teen')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('G', 'cash', 'child')) }}
                </td>
              </tr>
              
              <!-- 급행버스 -->
              <tr>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700" rowspan="2">급행버스</td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">카드</td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('E', 'card', 'adult')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('E', 'card', 'teen')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('E', 'card', 'child')) }}
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">현금</td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('E', 'cash', 'adult')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('E', 'cash', 'teen')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('E', 'cash', 'child')) }}
                </td>
              </tr>
              
              <!-- 직행버스 -->
              <tr>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700" rowspan="2">직행버스</td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">카드</td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('D', 'card', 'adult')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('D', 'card', 'teen')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('D', 'card', 'child')) }}
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">현금</td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('D', 'cash', 'adult')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('D', 'cash', 'teen')) }}
                </td>
                <td class="px-4 py-3 border border-gray-200 text-center text-sm text-gray-700">
                  {{ formatPrice(getBusFare('D', 'cash', 'child')) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p class="text-sm text-gray-600 mb-8">※ 보호자(성인)가 동반하는 6세 미만의 소아 3인은 무임으로 운송하며, 3인을 초과하는 인원에 대하여는 어린이의 운임을 적용</p>
        
        <!-- 환승 안내 -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">환승 안내</h2>
          <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>환승시간 : 하차후 30분이내, 2회</li>
            <li>환승대상 : 대구 시내버스(같은 노선버스는 제외), 도시철도 및 8개 시군 시내버스(경산시, 영천시, 청도군, 고령군, 성주군, 구미시, 김천시, 칠곡군), 대경선</li>
            <li>환승방법 : 반드시 첫번의 하차단말기에 교통카드를 체크 하셔야 무료 환승 혜택을 받을 수 있습니다.단, 하차단말기 2회(3분초과) 체크시 요금 발생됩니다.</li>
            <li>교통카드 1장당 1인에 대하여 환승 혜택이 적용됩니다.</li>
            <li>일반버스->직행버스·급행버스 환승 시 차액요금이 차감됩니다.</li>
            <li>승차 및 하차시 동일한 카드를 사용 하셔야 환승 혜택이 적용됩니다.</li>
          </ul>
        </div>
        
        <!-- 기타사항 -->
        <div>
          <h2 class="text-xl font-bold text-gray-800 mb-4">기타사항</h2>
          <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700">
            <li>장애국가유공자는 2023년 1월 1일부터 국가보훈처 "교통복지카드 전국 호환 사업 시행"에 따라 교통복지카드로 무임승차 됩니다. (교통복지카드 신청 문의 : ☎ 1577-0606)</li>
            <li>※ 급행버스 제외, 국가유공자 요금지불은 국가보훈처에서 지급함</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from '@/config/axios';

const fares = ref([]);
const loading = ref(false);
const error = ref(null);

// 요금 정보 가져오기
const fetchFares = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get('/api/fares');
    fares.value = response.data;
    console.log('버스 요금 정보:', fares.value);
  } catch (err) {
    console.error('버스 요금 정보를 가져오는데 실패했습니다:', err);
    error.value = '버스 요금 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.';
    
    // 에러 발생 시 샘플 데이터 사용 (실제 구현 시 필요에 따라 조정)
    fares.value = [
      { id: 1, busType: 'G', payType: 'card', fareAdult: 1500, fareTeen: 850, fareChild: 400, payTypeName: '카드', busTypeName: '일반버스' },
      { id: 2, busType: 'G', payType: 'cash', fareAdult: 1700, fareTeen: 1000, fareChild: 500, payTypeName: '현금', busTypeName: '일반버스' },
      { id: 3, busType: 'E', payType: 'card', fareAdult: 1950, fareTeen: 1100, fareChild: 650, payTypeName: '카드', busTypeName: '급행버스' },
      { id: 4, busType: 'E', payType: 'cash', fareAdult: 2200, fareTeen: 1300, fareChild: 800, payTypeName: '현금', busTypeName: '급행버스' },
      { id: 5, busType: 'D', payType: 'card', fareAdult: 1950, fareTeen: 1100, fareChild: 650, payTypeName: '카드', busTypeName: '직행버스' },
      { id: 6, busType: 'D', payType: 'cash', fareAdult: 2200, fareTeen: 1300, fareChild: 800, payTypeName: '현금', busTypeName: '직행버스' }
    ];
  } finally {
    loading.value = false;
  }
};

// 버스 타입, 지불 방식, 연령대에 따른 요금 조회
const getBusFare = (busType, payType, ageType) => {
  const fare = fares.value.find(f => 
    f.busType === busType && 
    f.payType === payType
  );
  
  if (!fare) return 0;
  
  // 연령대에 따른 요금 반환
  if (ageType === 'adult') {
    return fare.fareAdult;
  } else if (ageType === 'teen') {
    return fare.fareTeen;
  } else if (ageType === 'child') {
    return fare.fareChild;
  }
  
  return 0;
};

// 가격 포맷팅 (1000 -> 1,000원)
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

onMounted(() => {
  fetchFares();
});
</script>

<style scoped>
/* 테이블 스타일 추가 */
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #e2e8f0;
}
</style> 