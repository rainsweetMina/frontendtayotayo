<template>
  <div class="container mx-auto px-4 mt-4">
    <h2 class="text-2xl font-bold mb-4">실시간 버스 도착 정보</h2>

    <div v-if="arrivalData.length > 0">
      <ul class="bg-white rounded-lg divide-y divide-gray-200 shadow">
        <li
            v-for="bus in arrivalData"
            :key="bus.routeNo"
            class="px-4 py-3 flex justify-between items-center"
        >
          <strong class="font-medium">{{ bus.routeNo }}</strong>
          <span class="text-gray-700">{{ getArrivalText(bus) }}</span>
        </li>
      </ul>
    </div>

    <div v-else class="mt-3 text-gray-500">
      도착 정보가 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axiosInstance.js'

const route = useRoute()
const arrivalData = ref([])

onMounted(async () => {
  const bsId = route.query.bsId
  if (!bsId) return

  try {
    const res = await api.get(`/api/bus/bus-arrival`, {
      params: { bsId }
    })
    const items = res.data?.body?.items || []
    arrivalData.value = items

    for (const item of items) {
      console.log(`🧪 [${item.routeNo}] arrList[0]:`, item.arrList?.[0])
    }
  } catch (err) {
    console.error('도착 정보 조회 실패:', err)
    arrivalData.value = []
  }
})

function getArrivalText(bus) {
  if (!bus.arrList || bus.arrList.length === 0) return '운행 정보 없음'

  const info = bus.arrList[0]
  return info.arrState || '도착 메시지 없음'
}
</script>
