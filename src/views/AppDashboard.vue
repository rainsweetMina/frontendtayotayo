<template>
  <div>
    <Breadcrumb breadcrumb="Dashboard" />
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
      <!-- Bus Company Members -->
      <div class="bg-white overflow-hidden shadow rounded-lg p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-md p-3">
            <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="ml-5">
            <div class="text-sm font-medium text-gray-500">버스 회사 회원</div>
            <div class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.busCompanies }}</div>
          </div>
        </div>
      </div>

      <!-- Regular Members -->
      <div class="bg-white overflow-hidden shadow rounded-lg p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-md p-3">
            <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="ml-5">
            <div class="text-sm font-medium text-gray-500">일반 회원</div>
            <div class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.users }}</div>
          </div>
        </div>
      </div>

      <!-- Pending Q&A -->
      <div class="bg-white overflow-hidden shadow rounded-lg p-5">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-5">
            <div class="text-sm font-medium text-gray-500">미처리 Q&A</div>
            <div class="mt-1 text-3xl font-semibold text-gray-900">{{ stats.pendingQna }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- Lost Items Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">분실물 통계</h3>
        <div class="h-64">
          <canvas ref="lostItemsChart"></canvas>
        </div>
      </div>

      <!-- API Response Chart -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">API 응답 시간</h3>
        <div class="h-64">
          <canvas ref="apiResponseChart"></canvas>
        </div>
      </div>

      <!-- Recent Admin Activity Logs -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">최근 관리자 작업</h3>
        <div class="divide-y divide-gray-200 max-h-64 overflow-y-auto">
          <div v-for="log in adminLogs" :key="log.id" class="py-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3',
                    getActionClass(log.action)
                  ]"
                >
                  {{ getActionText(log.action) }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ formatDateTime(log.timestamp) }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                {{ log.adminName }}
              </div>
            </div>
            <p class="mt-1 text-sm text-gray-700">
              {{ log.description }}
            </p>
            <div class="mt-1 text-xs text-gray-500">
              {{ log.category }}
            </div>
          </div>
        </div>
      </div>

      <!-- Redis Cache Usage -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Redis 캐시 사용량</h3>
        <div class="h-64">
          <canvas ref="redisUsageChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Breadcrumb from '../partials/AppBreadcrumb.vue';
import Chart from 'chart.js/auto';

const stats = ref({
  busCompanies: 0,
  users: 0,
  pendingQna: 0
});

const adminLogs = ref([]);
const lostItemsChart = ref(null);
const apiResponseChart = ref(null);
const redisUsageChart = ref(null);

const fetchDashboardData = async () => {
  try {
    const [statsRes, logsRes] = await Promise.all([
      fetch('/api/admin/dashboard/stats'),
      fetch('/api/admin/activity-logs?limit=5')
    ]);
    
    const [statsData, logsData] = await Promise.all([
      statsRes.json(),
      logsRes.json()
    ]);

    stats.value = statsData;
    adminLogs.value = logsData.logs;
  } catch (error) {
    console.error('대시보드 데이터 로딩 실패:', error);
  }
};

const getActionClass = (action) => {
  const classes = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800',
    block: 'bg-red-100 text-red-800',
    unblock: 'bg-green-100 text-green-800',
    match: 'bg-purple-100 text-purple-800',
    activate: 'bg-green-100 text-green-800',
    deactivate: 'bg-red-100 text-red-800'
  };
  return classes[action] || 'bg-gray-100 text-gray-800';
};

const getActionText = (action) => {
  const texts = {
    create: '등록',
    update: '수정',
    delete: '삭제',
    block: '차단',
    unblock: '차단해제',
    match: '매칭',
    activate: '활성화',
    deactivate: '비활성화'
  };
  return texts[action] || action;
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const initCharts = () => {
  // Lost Items Donut Chart
  new Chart(lostItemsChart.value.getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['분류 1', '분류 2', '분류 3'],
      datasets: [{
        data: [18, 16, 10],
        backgroundColor: ['#3B82F6', '#10B981', '#EF4444']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });

  // API Response Line Chart
  new Chart(apiResponseChart.value.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      datasets: [{
        label: '응답 시간 (ms)',
        data: [15, 12, 10, 8, 25, 32, 45, 55, 40, 50, 35, 20],
        borderColor: '#3B82F6',
        tension: 0.4,
        fill: false,
        pointBackgroundColor: '#3B82F6',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '응답 시간 (ms)'
          }
        },
        x: {
          grid: {
            display: false
          },
          title: {
            display: true,
            text: '시간'
          }
        }
      }
    }
  });

  // Redis Cache Usage - Area Chart
  new Chart(redisUsageChart.value.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      datasets: [{
        label: '메모리 사용량 (MB)',
        data: [120, 130, 125, 140, 160, 185, 190, 185, 170, 155, 140, 130],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // 연한 녹색
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#10B981',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '메모리 사용량 (MB)'
          }
        },
        x: {
          grid: {
            display: false
          },
          title: {
            display: true,
            text: '시간'
          }
        }
      }
    }
  });
};

onMounted(() => {
  Promise.all([
    fetchDashboardData(),
    initCharts()
  ]);
});
</script>
