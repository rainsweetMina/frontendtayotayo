<template>
  <div>
    <div class="mt-4">
      <div class="flex flex-wrap -mx-6">
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
            <div class="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
              <svg class="w-8 h-8 text-white" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z" fill="currentColor"/>
                <path d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z" fill="currentColor"/>
                <path d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z" fill="currentColor"/>
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ totalUsers }}</h4>
              <div class="text-gray-500">총 회원수</div>
            </div>
          </div>
        </div>

        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
          <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
            <div class="p-3 bg-blue-600 bg-opacity-75 rounded-full">
              <svg class="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z" fill="currentColor"/>
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ totalLostItems }}</h4>
              <div class="text-gray-500">분실물 신고</div>
            </div>
          </div>
        </div>

        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
          <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
            <div class="p-3 bg-pink-600 bg-opacity-75 rounded-full">
              <svg class="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ totalRoutes }}</h4>
              <div class="text-gray-500">총 노선 수</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <div class="flex flex-wrap -mx-6">
        <div class="w-full px-6 xl:w-1/2">
          <div class="p-5 bg-white rounded-lg shadow-sm">
            <h4 class="text-lg font-semibold text-gray-700">실시간 API 응답 시간</h4>
            <LineChart />
          </div>
        </div>
        <div class="w-full px-6 mt-6 xl:w-1/2 xl:mt-0">
          <div class="p-5 bg-white rounded-lg shadow-sm">
            <h4 class="text-lg font-semibold text-gray-700">Redis 메모리 사용량</h4>
            <AreaChart />
          </div>
        </div>
      </div>

      <div class="flex flex-wrap -mx-6 mt-6">
        <div class="w-full px-6">
          <div class="p-5 bg-white rounded-lg shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-semibold text-gray-700">최근 분실물 신고</h4>
              <router-link to="/admin/lost-items" class="text-blue-600 hover:text-blue-800">
                전체보기
              </router-link>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      날짜
                    </th>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      노선
                    </th>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      물품
                    </th>
                    <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in recentLostItems" :key="item.id">
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {{ formatDate(item.date) }}
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {{ item.routeNo }}
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {{ item.itemName }}
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span :class="getStatusClass(item.status)">
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LineChart from '../components/charts/LineChart.vue'
import AreaChart from '../components/charts/AreaChart.vue'

// 상태 데이터
const totalUsers = ref(0)
const totalLostItems = ref(0)
const totalRoutes = ref(0)
const recentLostItems = ref([])

// 데이터 가져오기
const fetchDashboardData = async () => {
  try {
    // API 호출 예시
    const [usersRes, lostItemsRes, routesRes] = await Promise.all([
      fetch('/api/admin/stats/users'),
      fetch('/api/admin/stats/lost-items'),
      fetch('/api/admin/stats/routes')
    ])
    
    const [usersData, lostItemsData, routesData] = await Promise.all([
      usersRes.json(),
      lostItemsRes.json(),
      routesRes.json()
    ])

    totalUsers.value = usersData.total
    totalLostItems.value = lostItemsData.total
    totalRoutes.value = routesData.total
    recentLostItems.value = lostItemsData.recent
  } catch (error) {
    console.error('대시보드 데이터 로딩 실패:', error)
  }
}

// 유틸리티 함수
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    '접수': 'px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full',
    '처리중': 'px-2 py-1 text-xs text-yellow-600 bg-yellow-100 rounded-full',
    '완료': 'px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full'
  }
  return classes[status] || ''
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchDashboardData()
})
</script> 