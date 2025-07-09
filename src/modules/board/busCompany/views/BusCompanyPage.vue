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
  try {
    const res = await publicApi.get('/api/companies')
    companies.value = res.data
  } catch (e) {
    // 로그인 필요 에러가 발생해도 빈 배열로 처리
    companies.value = []
    if (e.message === '로그인 필요') {
      console.warn('⚠️ 로그인 없이 접근 - 버스회사 정보를 불러올 수 없습니다')
    } else if (e.message === 'Network Error') {
      console.warn('⚠️ 서버 연결 실패 - 버스회사 정보를 불러올 수 없습니다')
    } else {
      console.error('❌ 버스회사 정보 조회 실패:', e)
    }
  }
})
</script>

<style scoped>
@import "@/modules/board/assets/routeMap.css";
</style>
