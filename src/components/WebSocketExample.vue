<template>
  <div class="websocket-example">
    <div class="connection-status">
      <h3>WebSocket 연결 상태</h3>
      <div class="status-indicator" :class="{ connected: isConnected }">
        {{ isConnected ? '연결됨' : '연결 안됨' }}
      </div>
      <button @click="toggleConnection" class="btn">
        {{ isConnected ? '연결 해제' : '연결' }}
      </button>
    </div>

    <div class="redis-stats" v-if="isConnected">
      <h3>Redis 상태 정보</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <label>메모리 사용량:</label>
          <span>{{ redisStats.usedMemory?.toFixed(2) || '-' }} MB</span>
        </div>
        <div class="stat-item">
          <label>최대 메모리:</label>
          <span>{{ redisStats.maxMemory?.toFixed(2) || '-' }} MB</span>
        </div>
        <div class="stat-item">
          <label>연결된 클라이언트:</label>
          <span>{{ redisStats.connectedClients || '-' }}</span>
        </div>
        <div class="stat-item">
          <label>업타임:</label>
          <span>{{ formatUptime(redisStats.uptime) }}</span>
        </div>
      </div>
      <button @click="requestRedisStats" class="btn">Redis 정보 요청</button>
    </div>

    <div class="notifications" v-if="isConnected">
      <h3>시스템 알림</h3>
      <div class="notification-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.timestamp"
          class="notification-item"
          :class="notification.type"
        >
          <span class="time">{{ formatTime(notification.timestamp) }}</span>
          <span class="message">{{ notification.message }}</span>
        </div>
      </div>
    </div>

    <div class="message-sender" v-if="isConnected">
      <h3>메시지 전송</h3>
      <div class="input-group">
        <input 
          v-model="messageText" 
          @keyup.enter="sendMessage"
          placeholder="메시지를 입력하세요..."
          class="input"
        />
        <button @click="sendMessage" class="btn">전송</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWebSocket } from '@/composables/useWebSocket'

// WebSocket composable 사용
const {
  isConnected,
  connect,
  disconnect,
  subscribe,
  send,
  onConnect,
  onDisconnect,
  onError
} = useWebSocket()

// 상태 데이터
const redisStats = ref({})
const notifications = ref([])
const messageText = ref('')

// 구독 객체들
let redisSubscription = null
let notificationSubscription = null

// 연결 토글
const toggleConnection = () => {
  if (isConnected.value) {
    disconnect()
  } else {
    connect()
  }
}

// Redis 정보 요청
const requestRedisStats = () => {
  send('/app/request-redis-stats', {})
}

// 메시지 전송
const sendMessage = () => {
  if (messageText.value.trim()) {
    send('/app/admin-activity', {
      action: 'message',
      content: messageText.value,
      user: 'admin'
    })
    messageText.value = ''
  }
}

// 업타임 포맷팅
const formatUptime = (seconds) => {
  if (!seconds) return '-'
  
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) {
    return `${days}일 ${hours}시간 ${minutes}분`
  } else if (hours > 0) {
    return `${hours}시간 ${minutes}분`
  } else {
    return `${minutes}분`
  }
}

// 시간 포맷팅
const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleTimeString()
}

// 연결 성공 시 구독 설정
onConnect.value = () => {
  console.log('WebSocket 연결됨, 구독 시작...')
  
  // Redis 상태 정보 구독
  redisSubscription = subscribe('/topic/redis-memory', (data) => {
    console.log('Redis 상태 정보 수신:', data)
    redisStats.value = data
  })
  
  // 시스템 알림 구독
  notificationSubscription = subscribe('/topic/system-notifications', (data) => {
    console.log('시스템 알림 수신:', data)
    notifications.value.unshift(data)
    
    // 최근 10개만 유지
    if (notifications.value.length > 10) {
      notifications.value = notifications.value.slice(0, 10)
    }
  })
}

// 연결 해제 시 구독 정리
onDisconnect.value = () => {
  console.log('WebSocket 연결 해제됨')
  redisStats.value = {}
  notifications.value = []
}

// 오류 처리
onError.value = (error) => {
  console.error('WebSocket 오류:', error)
  notifications.value.unshift({
    message: 'WebSocket 연결 오류가 발생했습니다.',
    type: 'error',
    timestamp: Date.now()
  })
}

// 컴포넌트 마운트 시 자동 연결
onMounted(() => {
  connect()
})
</script>

<style scoped>
.websocket-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.connection-status {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.status-indicator {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  background: #dc3545;
  color: white;
  margin: 10px 0;
}

.status-indicator.connected {
  background: #28a745;
}

.redis-stats {
  background: #e9ecef;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 15px 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.notifications {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.notification-item.info {
  background: #d1ecf1;
  border-left-color: #17a2b8;
}

.notification-item.warning {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.notification-item.error {
  background: #f8d7da;
  border-left-color: #dc3545;
}

.notification-item .time {
  font-size: 0.8em;
  color: #6c757d;
  margin-right: 10px;
}

.message-sender {
  background: #e9ecef;
  padding: 20px;
  border-radius: 8px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
}

.btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background: #0056b3;
}

h3 {
  margin-top: 0;
  color: #495057;
}
</style> 