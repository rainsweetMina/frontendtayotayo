<template>
  <div>
<!--    <div class="mb-6">-->
<!--      <h1 class="text-2xl font-semibold text-gray-900">관리자 대시보드</h1>-->
<!--    </div>-->

    <!-- 인증 에러 메시지 -->
    <div v-if="!isAuthenticated && authError" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ authError }}</h3>
          <div class="mt-2">
            <a href="https://localhost:8081/auth/login" target="_blank" class="text-sm font-medium text-red-600 hover:text-red-500">
              백엔드 로그인 페이지로 이동 →
            </a>
          </div>
        </div>
      </div>
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
                        <span class="text-sm font-medium leading-none text-white">{{ getActivityEmoji(activity.type) }}</span>
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

    <!-- 저상버스 대체 안내 관리 메뉴 -->
    <div class="mt-6">
      <div class="bg-white shadow rounded-lg">
        <div class="px-3 py-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">저상버스 안내 관리</h3>
          <div class="mt-3">
            <div class="flow-root">
              <ul class="-my-3 divide-y divide-gray-200">
                <li v-for="notice in notices" :key="notice.id" class="py-3">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <span class="inline-flex items-center justify-center h-7 w-7 rounded-full" :class="getActivityTypeClass(notice.type)">
                        <span class="text-sm font-medium leading-none text-white">{{ getActivityEmoji(notice.type) }}</span>
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ notice.title }}
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ notice.timestamp }}
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
import axios from '@/config/axios'

// 상태 데이터
const stats = ref({
  busRotations: 0,
  busRotationsIncrease: 0,
  users: 0,
  usersIncrease: 0,
  pendingQna: 0
})

// 인증 상태
const isAuthenticated = ref(true)
const authError = ref('')

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
        // 메시지 파싱
        const memoryInfo = typeof message.body === 'string' ? JSON.parse(message.body) : message.body;
        
        // 유효성 검사
        if (!memoryInfo || typeof memoryInfo.usedMemory !== 'number') {
          console.error('유효하지 않은 Redis 메모리 정보:', memoryInfo);
          return;
        }
        
        console.log('처리된 Redis 메모리 정보:', 
          `메모리 사용량=${memoryInfo.usedMemory.toFixed(2)}MB, ` +
          `클라이언트=${memoryInfo.connectedClients}`);
        
        // 차트 업데이트
        updateRedisChart(memoryInfo);
      } catch (error) {
        console.error('Redis 메모리 정보 처리 오류:', error, message.body);
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
  console.log('updateRedisChart 호출됨:', memoryInfo);
  
  // 게이지 텍스트 플러그인 정의
  const gaugeText = {
    id: 'gaugeText',
    afterDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data, chartArea: { top, bottom, left, right, width, height } } = chart;

      ctx.save();
      const xCenter = width / 2 + left;
      const yCenter = (height / 2 + top) * 0.9;  // 반원이므로 약간 위로 조정

      // 메모리 사용량 및 클라이언트 수 가져오기
      let usedMemory = 0;
      let clients = 0;
      
      if (chart.config && chart.config._config && chart.config._config.customData) {
        usedMemory = chart.config._config.customData.usedMemory;
        clients = chart.config._config.customData.clients;
      }

      // 사용량 텍스트
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#333';
      ctx.fillText(`${usedMemory.toFixed(2)} MB`, xCenter, yCenter);
      
      // 연결된 클라이언트 수
      ctx.font = '12px Arial';
      ctx.fillStyle = '#888';
      ctx.fillText(`연결된 클라이언트: ${clients}`, xCenter, yCenter + 15);

      ctx.restore();
    }
  };

  if (!redisChart) {
    // 차트 초기 생성
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
          }
        },
        layout: {
          padding: {
            top: 20
          }
        },
        customData: {
          usedMemory: 0,
          clients: 0
        }
      },
      plugins: [gaugeText]
    });
  }

  // 차트 데이터 업데이트
  if (memoryInfo && typeof memoryInfo.usedMemory === 'number') {
    const usedMemory = memoryInfo.usedMemory;
    const clients = memoryInfo.connectedClients || 0;
    const maxValue = Math.max(1, usedMemory * 2);  // 최소 1MB 설정하고 여유 공간이 보이도록 조정
    
    console.log('차트 업데이트 - 사용 메모리:', usedMemory, 'MB, 최대값:', maxValue, 'MB');
    
    // 커스텀 데이터 저장
    if (redisChart.config && redisChart.config._config) {
      redisChart.config._config.customData = {
        usedMemory: usedMemory,
        clients: clients
      };
    }
    
    // 차트 데이터 업데이트
    redisChart.data.datasets[0].data = [usedMemory, maxValue - usedMemory];
    redisChart.data.datasets[0].backgroundColor = [
      'rgba(54, 162, 235, 0.8)',
      'rgba(211, 211, 211, 0.3)'
    ];
  } else {
    // 데이터가 없을 때는 회색으로만 표시
    redisChart.data.datasets[0].data = [0, 100];
    redisChart.data.datasets[0].backgroundColor = [
      'rgba(211, 211, 211, 0.3)',
      'rgba(211, 211, 211, 0.3)'
    ];
    
    if (redisChart.config && redisChart.config._config) {
      redisChart.config._config.customData = {
        usedMemory: 0,
        clients: 0
      };
    }
  }
  
  // 차트 강제 업데이트
  redisChart.update('none'); // 애니메이션 없이 즉시 업데이트
}

// 활동 로그 처리 함수
const addActivityLog = (logEntry) => {
  // user가 활동한 로그 또는 버스 회사 조회 로그는 제외
  if (logEntry.adminId && 
     (logEntry.adminId.toLowerCase() === 'user' || 
      logEntry.adminId.toLowerCase() === 'anonymoususer')) {
    return;
  }
  
  // 버스 회사 조회 로그 제외
  if (logEntry.action && logEntry.target && 
     (logEntry.action.includes('조회') || logEntry.action.includes('확인') || logEntry.action.includes('검색')) && 
     (logEntry.target.includes('버스') || logEntry.target.includes('Bus') || 
      logEntry.target.includes('bus') || logEntry.target.includes('BusCompany') || 
      logEntry.target.includes('버스회사'))) {
    return;
  }
  
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

// 활동 타입에 따른 이모티콘 반환
const getActivityEmoji = (type) => {
  switch (type) {
    case '등록': return '✨'
    case '수정': return '✏️'
    case '삭제': return '🗑️'
    default: return '⚡'
  }
}

// 초기 활동 로그 로드
const loadInitialLogs = async () => {
  try {
    const response = await axios.get('/api/admin/logs', {
      params: { limit: 10 } // 필터링 후 충분한 로그를 확보하기 위해 더 많이 가져옴
    })
    const data = response.data
    console.log('Received audit logs:', data)

    // 데이터가 content 필드 내에 있는 경우를 처리
    const logs = Array.isArray(data) ? data : (data.content || [])
    
    // user 활동 및 버스 회사 조회 로그 필터링
    const filteredLogs = logs.filter(log => {
      // user 활동 제외
      if (log.adminId && 
         (log.adminId.toLowerCase() === 'user' || 
          log.adminId.toLowerCase() === 'anonymoususer')) {
        return false;
      }
      
      // 버스 회사 조회 로그 제외
      if (log.action && log.target && 
         (log.action.includes('조회') || log.action.includes('확인') || log.action.includes('검색')) && 
         (log.target.includes('버스') || log.target.includes('Bus') || 
          log.target.includes('bus') || log.target.includes('BusCompany') || 
          log.target.includes('버스회사'))) {
        return false;
      }
      
      return true;
    });
    
    // 최대 5개만 사용
    recentActivities.value = filteredLogs.slice(0, 5).map(log => ({
      id: log.id,
      type: getActivityType(log.action),
      description: `${log.adminId}님이 ${log.target}을(를) ${log.action}했습니다.`,
      timestamp: new Date(log.timestamp).toLocaleString()
    }))
  } catch (error) {
    console.error('Failed to load initial audit logs:', error)
    
    // 인증 에러인 경우 표시
    if (error.message === 'Authentication required') {
      isAuthenticated.value = false
      authError.value = '인증이 필요합니다. 다시 로그인해주세요.'
      
      // 더미 데이터 표시
      recentActivities.value = [
        {
          id: 1,
          type: '작업',
          description: '로그인이 필요합니다.',
          timestamp: new Date().toLocaleString()
        }
      ]
    } else {
      // 다른 에러의 경우 빈 배열
      recentActivities.value = []
    }
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
    
    // 데이터 로드 성공 시 인증 상태 업데이트
    isAuthenticated.value = true
    authError.value = ''
  } catch (error) {
    console.error('대시보드 데이터 로드 중 오류:', error)
    
    // 인증 에러인 경우 표시
    if (error.message === 'Authentication required') {
      isAuthenticated.value = false
      authError.value = '인증이 필요합니다. 다시 로그인해주세요.'
    }
  }
}

// 컴포넌트 마운트 시 데이터 로드 및 WebSocket 연결
onMounted(() => {
  loadDashboardData()
  loadInitialLogs()
  connectWebSocket()
  
  // Redis 차트 초기화 (데이터 없이)
  updateRedisChart(null)
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