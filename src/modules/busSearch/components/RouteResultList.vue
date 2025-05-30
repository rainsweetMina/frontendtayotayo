<template>
  <ul>
    <li
        v-for="(route, idx) in filteredRoutes"
        :key="route.routeId + '-' + idx"
        class="route-item"
        :class="{ selected: selectedRouteId === route.routeId }"
        @click="toggle(idx, route)"
    >
      <!-- 🔻 경로 정보 -->
      <div @click="toggle(idx)" class="route-type cursor-pointer">
        <span class="badge" :class="route.type === '직통' ? 'direct' : 'transfer'">
          {{ route.type }}
        </span>
        <span class="route-main">
          {{ route.routeNo }}
          <span v-if="route.transferRouteNo">→ {{ route.transferRouteNo }}</span>
        </span>
      </div>

      <div class="duration">
         <span>
    {{ route.estimatedMinutes }}분 소요 · {{ route.stationIds?.length || 0 }}개 정류장
  </span>
        <span
            class="dropdown-icon"
            :class="{ open: openedIndex === idx }"
        >
    ▼
  </span>
      </div>

      <!-- 🔻 상세 정류장 표시 -->
      <div class="summary" v-if="openedIndex === idx && route.stationIds?.length">
        🚏 총 {{ route.stationIds.length }}개 정류장
        <div v-if="route.type === '환승' && route.transferStationName" class="transfer-info text-primary">
          🔁 환승지점: {{ route.transferStationName }}
        </div>
        <ul class="station-list mt-2">
          <li
              v-for="(station, sIdx) in route.stationIds"
              :key="sIdx"
              class="station-item"
          >
            {{ station.bsNm }}
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ routes: Array })
const openedIndex = ref(null)
const selectedRouteId = ref(null)
const emit = defineEmits(['selectRoute'])

function toggle(idx, route = null) {
  openedIndex.value = openedIndex.value === idx ? null : idx
  if (route) {
    selectedRouteId.value = route.routeId
    emit('selectRoute', route)
  }
}

// ✅ 직통 소요시간 100분 초과 제거
const filteredRoutes = computed(() =>
    props.routes
        .filter(route => {
          // ✅ 직통 노선이면서 100분 초과면 제외
          if (route.type === '직통' && route.estimatedMinutes > 100) return false
          return true
        })
        // ✅ 소요시간 오름차순 정렬
        .sort((a, b) => a.estimatedMinutes - b.estimatedMinutes)
)
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
  list-style-type: disc;
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
</style>
