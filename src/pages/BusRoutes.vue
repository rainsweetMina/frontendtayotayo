<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllRoutes } from '../services/api'
import RouteViewer from "@/components/RouteViewer.vue"


const routes = ref([])
const selectedRouteId = ref('')

onMounted(async () => {
  routes.value = await getAllRoutes()
  console.log("로드된 노선 목록:", routes.value)
})

const selectedRoute = computed(() =>
    routes.value.find(r => r.id === Number(selectedRouteId.value))
)
</script>


<template>
  <div class="p-4">
    <h1 class="text-2xl font-semibold mb-4">버스 노선 조회</h1>
    <select v-model="selectedRouteId" class="p-2 border rounded mb-4 w-full">
      <option disabled value="">노선을 선택하세요</option>
      <option v-for="route in routes" :key="route.id" :value="route.id">
        {{ route.routeNo }} ({{ route.stNm }} → {{ route.edNm }})
      </option>
    </select>

    <RouteViewer
        v-if="selectedRoute"
        :route="selectedRoute"
    />
  </div>
</template>