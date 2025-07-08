<template>
  <div class="search-box">
    <label>
      구 선택:
      <select :value="district" @change="onDistrictChange($event.target.value)">
        <option value="">-- 구 선택 --</option>
        <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
      </select>
    </label>

    <label>
      동 선택:
      <select :value="neighborhood" @change="onNeighborhoodChange($event.target.value)">
        <option value="">-- 동 선택 --</option>
        <option v-for="n in neighborhoods" :key="n" :value="n">{{ n }}</option>
      </select>
    </label>

    <label>
      정류소명 검색:
      <input
          :value="filter"
          @input="e => emit('update:filter', e.target.value)"
          placeholder="정류소명 입력"
      />
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { publicApi } from '@/api/axiosInstance'

const props = defineProps({
  district: String,
  neighborhood: String,
  filter: String,
  stops: Array
})

const emit = defineEmits([
  'update:district',
  'update:neighborhood',
  'update:filter',
  'update-stops'
])

const districts = ref([])
const neighborhoods = ref([])

onMounted(fetchDistricts)

function fetchDistricts() {
  publicApi.get('/api/bus-info/districts').then(res => {
    districts.value = res.data
  })
}

function onDistrictChange(newDistrict) {
  emit('update:district', newDistrict)
  emit('update:neighborhood', '') // 동 초기화
  neighborhoods.value = []

  fetchNeighborhoods(newDistrict)
  fetchBusStops(newDistrict, '')
}

function onNeighborhoodChange(newNeighborhood) {
  emit('update:neighborhood', newNeighborhood)
  fetchBusStops(props.district, newNeighborhood)
}

function fetchNeighborhoods(district) {
  if (!district) return
  publicApi.get('/api/bus-info/neighborhoods', {
    params: { district },
  }).then(res => {
    neighborhoods.value = res.data
  })
}

function fetchBusStops(district, neighborhood) {
  if (!district) return

  const params = { district }
  if (neighborhood) params.neighborhood = neighborhood

  publicApi.get('/api/bus-info/search', { params }).then(res => {
    emit('update-stops', res.data)
  })
}
</script>

<style scoped>
@import "@/modules/board/assets/busStopInfo.css";
</style>
