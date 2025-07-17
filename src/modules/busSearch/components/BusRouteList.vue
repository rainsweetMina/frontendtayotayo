<template>
  <div class="px-5 py-1">
    <div
        v-for="route in routes"
        :key="route.routeId"
        class="px-[18px] py-[18px] border border-gray-200 mb-2 rounded-lg cursor-pointer bg-white transition-colors hover:bg-gray-50 overflow-hidden whitespace-nowrap text-ellipsis"
        @click="showRouteStops(route, $event)"
    >
      <!-- 노선번호와 색상 뱃지 -->
      <strong class="text-[17px]" :class="getTextColorClass(route.routeNo)">
        <span :class="['px-1.5 py-0.5 rounded-full text-xs text-white', getBadgeClass(route.routeNo)]">
          {{ getRouteType(route.routeNo) }}
        </span>
        <span class="ml-2">{{ route.routeNo }}</span>
      </strong>
      <span v-if="route.routeNote" class="ml-1 text-gray-500 text-sm font-bold" :title="route.routeNote">
        ({{ route.routeNote }})
      </span>
    </div>
    
    <!-- 정류장 목록 모달 -->
    <RouteStopModal
      :visible="modalVisible"
      :route="selectedRoute"
      :position="modalPosition"
      @close="handleModalClose"
      @selectStop="handleStopSelect"
      @showOnMap="handleShowOnMap"
      @drawRoute="handleDrawRoute"
      @moveToStop="handleMoveToStop"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RouteStopModal from './RouteStopModal.vue'

defineProps({
  routes: Array
})

const emit = defineEmits(['select'])

const modalVisible = ref(false)
const selectedRoute = ref(null)
const modalPosition = ref({ top: '1rem', left: '1rem' })

function showRouteStops(route, event) {
  selectedRoute.value = route
  modalVisible.value = true
  
  // 클릭된 요소의 위치를 기준으로 모달 위치 계산
  const rect = event.currentTarget.getBoundingClientRect()
  const sidebarWidth = 400 // 사이드바 대략적 너비
  const modalWidth = 400 // 모달 대략적 너비
  const modalHeight = 600 // 모달 대략적 높이
  
  let left = sidebarWidth + 20
  let top = rect.top
  
  // 화면 경계 체크
  if (left + modalWidth > window.innerWidth) {
    left = window.innerWidth - modalWidth - 20
  }
  
  if (top + modalHeight > window.innerHeight) {
    top = window.innerHeight - modalHeight - 20
  }
  
  if (top < 20) {
    top = 20
  }
  
  modalPosition.value = {
    top: `${top}px`,
    left: `${left}px`
  }
}

function closeModal() {
  modalVisible.value = false
  selectedRoute.value = null
}

// 모달 외부 클릭 시에만 닫히도록 처리
function handleModalClose() {
  // 지도 줌 이벤트로 인한 닫힘 방지
  if (modalVisible.value) {
    closeModal()
  }
}

function handleStopSelect(stop) {
  // 정류장 선택 시 처리 (필요시 구현)
  console.log('선택된 정류장:', stop)
}

function handleShowOnMap(route) {
  // 지도에서 보기 클릭 시 원래 select 이벤트 발생
  emit('select', route)
}

function handleDrawRoute(route) {
  // 지도에 노선 그리기
  emit('select', route)
}

function handleMoveToStop(stop) {
  // 지도에서 정류장으로 이동
  emit('moveToStop', stop)
}



function getRouteType(routeNo) {
  if (routeNo.startsWith('순환')) return '순환'
  if (routeNo.startsWith('급행')) return '급행'
  if (routeNo.startsWith('직행')) return '직행'
  if (routeNo.startsWith('군위')) return '마을'
  if (/^\d+(-\d+)?$/.test(routeNo)) return '간선'
  return '지선'
}

function getBadgeClass(routeNo) {
  if (routeNo.startsWith('순환')) return 'bg-amber-500'
  if (routeNo.startsWith('급행')) return 'bg-red-500'
  if (routeNo.startsWith('직행')) return 'bg-red-500'
  if (routeNo.startsWith('군위')) return 'bg-green-500'
  if (/^\d+(-\d+)?$/.test(routeNo)) return 'bg-blue-500'
  return 'bg-green-500'
}

function getTextColorClass(routeNo) {
  if (routeNo.startsWith('순환')) return 'text-amber-500'
  if (routeNo.startsWith('급행')) return 'text-red-500'
  if (routeNo.startsWith('직행')) return 'text-red-500'
  if (routeNo.startsWith('군위')) return 'text-green-500'
  if (/^\d+(-\d+)?$/.test(routeNo)) return 'text-blue-600'
  return 'text-green-500'
}
</script>

<style scoped>
.bus-route-list {
  padding: 5px 20px;
}
.bus-route-item {
  padding: 18px 18px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  background: #fff;
  transition: background 0.2s;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bus-route-item:hover {
  background-color: #f5f5f5;
}
.route-note {
  font-size: 14px;
  font-weight: bold;
}

/* 색상 클래스 */
.badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75em;
  color: white;
}
.badge-yellow { background-color: #f1c40f; }
.badge-red { background-color: #e74c3c; }
.badge-blue { background-color: #3498db; }
.badge-green { background-color: #2ecc71; }

.text-yellow strong { color: #f1c40f; }
.text-red strong    { color: #e74c3c; }
.text-blue strong   { color: #3562ff; }
.text-green strong  { color: #2ecc71; }
</style>