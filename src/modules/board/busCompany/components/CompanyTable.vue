<template>
  <table class="company-table">
    <thead>
    <tr>
      <th>버스회사명</th>
      <th>주소</th>
      <th>전화번호</th>
      <th>운행노선</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(c, i) in companies" :key="i">
      <td class="company-name">{{ c.companyName }}</td>
      <td>{{ c.companyAddress }}</td>
      <td class="phone">{{ c.companyPhone }}</td>
      <td class="route-cell">
        <span v-for="(r, j) in formatRouteList(c.companyRouteNo)" :key="j" class="route-badge">
          {{ r }}
        </span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({companies: Array})

const formatRoutes = (routes) => {
  if (Array.isArray(routes)) return routes.join(', ')
  return routes ?? ''
}

const formatRouteList = (routes) => {
  if (Array.isArray(routes)) return routes
  return String(routes ?? '')
      .replace(/\[|\]/g, '')         // 대괄호 제거
      .split(',')
      .map(r => r.trim())            // 공백 제거
      .filter(Boolean)               // 빈 값 제거
}
</script>

<style scoped>
@import "@/modules/board/assets/routeMap.css";
</style>