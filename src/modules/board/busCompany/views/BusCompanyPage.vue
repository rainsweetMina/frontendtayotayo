<template>
  <div class="fare-page-container">
    <h2 class="fare-title">버스 회사 정보 조회</h2>

    <section class="fare-box">
      <CompanyTable :companies="companies" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { publicApi } from '@/api/axiosInstance'
import CompanyTable from '../components/CompanyTable.vue'

const companies = ref([])

onMounted(async () => {
  const res = await publicApi.get('/api/companies')
  companies.value = res.data
})
</script>

<style scoped>
@import "@/modules/board/assets/routeMap.css";
</style>
