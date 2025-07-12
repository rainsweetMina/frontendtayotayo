import { ref, onUnmounted } from 'vue'
import SockJS from 'sockjs-client'
import { Stomp } from '@stomp/stompjs'

export function useWebSocket() {
  const isConnected = ref(false)
  const stompClient = ref(null)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000

  // 연결 상태 콜백
  const onConnect = ref(() => {})
  const onDisconnect = ref(() => {})
  const onError = ref(() => {})

  /**
   * WebSocket 연결
   */
  const connect = (url = '/ws') => {
    if (isConnected.value) {
      console.log('이미 연결되어 있습니다.')
      return
    }

    console.log('WebSocket 연결 시도 중...', url)
    
    const socket = new SockJS(url)
    
    socket.onopen = () => {
      console.log('SockJS 연결 성공')
    }

    socket.onclose = (event) => {
      console.log('SockJS 연결 종료:', event)
      isConnected.value = false
      onDisconnect.value()
      
      // 자동 재연결 시도
      if (reconnectAttempts.value < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts.value++
          console.log(`재연결 시도 ${reconnectAttempts.value}/${maxReconnectAttempts}`)
          connect(url)
        }, reconnectDelay)
      }
    }

    socket.onerror = (error) => {
      console.error('SockJS 오류:', error)
      onError.value(error)
    }

    stompClient.value = Stomp.over(socket)
    
    // STOMP 디버그 모드 (개발 환경에서만)
    if (import.meta.env.DEV) {
      stompClient.value.debug = (str) => {
        console.log('STOMP:', str)
      }
    }

    const headers = {
      login: '',
      passcode: '',
      'heart-beat': '10000,10000'
    }

    stompClient.value.connect(headers, 
      (frame) => {
        console.log('STOMP 연결 성공:', frame)
        isConnected.value = true
        reconnectAttempts.value = 0
        onConnect.value(frame)
      },
      (error) => {
        console.error('STOMP 연결 실패:', error)
        isConnected.value = false
        onError.value(error)
      }
    )
  }

  /**
   * WebSocket 연결 해제
   */
  const disconnect = () => {
    if (stompClient.value && isConnected.value) {
      stompClient.value.disconnect(() => {
        console.log('WebSocket 연결 해제 완료')
        isConnected.value = false
        onDisconnect.value()
      })
    }
  }

  /**
   * 메시지 구독
   */
  const subscribe = (destination, callback) => {
    if (!stompClient.value || !isConnected.value) {
      console.error('WebSocket이 연결되지 않았습니다.')
      return null
    }

    try {
      const subscription = stompClient.value.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body)
          callback(data)
        } catch (error) {
          console.error('메시지 파싱 오류:', error)
          callback(message.body)
        }
      })

      console.log(`구독 성공: ${destination}`)
      return subscription
    } catch (error) {
      console.error('구독 실패:', error)
      return null
    }
  }

  /**
   * 메시지 전송
   */
  const send = (destination, message) => {
    if (!stompClient.value || !isConnected.value) {
      console.error('WebSocket이 연결되지 않았습니다.')
      return false
    }

    try {
      const payload = typeof message === 'string' ? message : JSON.stringify(message)
      stompClient.value.send(destination, {}, payload)
      console.log(`메시지 전송 성공: ${destination}`, message)
      return true
    } catch (error) {
      console.error('메시지 전송 실패:', error)
      return false
    }
  }

  /**
   * 구독 해제
   */
  const unsubscribe = (subscription) => {
    if (subscription) {
      subscription.unsubscribe()
      console.log('구독 해제 완료')
    }
  }

  // 컴포넌트 언마운트 시 연결 해제
  onUnmounted(() => {
    disconnect()
  })

  return {
    // 상태
    isConnected,
    
    // 메서드
    connect,
    disconnect,
    subscribe,
    send,
    unsubscribe,
    
    // 콜백 설정
    onConnect,
    onDisconnect,
    onError
  }
} 