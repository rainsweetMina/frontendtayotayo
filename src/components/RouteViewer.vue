<script setup>
import { ref, watch } from 'vue'
import { getRouteStops } from '../services/api.js'

// Props 정의
const props = defineProps({
  route: Object,
})

// 정류장 리스트 상태
const stops = ref([])

// 정류장 API 요청 함수
const fetchStops = async () => {
  if (props.route?.id) {
    try {
      stops.value = await getRouteStops(props.route.id)
    } catch (e) {
      console.error("정류장 불러오기 실패:", e)
    }
  } else {
    stops.value = []
  }
}

// route 변경될 때마다 API 요청
watch(() => props.route, fetchStops, { immediate: true })
</script>

<template>
  <div v-if="route" class="p-4">
    <h2 class="text-xl font-bold mb-2">
      노선: {{ route.routeNo }} ({{ route.stNm }} → {{ route.edNm }})
    </h2>
    <ul v-if="stops.length > 0">
      <li
          v-for="(stop, index) in stops"
          :key="stop.id"
          class="border-b py-2"
      >
        <strong>{{ index + 1 }}.</strong> {{ stop.name || stop.stNm }} ({{ stop.code || stop.stopId }})
      </li>
    </ul>
    <p v-else class="text-gray-500">정류장 정보가 없습니다.</p>
  </div>
  <div v-else class="text-gray-500 px-4 py-2">노선을 선택하세요.</div>
</template>
