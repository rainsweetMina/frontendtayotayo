<template>
  <div class="container mt-4">
    <h2>실시간 버스 도착 정보</h2>

    <div v-if="arrivalData.length > 0">
      <ul class="list-group">
        <li
            v-for="bus in arrivalData"
            :key="bus.routeNo"
            class="list-group-item d-flex justify-content-between align-items-center"
        >
          <strong>{{ bus.routeNo }}</strong>
          <span>{{ getArrivalText(bus) }}</span>
        </li>
      </ul>
    </div>

    <div v-else class="mt-3 text-muted">
      도착 정보가 없습니다.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const arrivalData = ref([])

onMounted(async () => {
  const bsId = route.query.bsId
  if (!bsId) return

  try {
    const res = await axios.get(`/api/bus/bus-arrival`, {
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
