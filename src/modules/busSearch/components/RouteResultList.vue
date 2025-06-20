<template>
  <ul>
    <li
        v-for="(route, idx) in filteredRoutes"
        :key="route.routeId + '-' + idx"
        class="p-2.5 border border-gray-200 rounded-lg mb-2.5 bg-white hover:bg-gray-50"
        :class="{ 'border-blue-500 bg-blue-50': selectedRouteId === route.routeId }"
        @click="toggleRoute(idx, route)"
    >
      <!-- 🔻 경로 정보 -->
      <div @click="toggleRoute(idx, route)" class="flex items-center cursor-pointer">
        <span class="text-xs py-0.5 px-1.5 rounded text-white mr-2.5" 
              :class="route.type === '직통' ? 'bg-green-600' : 'bg-orange-500'">
          {{ route.type }}
        </span>
        <span class="text-gray-800 font-medium">
          {{ route.routeNo }}
          <span v-if="route.transferRouteNo">→ {{ route.transferRouteNo }}</span>
        </span>
      </div>

      <div class="flex justify-between items-center mt-1 text-sm text-gray-600">
         <span>
            {{ route.estimatedMinutes }}분 소요 · {{ route.stationIds?.length - 1 || 0 }}개 정류장
          </span>
        <span
            class="transform transition-transform duration-200"
            :class="{ 'rotate-180': openedIndex === idx }"
        >
          ▼
        </span>
      </div>

      <div class="mt-2 text-sm" v-if="openedIndex === idx && route.stationIds?.length">
        🚏 총 {{ route.stationIds.length - 1 }}개 정류장
        <ul class="mt-2 border-t border-gray-100 pt-2">
          <li
              v-for="(station, sIdx) in route.stationIds"
              :key="sIdx"
              class="py-1 border-b border-gray-50 last:border-b-0"
          >
            <template v-if="station.bsId === route.transferStationId">
              <div class="flex items-center text-orange-600 font-medium">
                <span>🔁 환승지점 : {{ station.bsNm }}</span>
              </div>
            </template>
            <template v-else>
              {{ station.bsNm }}
            </template>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { useSearchStore } from '@/stores/searchStore'
import {ref, computed} from 'vue'
import axios from 'axios'

const store = useSearchStore()
const props = defineProps({routes: Array})
const emit = defineEmits([
  'selectRoute',     // 👉 클릭 시 상위 컴포넌트에 선택된 경로 전달
  'drawRoutePath'    // 👉 ORS 경로 데이터 전달
])

const openedIndex = ref(null)
const selectedRouteId = ref(null)

const filteredRoutes = computed(() => {
  return props.routes
      .filter(route => !(route.type === '직통' && route.estimatedMinutes > 100))
      .sort((a, b) => a.estimatedMinutes - b.estimatedMinutes)
      .slice(0, 5)
})

// ✅ 직통 소요시간 100분 초과 제거
async function toggleRoute(idx, route = null) {
  openedIndex.value = openedIndex.value === idx ? null : idx
  if (!route) return

  selectedRouteId.value = route.routeId

  const coords = route.stationIds?.map(bs => ({
    xPos: bs.xPos ?? bs.xpos,
    yPos: bs.yPos ?? bs.ypos
  })).filter(bs => bs.xPos && bs.yPos) || []

  if (coords.length < 2) return

  let isResponseHandled = false
  const timeoutId = setTimeout(() => {
    if (!isResponseHandled) {
      emit('selectRoute', route)
      isResponseHandled = true
    }
  }, 2000)

  try {
    const res = await axios.post('/api/bus/ors/polyline', coords)
    if (isResponseHandled) return

    isResponseHandled = true
    clearTimeout(timeoutId)

    const polyline = res.data
    const firstStop = route.stationIds[0]
    const lastStop = route.stationIds.at(-1)
    const transfer = route.transferStationId
        ? route.stationIds.find(s => s.bsId === route.transferStationId)
        : null

    setTimeout(() => {
      store.autoTriggered = {
        startMarker: true,
        endMarker: true
      }
      store.setStartCoord({
        lat: firstStop.yPos ?? firstStop.ypos,
        lng: firstStop.xPos ?? firstStop.xpos
      })
      store.setEndCoord({
        lat: lastStop.yPos ?? lastStop.ypos,
        lng: lastStop.xPos ?? lastStop.xpos
      })
    }, 0)

    emit('drawRoutePath', {
      polyline,
      start: {
        bsId: firstStop.bsId,
        bsNm: firstStop.bsNm,
        xPos: firstStop.xPos ?? firstStop.xpos,
        yPos: firstStop.yPos ?? firstStop.ypos
      },
      end: {
        bsId: lastStop.bsId,
        bsNm: lastStop.bsNm,
        xPos: lastStop.xPos ?? lastStop.xpos,
        yPos: lastStop.yPos ?? lastStop.ypos
      },
      transferStation: transfer,
      beforeColor: 'yellowgreen',
      afterColor: 'orange'
    })

    // 👉 출발/도착 좌표도 함께 포함시켜서 emit
    emit('selectRoute', {
      ...route,
      __startCoord: {
        lat: firstStop.yPos ?? firstStop.ypos,
        lng: firstStop.xPos ?? firstStop.xpos
      },
      __endCoord: {
        lat: lastStop.yPos ?? lastStop.ypos,
        lng: lastStop.xPos ?? lastStop.xpos
      }
    })
  } catch (err) {
    console.error('❌ ORS 경로 요청 실패:', err)
    if (!isResponseHandled) {
      emit('selectRoute', route)
      isResponseHandled = true
    }
  }
}
</script>

<style scoped>
.route-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #fff;
}

.route-item:hover {
  background: #f9f9f9;
}

.route-type {
  display: flex;
  align-items: center;
}

.badge {
  font-size: 0.8em;
  padding: 3px 6px;
  border-radius: 4px;
  margin-right: 10px;
  color: white;
}

.route-item.selected {
  border-color: #2196f3;
  background-color: #e3f2fd;
}

.badge.direct {
  background-color: #4caf50;
}

.badge.transfer {
  background-color: #ff9800;
}

.route-main {
  font-weight: bold;
  flex: 1;
}

.duration {
  font-size: 0.9em;
  color: #666;
  margin-top: 4px;
}

.summary {
  font-size: 0.9em;
  margin-top: 8px;
}

.station-list {
  margin-top: 4px;
  padding-left: 20px;
}

.station-item {
  padding: 2px 0;
  font-size: 14px;
  list-style-type: circle;
}

.transfer-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #007bff;
  font-weight: bold;
  margin-left: -4px;
}

.transfer-icon {
  width: 16px;
  height: 16px;
}

.transfer-inline-label {
  font-size: 14px;
}

.duration {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-icon {
  transition: transform 0.2s ease;
  display: inline-block;
  margin-left: 6px;
  font-size: 0.9em;
  color: #888;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

ul {
  list-style: none;
  padding: 0 20px;
}
</style>
