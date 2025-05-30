<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">관리자 대시보드</h1>
    </div>

    <!-- 통계 카드 섹션 -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- 버스 회차 현황 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">버스 회차 현황</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.busRotations }}</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="sr-only">증가</span>
                    {{ stats.busRotationsIncrease }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- 일반 회원 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">일반 회원</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.users }}</div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="sr-only">증가</span>
                    {{ stats.usersIncrease }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- 미처리 Q&A -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">미처리 Q&A</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.pendingQna }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 차트 섹션 -->
    <div class="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- API 응답 시간 차트 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <h3 class="text-lg leading-6 font-medium text-gray-900">API 응답 시간</h3>
          <div class="mt-2">
            <canvas ref="apiResponseChart" height="200"></canvas>
          </div>
        </div>
      </div>

      <!-- Redis 메모리 사용량 차트 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Redis 메모리 사용량</h3>
          <div class="mt-2">
            <canvas ref="redisMemoryChart" height="200"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- 최근 활동 목록 -->
    <div class="mt-8">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">최근 시스템 활동</h3>
          <div class="mt-4">
            <div class="flow-root">
              <ul class="-my-5 divide-y divide-gray-200">
                <li v-for="activity in recentActivities" :key="activity.id" class="py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <span class="inline-flex items-center justify-center h-8 w-8 rounded-full" :class="getActivityTypeClass(activity.type)">
                        <span class="text-sm font-medium leading-none text-white">{{ activity.type.charAt(0) }}</span>
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ activity.description }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ activity.timestamp }}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'

// 통계 데이터
const stats = ref({
  busRotations: 0,
  busRotationsIncrease: 0,
  users: 0,
  usersIncrease: 0,
  pendingQna: 0
})

// 차트 참조
const apiResponseChart = ref(null)
const redisMemoryChart = ref(null)

// 최근 활동 데이터
const recentActivities = ref([])

// 활동 타입에 따른 색상 클래스
const getActivityTypeClass = (type) => {
  const classes = {
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
    success: 'bg-green-500'
  }
  return classes[type] || 'bg-gray-500'
}

// 데이터 로드
const loadDashboardData = async () => {
  try {
    // API 호출은 나중에 구현
    // const statsResponse = await fetch('/api/admin/dashboard/stats')
    // const statsData = await statsResponse.json()
    // stats.value = statsData

    // const activitiesResponse = await fetch('/api/admin/dashboard/activities')
    // const activitiesData = await activitiesResponse.json()
    // recentActivities.value = activitiesData

    // 임시 데이터로 차트 초기화
    if (apiResponseChart.value) {
      new Chart(apiResponseChart.value, {
        type: 'line',
        data: {
          labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
          datasets: [{
            label: '응답 시간 (ms)',
            data: [12, 19, 3, 5, 2, 3, 20, 33, 23, 12, 15, 10],
            borderColor: 'rgb(59, 130, 246)',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '응답 시간 (ms)'
              }
            }
          }
        }
      })
    }

    if (redisMemoryChart.value) {
      new Chart(redisMemoryChart.value, {
        type: 'line',
        data: {
          labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
          datasets: [{
            label: '메모리 사용량 (MB)',
            data: [256, 270, 265, 280, 295, 310, 315, 320, 310, 290, 285, 280],
            borderColor: 'rgb(34, 197, 94)',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '메모리 사용량 (MB)'
              }
            }
          }
        }
      })
    }
  } catch (error) {
    console.error('대시보드 데이터 로드 중 오류:', error)
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  // 임시 통계 데이터 설정
  stats.value = {
    busRotations: 1234,
    busRotationsIncrease: 12,
    users: 5678,
    usersIncrease: 8,
    pendingQna: 23
  }

  // 임시 활동 데이터 설정
  recentActivities.value = [
    {
      id: 1,
      type: 'info',
      description: '시스템 백업이 완료되었습니다.',
      timestamp: '5분 전'
    },
    {
      id: 2,
      type: 'warning',
      description: '서버 CPU 사용량이 80%를 초과했습니다.',
      timestamp: '15분 전'
    },
    {
      id: 3,
      type: 'success',
      description: '새로운 버스 노선이 추가되었습니다.',
      timestamp: '30분 전'
    },
    {
      id: 4,
      type: 'error',
      description: 'Redis 연결이 일시적으로 끊겼습니다.',
      timestamp: '1시간 전'
    }
  ]

  // nextTick을 사용하여 DOM이 업데이트된 후 차트 초기화
  nextTick(() => {
    loadDashboardData()
  })
})
</script> 