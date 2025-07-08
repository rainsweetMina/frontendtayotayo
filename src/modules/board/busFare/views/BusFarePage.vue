<template>
  <div class="fare-page-container">
    <h2 class="fare-title">버스 요금 안내</h2>

    <section class="fare-box">
      <FareTable :fares="fares" />
    </section>

    <section class="info-box">
      <TransferInfo />
    </section>

    <section class="info-box info-box-blue">
      <OtherInfo />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { publicApi } from '@/api/axiosInstance'
import FareTable from '../components/FareTable.vue'
import TransferInfo from '../components/TransferInfo.vue'
import OtherInfo from '../components/OtherInfo.vue'

const fares = ref([])

onMounted(async () => {
  const res = await publicApi.get('/api/fares')
  fares.value = res.data
})
</script>

<style scoped>
@import "@/modules/board/assets/routeMap.css";
</style>
