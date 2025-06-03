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
    <div class="mt-6">
      <div class="bg-white shadow rounded-lg">
        <div class="px-3 py-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">최근 시스템 활동</h3>
          <div class="mt-3">
            <div class="flow-root">
              <ul class="-my-3 divide-y divide-gray-200">
                <li v-for="activity in recentActivities" :key="activity.id" class="py-3">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <span class="inline-flex items-center justify-center h-7 w-7 rounded-full" :class="getActivityTypeClass(activity.type)">
                        <span class="text-sm font-medium leading-none text-white">{{ activity.type.charAt(0) }}</span>
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ activity.description }}
                      </p>
                      <p class="text-xs text-gray-500">
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
import { ref, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import { getDashboardStats, getApiResponseTimes } from '@/api/admin'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

// 상태 데이터
const stats = ref({
  busRotations: 0,
  busRotationsIncrease: 0,
  users: 0,
  usersIncrease: 0,
  pendingQna: 0
})

// 관리자 활동 로그
const recentActivities = ref([])
const activityColors = {
  '등록': 'bg-green-500',
  '수정': 'bg-blue-500',
  '삭제': 'bg-red-500',
  '작업': 'bg-gray-500'
}

// 차트 참조
const apiResponseChart = ref(null)
const redisMemoryChart = ref(null)
let redisChart = null
let responseTimeChart = null

// WebSocket 연결
let stompClient = null

const connectWebSocket = () => {
  console.log('Attempting to connect to WebSocket...')
  const socket = new SockJS('https://localhost:8081/ws')
  
  socket.onopen = () => {
    console.log('SockJS connection opened')
  }
  
  socket.onclose = (event) => {
    console.log('SockJS connection closed:', event)
    setTimeout(connectWebSocket, 3000)
  }
  
  socket.onerror = (error) => {
    console.error('SockJS error:', error)
  }
  
  stompClient = Stomp.over(socket)
  
  stompClient.debug = function(str) {
    console.log('STOMP: ', str)
  }
  
  const headers = {
    login: '',
    passcode: '',
    'heart-beat': '10000,10000'
  }
  
  stompClient.connect(headers, frame => {
    console.log('STOMP Connected:', frame)
    
    // Redis 메모리 정보 구독
    stompClient.subscribe('/topic/redis-memory', message => {
      console.log('Received Redis memory info:', message.body)
      try {
        const memoryInfo = JSON.parse(message.body)
        updateRedisChart(memoryInfo)
      } catch (error) {
        console.error('Failed to parse Redis memory info:', error, message.body)
      }
    })

    // 관리자 활동 로그 구독
    stompClient.subscribe('/topic/admin-audit-logs', message => {
      try {
        const logEntry = JSON.parse(message.body)
        addActivityLog(logEntry)
      } catch (error) {
        console.error('Failed to parse admin audit log:', error)
      }
    })
  }, error => {
    console.error('STOMP connection failed:', error)
    setTimeout(connectWebSocket, 3000)
  })
}

const updateRedisChart = (memoryInfo) => {
  // 게이지 텍스트 플러그인 정의
  const gaugeText = {
    id: 'gaugeText',
    afterDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data, chartArea: { top, bottom, left, right, width, height } } = chart;

      ctx.save();
      const xCenter = width / 2 + left;
      const yCenter = (height / 2 + top) * 0.9;  // 반원이므로 약간 위로 조정

      // 사용량 텍스트
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#333';
      const usageText = `${memoryInfo.usedMemory.toFixed(2)} MB`;
      ctx.fillText(usageText, xCenter, yCenter);

      // 연결된 클라이언트 수
      ctx.font = '12px Arial';
      ctx.fillStyle = '#888';
      const clientText = `연결된 클라이언트: ${memoryInfo.connectedClients || 0}`;
      ctx.fillText(clientText, xCenter, yCenter + 15);

      ctx.restore();
    }
  };

  if (!redisChart) {
    redisChart = new Chart(redisMemoryChart.value, {
      type: 'doughnut',
      data: {
        labels: ['사용 중', '여유 공간'],
        datasets: [{
          data: [0, 100],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(211, 211, 211, 0.3)'
          ],
          borderWidth: 0,
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          },
          title: {
            display: true,
            text: 'Redis 메모리 사용량',
            position: 'bottom',
            padding: {
              top: 10,
              bottom: 0
            }
          },
          gaugeText: {}
        },
        layout: {
          padding: {
            top: 20
          }
        }
      },
      plugins: [gaugeText]
    })
  }

  // 차트 데이터 업데이트
  const usedMemory = memoryInfo.usedMemory || 0;
  const maxValue = Math.max(1, usedMemory);  // 최소 1MB 설정
  
  redisChart.data.datasets[0].data = [usedMemory, maxValue - usedMemory];
  redisChart.update();
}

// 활동 로그 처리 함수
const addActivityLog = (logEntry) => {
  const activity = {
    id: logEntry.id || Date.now(),
    type: getActivityType(logEntry.action),
    description: `${logEntry.adminId}님이 ${logEntry.target}을(를) ${logEntry.action}했습니다.`,
    timestamp: new Date(logEntry.timestamp).toLocaleString()
  }
  
  recentActivities.value.unshift(activity)
  if (recentActivities.value.length > 5) {  // 최대 5개로 제한
    recentActivities.value.pop()
  }
}

// 활동 타입에 따른 색상 클래스
const getActivityType = (action) => {
  if (action.includes('등록')) return '등록'
  if (action.includes('수정')) return '수정'
  if (action.includes('삭제')) return '삭제'
  return '작업'
}

const getActivityTypeClass = (type) => {
  return activityColors[type] || 'bg-gray-500'
}

// 초기 활동 로그 로드
const loadInitialLogs = async () => {
  try {
    const response = await fetch('https://localhost:8081/api/admin/logs?limit=5')
    const data = await response.json()
    console.log('Received audit logs:', data)

    // 데이터가 content 필드 내에 있는 경우를 처리
    const logs = Array.isArray(data) ? data : (data.content || [])
    
    // 최대 5개만 사용
    recentActivities.value = logs.slice(0, 5).map(log => ({
      id: log.id,
      type: getActivityType(log.action),
      description: `${log.adminId}님이 ${log.target}을(를) ${log.action}했습니다.`,
      timestamp: new Date(log.timestamp).toLocaleString()
    }))
  } catch (error) {
    console.error('Failed to load initial audit logs:', error)
    recentActivities.value = []
  }
}

// 데이터 로드
const loadDashboardData = async () => {
  try {
    const [statsData, apiTimesData] = await Promise.all([
      getDashboardStats(),
      getApiResponseTimes()
    ])
    
    // 통계 데이터 업데이트
    stats.value = {
      busRotations: statsData.busRotations || 0,
      busRotationsIncrease: statsData.busRotationsIncrease || 0,
      users: statsData.users || 0,
      usersIncrease: statsData.usersIncrease || 0,
      pendingQna: statsData.pendingQna || 0
    }

    // API 응답 시간 차트 업데이트
    if (apiResponseChart.value) {
      // 기존 차트가 있다면 제거
      if (responseTimeChart) {
        responseTimeChart.destroy()
      }

      console.log('API 응답 시간 데이터:', apiTimesData)

      responseTimeChart = new Chart(apiResponseChart.value, {
        type: 'line',
        data: {
          labels: Array.isArray(apiTimesData) ? apiTimesData.map(item => item.date) : [],
          datasets: [{
            label: '평균 응답 시간 (ms)',
            data: Array.isArray(apiTimesData) ? apiTimesData.map(item => item.averageResponseTime) : [],
            borderColor: 'rgb(59, 130, 246)',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `응답 시간: ${context.parsed.y.toFixed(2)} ms`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: '평균 응답 시간 (ms)'
              }
            },
            x: {
              title: {
                display: true,
                text: '시간'
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

// 컴포넌트 마운트 시 데이터 로드 및 WebSocket 연결
onMounted(() => {
  loadDashboardData()
  loadInitialLogs()
  connectWebSocket()
})

onUnmounted(() => {
  console.log('Component unmounting, disconnecting WebSocket...')
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log('STOMP disconnected')
    })
  }
  if (redisChart) {
    redisChart.destroy()
  }
  if (responseTimeChart) {
    responseTimeChart.destroy()
  }
})
</script> 