<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-start justify-start">
    <!-- 배경 오버레이 -->
    <div class="absolute inset-0 bg-black bg-opacity-30" @click="closeModal"></div>
    
    <!-- 모달 컨테이너 - 동적 위치 -->
    <div 
      class="relative bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[calc(100vh-2rem)] overflow-hidden"
      :style="{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 1000
      }"
    >
      <!-- 헤더 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center">
          <span :class="['px-2 py-1 rounded-full text-xs text-white', getBadgeClass(route?.routeNo)]">
            {{ getRouteType(route?.routeNo) }}
          </span>
          <h3 class="ml-2 text-lg font-semibold text-gray-900">{{ route?.routeNo }}</h3>
          <span v-if="route?.routeNote" class="ml-2 text-sm text-gray-500">({{ route.routeNote }})</span>
        </div>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- 정류장 목록 -->
      <div class="overflow-y-auto max-h-[60vh]">
        <div v-if="loading" class="p-4 text-center text-gray-500">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p class="mt-2">정류장 정보를 불러오는 중...</p>
        </div>
        
        <div v-else-if="stops.length === 0" class="p-4 text-center text-gray-500">
          <p>정류장 정보를 불러올 수 없습니다.</p>
          <p class="text-sm mt-1">백엔드 서버가 실행 중인지 확인해주세요.</p>
        </div>
        
                 <div v-else class="divide-y divide-gray-100">
           <div 
             v-for="(stop, index) in stops" 
             :key="stop.bsId || index"
             class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
             @click="selectStop(stop)"
           >
             <!-- 도착 정보 팝업 -->
             <div v-if="selectedStop?.bsId === stop.bsId" class="mt-3 p-3 bg-blue-50 rounded-lg">
               <div class="text-sm font-medium text-blue-900 mb-2">도착 정보</div>
               <div v-if="stopArrivals.value[stop.bsId]?.length > 0" class="space-y-1">
                 <div 
                   v-for="arrival in stopArrivals.value[stop.bsId].slice(0, 3)" 
                   :key="arrival.routeId"
                   class="flex justify-between text-xs"
                 >
                   <span class="text-blue-700">{{ arrival.routeNo }}</span>
                   <span class="text-blue-600">{{ arrival.arrivalTime }}</span>
                 </div>
               </div>
               <div v-else class="text-xs text-gray-500">
                 {{ stopArrivals.value[stop.bsId] === undefined ? '로딩 중...' : '도착 정보 없음' }}
               </div>
             </div>
             <div class="flex items-center justify-between">
               <div class="flex items-center">
                 <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                   {{ stop.seq || index + 1 }}
                 </div>
                 <div>
                   <div class="font-medium text-gray-900">{{ stop.bsNm }}</div>
                   <div class="text-sm text-gray-500">ID: {{ stop.bsId }}</div>
                 </div>
               </div>
               <div class="text-right">
                 <div class="flex items-center justify-end mb-1">
                   <span :class="[
                     'px-2 py-1 rounded-full text-xs text-white font-medium',
                     stop.moveDir === '1' ? 'bg-blue-500' : 'bg-red-500'
                   ]">
                     {{ stop.moveDir === '1' ? '정방향' : '역방향' }}
                   </span>
                 </div>
                 <div class="text-xs text-gray-500">
                   <div v-if="route?.stNm && route?.edNm" class="text-gray-600">
                     {{ stop.moveDir === '1' ? route.stNm : route.edNm }} 
                     <span class="text-gray-400">→</span> 
                     {{ stop.moveDir === '1' ? route.edNm : route.stNm }}
                   </div>
                   <div class="text-gray-400 mt-1">{{ stop.seq }}번 정류장</div>
                 </div>
               </div>
             </div>
           </div>
         </div>
      </div>
      
      <!-- 푸터 -->
      <div class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="flex justify-between text-sm text-gray-600">
          <span>총 {{ stops.length }}개 정류장</span>
          <button 
            @click="showOnMap"
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            지도에서 보기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api/axiosInstance'
import { getSortedArrivalsFromApi } from '@/composables/arrival-utils'

const props = defineProps({
  visible: Boolean,
  route: Object,
  position: {
    type: Object,
    default: () => ({ top: '1rem', left: '1rem' })
  }
})

const emit = defineEmits(['close', 'selectStop', 'showOnMap', 'drawRoute', 'moveToStop', 'clearRoute'])

const loading = ref(false)
const stops = ref([])
const selectedStop = ref(null)
const stopArrivals = ref({})

// 모달이 열릴 때 정류장 정보 가져오기
watch(() => props.visible, async (newVisible) => {
  if (newVisible && props.route) {
    await fetchRouteStops()
    // 모달이 열릴 때 지도에 노선 그리기
    emit('drawRoute', props.route)
  }
})

// 노선 정류장 정보 가져오기
async function fetchRouteStops() {
  if (!props.route?.routeId) return
  
  loading.value = true
  try {
    const response = await api.get(`/api/bus/bus-route?routeId=${props.route.routeId}`)
    stops.value = response.data || []
    console.log('정류장 정보 로드 완료:', stops.value.length, '개')
  } catch (error) {
    console.error('노선 정류장 정보 가져오기 실패:', error)
    stops.value = []
  } finally {
    loading.value = false
  }
}

function closeModal() {
  selectedStop.value = null
  stopArrivals.value = {}
  // 모달이 닫혀도 지도에 노선 표시는 유지
  emit('close')
}

async function selectStop(stop) {
  // 이미 선택된 정류장을 다시 클릭하면 선택 해제
  if (selectedStop.value?.bsId === stop.bsId) {
    selectedStop.value = null
    return
  }
  
  selectedStop.value = stop
  
  // 선택된 정류장의 도착 정보 가져오기
  if (!stopArrivals.value[stop.bsId]) {
    try {
      const arrivals = await getSortedArrivalsFromApi(stop.bsId)
      stopArrivals.value[stop.bsId] = arrivals
    } catch (error) {
      console.error(`정류장 ${stop.bsNm} 도착 정보 가져오기 실패:`, error)
      stopArrivals.value[stop.bsId] = []
    }
  }
  
  // 지도에서 해당 정류장으로 이동
  emit('moveToStop', stop)
  
  emit('selectStop', stop)
}

function showOnMap() {
  emit('showOnMap', props.route)
  closeModal()
}

function getRouteType(routeNo) {
  if (!routeNo) return '노선'
  if (routeNo.startsWith('순환')) return '순환'
  if (routeNo.startsWith('급행')) return '급행'
  if (routeNo.startsWith('직행')) return '직행'
  if (routeNo.startsWith('군위')) return '마을'
  if (/^\d+(-\d+)?$/.test(routeNo)) return '간선'
  return '지선'
}

function getBadgeClass(routeNo) {
  if (!routeNo) return 'bg-gray-500'
  if (routeNo.startsWith('순환')) return 'bg-amber-500'
  if (routeNo.startsWith('급행')) return 'bg-red-500'
  if (routeNo.startsWith('직행')) return 'bg-red-500'
  if (routeNo.startsWith('군위')) return 'bg-green-500'
  if (/^\d+(-\d+)?$/.test(routeNo)) return 'bg-blue-500'
  return 'bg-green-500'
}
</script>

<style scoped>
/* 스크롤바 스타일링 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 