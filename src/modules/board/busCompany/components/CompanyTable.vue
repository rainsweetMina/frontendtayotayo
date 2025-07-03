<template>
  <div class="table-wrapper">
    <!-- 🔽 운행노선 필터만 유지 -->
    <div class="table-filter">
      <label>
        운행노선:
        <select v-model="selectedRoute">
          <option value="">전체</option>
          <option v-for="(route, idx) in routeNumbers" :key="idx" :value="route">
            {{ route }}
          </option>
        </select>
      </label>
    </div>

    <!-- 🔽 테이블 -->
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
      <tr v-for="(c, i) in filteredCompanies" :key="i">
        <td class="company-name">{{ c.companyName }}</td>
        <td>{{ c.companyAddress }}</td>
        <td class="phone">{{ c.companyPhone }}</td>
        <td class="route-cell">
        <span
            v-for="(r, j) in formatRouteList(c.companyRouteNo)"
            :key="j"
            class="route-badge"
        >
          {{ r }}
        </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ companies: Array })

const selectedRoute = ref('')

// 노선번호 목록
const routeNumbers = computed(() =>
    [...new Set(
        props.companies.flatMap(c => formatRouteList(c.companyRouteNo))
    )].sort()
)

// 기본 오름차순 정렬 + 필터링
const filteredCompanies = computed(() => {
  const filtered = props.companies.filter(c => {
    const routeList = formatRouteList(c.companyRouteNo)
    return !selectedRoute.value || routeList.includes(selectedRoute.value)
  })

  return [...filtered].sort((a, b) =>
      a.companyName.toUpperCase().localeCompare(b.companyName.toUpperCase())
  )
})

// 노선 리스트 파싱
const formatRouteList = (routes) => {
  if (Array.isArray(routes)) return routes
  return String(routes ?? '')
      .replace(/\[|\]/g, '')
      .split(',')
      .map(r => r.trim())
      .filter(Boolean)
}
</script>

<style scoped>
@import "@/modules/board/assets/routeMap.css";

.table-filter {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
}

.table-filter select {
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

label {
  font-weight: 500;
}

</style>