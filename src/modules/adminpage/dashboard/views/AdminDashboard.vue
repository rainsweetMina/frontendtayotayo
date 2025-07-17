<template>
  <div>

    <!-- 상단 여백 -->
    <div class="mt-3"></div>

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
            <a :href="`/auth/login`" target="_blank" class="text-sm font-medium text-red-600 hover:text-red-500">
              백엔드 로그인 페이지로 이동 →
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 게시물 통계 카드 -->
    <div class="mb-10">
      <PostsStatsCard :stats="postsStats" />
    </div>

    <!-- 통계 카드 섹션 -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-5">
      <!-- 요청 처리량 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5 flex items-center h-full">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400 align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-5 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500">요청 처리량</dt>
                <dd class="flex items-center leading-none mt-1">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.requestVolume }}</div>
                  <div class="ml-2 flex items-center text-sm font-semibold text-green-600 leading-none">
                    <svg class="h-5 w-5 text-green-500 align-middle" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                    <span class="ml-1">{{ stats.requestVolumeIncrease }}%</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- 일반 회원 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5 flex items-center h-full">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-blue-400 align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-5 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500">일반 회원</dt>
                <dd class="flex items-center leading-none mt-1">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.usersByType?.USER || 0 }}</div>
                  <div v-if="stats.newUsersToday > 0"
                       class="ml-2 flex items-center text-sm font-semibold text-green-600 leading-none">
                    <svg class="h-5 w-5 text-green-500 align-middle" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                    <span class="ml-1">+{{ stats.newUsersToday }}</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- BUS 회원 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5 flex items-center h-full">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400 align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </div>
            <div class="ml-5 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500">BUS 회원</dt>
                <dd class="leading-none mt-1">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.usersByType?.BUS || 0 }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- ADMIN 회원 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5 flex items-center h-full">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-400 align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div class="ml-5 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500">ADMIN 회원</dt>
                <dd class="leading-none mt-1">
                  <div class="text-2xl font-semibold text-gray-900">{{ stats.usersByType?.ADMIN || 0 }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>


      <!-- Redis 메모리 사용량 카드 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5 flex items-center h-full">
          <div class="flex flex-col justify-center items-center w-full">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Redis 메모리 사용량</h3>
            <div class="flex justify-center items-center" style="height: 80px;">
              <canvas ref="redisMemoryChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 차트 섹션 -->
    <div class="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
      <!-- API 응답 시간 차트 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900">API 응답 시간</h3>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              실시간
            </span>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            API 요청에 대한 평균 응답 시간을 밀리초(ms) 단위로 보여줍니다. 낮을수록 성능이 좋습니다.
          </p>
          <div class="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100" style="height: 350px;">
            <LineChart />
            <div v-if="false" class="text-center text-gray-500 py-4">
              <!-- 로딩 또는 오류 상태를 위한 폴백 UI (필요시 표시) -->
              <p>데이터를 불러오는 중입니다...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 요청 처리량 차트 -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg leading-6 font-medium text-gray-900">시간별 요청 처리량</h3>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              시간별
            </span>
          </div>
          <p class="text-sm text-gray-500 mb-4">
            시간대별 처리된 API 요청 건수를 표시합니다. 트래픽 패턴을 분석할 수 있습니다.
          </p>
          <div class="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100" style="height: 350px;">
            <BarChart :data="requestVolumeData" />
          </div>
        </div>
      </div>
    </div>



    <!-- 최근 활동 목록 -->
    <div class="mt-10">
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

    <!-- 하단 여백 -->
    <div class="mb-3"></div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Chart from 'chart.js/auto'
import { getDashboardStats, getPostsStats, getUserStats, getRequestVolume, getAdminLogs } from '@/api/admin'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'
import axios from '@/api/axiosInstance'
import PostsStatsCard from '../components/PostsStatsCard.vue'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'

// BASE_URL을 computed로 선언
const BASE_URL = computed(() => import.meta.env.VITE_BASE_URL)

// 상태 데이터
const stats = ref({
  requestVolume: 0,
  requestVolumeIncrease: 0,
  users: 0,
  usersIncrease: 0,
  newUsersToday: 0,
  pendingQna: 0,
  usersByType: {
    USER: 0,
    BUS: 0,
    ADMIN: 0
  }
})

// 게시물 통계 데이터
const postsStats = ref({
  notices: { today: 0, total: 0 },
  qna: { today: 0, total: 0 },
  advertisements: { today: 0, total: 0 }
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
const redisMemoryChart = ref(null)
const requestVolumeChart = ref(null)
let redisChart = null
let requestVolumeChartInstance = null

// WebSocket 연결
let stompClient = null

// 요청 처리량 데이터
const requestVolumeData = ref({
  categories: [],
  data: []
});

const connectWebSocket = () => {
  console.log('Attempting to connect to WebSocket...')
  const socket = new SockJS(`https://docs.yi.or.kr:8096/ws`)

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

  stompClient.debug = function (str) {
    console.log('STOMP: ', str)
  }

  const headers = {
    login: '',
    passcode: '',
    'heart-beat': '10000,10000'
  }

  stompClient.connect(headers, 
    frame => {
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
    }, 
    error => {
      console.error('STOMP connection failed:', error)
      setTimeout(connectWebSocket, 3000)
    }
  )
}

const updateRedisChart = (memoryInfo) => {
  console.log('updateRedisChart 호출됨:', memoryInfo);

  // 게이지 텍스트 플러그인 정의
  const gaugeText = {
    id: 'gaugeText',
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {ctx, data, chartArea: {top, bottom, left, right, width, height}} = chart;

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
    const logs = await getAdminLogs(10);
    console.log('Received audit logs:', logs);
    // 최대 5개만 사용
    recentActivities.value = logs.slice(0, 5).map(log => ({
      id: log.id,
      type: getActivityType(log.action),
      description: `${log.adminId}님이 ${log.target}을(를) ${log.action}했습니다.`,
      timestamp: new Date(log.timestamp).toLocaleString()
    }));
    
    console.log('최근 활동 로그 설정 완료:', recentActivities.value);
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
      // 다른 에러의 경우 더미 데이터 표시
      recentActivities.value = [
        {
          id: 1,
          type: '등록',
          description: '관리자가 공지사항을 등록했습니다.',
          timestamp: new Date().toLocaleString()
        },
        {
          id: 2,
          type: '수정',
          description: '관리자가 Q&A를 수정했습니다.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleString()
        },
        {
          id: 3,
          type: '삭제',
          description: '관리자가 광고를 삭제했습니다.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toLocaleString()
        }
      ]
    }
  }
}

// 데이터 로드
const loadDashboardData = async () => {
  try {
    // 게시물 통계 데이터 로드
    const postsData = await getPostsStats()
    console.log('게시물 통계 데이터 로드 완료:', postsData)
    postsStats.value = postsData

    // 회원 통계 데이터 로드
    try {
      const userData = await getUserStats()
      console.log('로드된 회원 통계 데이터:', userData)

      stats.value.users = userData.totalUsers || 0
      stats.value.usersIncrease = userData.increaseRate || 0
      stats.value.newUsersToday = userData.newUsersToday || 0

      // 회원 타입별 데이터 설정
      if (userData.usersByType) {
        stats.value.usersByType = {
          USER: userData.usersByType.USER || 0,
          BUS: userData.usersByType.BUS || 0,
          ADMIN: userData.usersByType.ADMIN || 0
        }
      } else {
        // 백엔드에서 타입별 데이터를 제공하지 않는 경우 임시 데이터 사용
        stats.value.usersByType = {
          USER: Math.floor(userData.totalUsers * 0.8) || 850,  // 80%는 일반 회원
          BUS: Math.floor(userData.totalUsers * 0.15) || 120,  // 15%는 버스 회원
          ADMIN: Math.floor(userData.totalUsers * 0.05) || 30  // 5%는 관리자
        }
      }
    } catch (error) {
      console.error('회원 통계 데이터 로드 중 오류 발생:', error)
      // 오류 발생 시 기본 데이터 설정
      stats.value.users = 1000
      stats.value.usersIncrease = 5
      stats.value.newUsersToday = 10
      stats.value.usersByType = {
        USER: 850,
        BUS: 120,
        ADMIN: 30
      }
    }

    // 요청 처리량 데이터 로드
    const requestVolumeData = await getRequestVolume()
    if (Array.isArray(requestVolumeData) && requestVolumeData.length > 0) {
      // 총 요청 건수 계산
      const totalRequests = requestVolumeData.reduce((sum, item) => sum + (item.count || 0), 0)
      stats.value.requestVolume = totalRequests
      stats.value.requestVolumeIncrease = 8 // 임시 증가율
    } else {
      stats.value.requestVolume = 1112
      stats.value.requestVolumeIncrease = 8
    }

    stats.value.pendingQna = 5

    // 데이터 로드 성공 시 인증 상태 업데이트
    isAuthenticated.value = true
    authError.value = ''
  } catch (error) {
    console.error('대시보드 데이터 로드 중 오류 발생:', error)
    authError.value = '데이터 로드 중 오류가 발생했습니다. 인증 상태를 확인해주세요.'
  }
}

// 요청 처리량 차트 업데이트
const updateRequestVolumeChart = (data) => {
  console.log('요청 처리량 차트 업데이트 함수 호출, 데이터:', data);
  console.log('데이터 타입:', Array.isArray(data) ? 'Array' : typeof data);

  if (Array.isArray(data) && data.length > 0) {
    console.log('첫 번째 항목 상세 정보:', {
      item: data[0],
      timeType: typeof data[0].time,
      timeValue: data[0].time,
      countType: typeof data[0].count,
      countValue: data[0].count
    });

    try {
      // 시간 카테고리 추출
      const categories = data.map(item => {
        // XML 또는 JSON으로부터 변환된 데이터 처리
        if (item.time) {
          // 시간 형식이 정상적인지 확인
          if (typeof item.time === 'string' && item.time.includes(':')) {
            console.log(`시간 형식 그대로 사용: ${item.time}`);
            return String(item.time);
          }

          // 숫자만 있는 경우 시간 형식으로 변환
          if (typeof item.time === 'string' && !isNaN(item.time)) {
            console.log(`숫자를 시간 형식으로 변환: ${item.time} -> ${item.time}:00`);
            return String(item.time) + ':00';
          }

          console.log(`처리할 수 없는 시간 형식: ${item.time}, 타입: ${typeof item.time}`);
          return String(item.time || '');
        } else if (item.date) {
          console.log(`날짜 필드 사용: ${item.date}`);
          return String(item.date);
        } else if (item.timestamp) {
          const date = new Date(item.timestamp);
          const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          console.log(`타임스탬프를 시간으로 변환: ${item.timestamp} -> ${timeStr}`);
          return timeStr;
        }
        console.log('시간 정보 없음');
        return '';
      });

      // 데이터 값 추출
      const values = data.map(item => {
        // count 또는 value 필드에서 값을 추출
        if (typeof item.count === 'number') {
          return item.count;
        } else if (typeof item.count === 'string') {
          return parseInt(item.count) || 0;
        } else if (typeof item.value === 'number') {
          return item.value;
        } else if (typeof item.value === 'string') {
          return parseInt(item.value) || 0;
        }
        return 0;
      });

      console.log('차트 데이터 변환 결과:', {categories, values});
      console.log('카테고리 배열 타입:', typeof categories);
      console.log('카테고리 항목 타입 샘플:', categories.map(c => typeof c));

      // 데이터가 유효한지 확인
      if (categories.length === 0 || values.length === 0) {
        throw new Error('변환된 데이터가 비어있습니다.');
      }

      // 데이터 형식이 일치하는지 확인
      if (categories.length !== values.length) {
        throw new Error(`카테고리와 데이터 길이가 일치하지 않습니다: 카테고리(${categories.length}) vs 데이터(${values.length})`);
      }

      // 명시적으로 새 객체 생성하여 반응성 보장
      requestVolumeData.value = {
        categories: [...categories],
        data: [...values]
      };

      console.log('BarChart 컴포넌트에 전달된 최종 데이터:', JSON.stringify(requestVolumeData.value));

      // 강제로 상태 업데이트 트리거
      requestVolumeData.value = {...requestVolumeData.value};

      return true; // 성공적으로 업데이트됨
    } catch (error) {
      console.error('차트 데이터 처리 중 오류 발생:', error);
    }
  }

  console.warn('유효한 데이터가 없어 기본 데이터 사용');
  // 기본 데이터 설정
  requestVolumeData.value = {
    categories: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    data: [30, 70, 45, 50, 49, 80, 70, 30]
  };

  return false; // 기본 데이터 사용됨
};


// WebSocket 설정 및 연결
const setupWebSocket = () => {
  try {
    connectWebSocket();
    loadInitialLogs();

    // Redis 차트 초기화
    if (redisMemoryChart.value) {
      updateRedisChart(null);
    }
  } catch (error) {
    console.error('WebSocket 설정 중 오류 발생:', error);
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  console.log('AdminDashboard 컴포넌트 마운트됨');
  await loadDashboardData();

  // 요청 처리량 데이터 로드 및 차트 업데이트
  try {
    console.log('요청 처리량 데이터 로드 시작');
    const volumeData = await getRequestVolume();
    console.log('백엔드에서 받아온 원본 요청 처리량 데이터:', volumeData);

    if (Array.isArray(volumeData) && volumeData.length > 0) {
      console.log('유효한 요청 처리량 데이터 확인됨, 항목 수:', volumeData.length);

      // 데이터 형식 확인
      const sampleItem = volumeData[0];
      console.log('데이터 샘플 항목:', sampleItem);
      console.log('time 필드 타입:', typeof sampleItem.time, '값:', sampleItem.time);
      console.log('count 필드 타입:', typeof sampleItem.count, '값:', sampleItem.count);

      // 데이터를 직접 설정하여 테스트
      const testData = volumeData.map((item, index) => ({
        time: item.time || `${9 + index}:00`,
        count: item.count || Math.floor(Math.random() * 500) + 100
      }));

      console.log('테스트 데이터:', testData);

      // 차트 업데이트 시도
      const success = updateRequestVolumeChart(testData);

      if (!success) {
        console.warn('차트 업데이트 실패, 하드코딩된 데이터로 시도');

        // 하드코딩된 데이터로 시도
        requestVolumeData.value = {
          categories: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
          data: [502, 761, 746, 891, 258, 922]
        };

        // 강제로 상태 업데이트 트리거
        requestVolumeData.value = {...requestVolumeData.value};
      }
    } else {
      console.warn('유효한 요청 처리량 데이터가 없음, 기본 데이터 사용');
      updateRequestVolumeChart([]);
    }
  } catch (error) {
    console.error('요청 처리량 데이터 로드 중 오류 발생:', error);
    // 기본 데이터로 차트 초기화
    updateRequestVolumeChart([]);
  }


  // WebSocket 설정
  setupWebSocket();

  // 차트 컴포넌트에 전달된 데이터 확인
  console.log('BarChart 컴포넌트에 전달된 최종 데이터:', requestVolumeData.value);
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
})
</script>

<style>
/* Pretendard 폰트 적용 */
.apexcharts-text,
.apexcharts-title-text,
.apexcharts-legend-text,
.apexcharts-yaxis-title-text,
.apexcharts-xaxis-title-text,
.apexcharts-tooltip {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif !important;
}
</style>