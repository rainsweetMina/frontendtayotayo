<template>
  <div class="selector-container">
    <!-- 🔸 노선 선택 -->
    <div class="selector-box">
      <label for="routeNo">노선 선택:</label>
      <select 
        id="routeNo" 
        v-model="localRouteNo" 
        @change="handleRouteChange"
        :disabled="isLoadingRouteNos"
      >
        <option value="" disabled>
          {{ isLoadingRouteNos ? '노선 목록 로딩 중...' : '노선 선택' }}
        </option>
        <option v-for="no in routeNos" :key="no" :value="no">{{ no }}</option>
      </select>
      <div v-if="isLoadingRouteNos" class="loading-indicator">로딩 중...</div>
    </div>

    <!-- 🔸 방면 선택 -->
    <div class="selector-box" v-if="showRouteNote">
      <label for="routeNote">방면 선택:</label>
      <select 
        id="routeNote" 
        v-model="localRouteNote" 
        @change="handleNoteOrDirChange"
        :disabled="isLoadingRouteData"
      >
        <option value="" disabled>
          {{ isLoadingRouteData ? '방면 목록 로딩 중...' : '방면 선택' }}
        </option>
        <option v-for="note in routeNotes" :key="note" :value="note">{{ note }}</option>
      </select>
    </div>

    <!-- 🔸 방향 선택 -->
    <div class="selector-box" v-if="showMoveDir">
      <label for="moveDir">방향 선택:</label>
      <select 
        id="moveDir" 
        v-model="localMoveDir" 
        @change="handleNoteOrDirChange"
        :disabled="isLoadingRouteData"
      >
        <option value="" disabled>
          {{ isLoadingRouteData ? '방향 목록 로딩 중...' : '방향 선택' }}
        </option>
        <option v-for="dir in moveDirs" :key="dir" :value="dir">
          {{ dir === '0' ? '정방향' : dir === '1' ? '역방향' : dir }}
        </option>
      </select>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="retryLoad" class="retry-btn">다시 시도</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/api/axiosInstance'

const emit = defineEmits(['update:routeNo', 'update:routeNote', 'update:moveDir', 'route-id-updated'])

const props = defineProps({
  routeNo: {
    type: String,
    default: ''
  },
  routeNote: {
    type: String,
    default: ''
  },
  moveDir: {
    type: String,
    default: ''
  }
})

const localRouteNo = ref(props.routeNo || '')
const localRouteNote = ref(props.routeNote || '')
const localMoveDir = ref(props.moveDir || '')

const routeNos = ref([])
const routeNotes = ref([])
const moveDirs = ref([])

const showRouteNote = ref(false)
const showMoveDir = ref(false)
const isLoadingRouteNos = ref(false)
const isLoadingRouteData = ref(false)
const error = ref('')

// Props 변경 감지
watch(() => props.routeNo, (newVal) => {
  localRouteNo.value = newVal || ''
})

watch(() => props.routeNote, (newVal) => {
  localRouteNote.value = newVal || ''
})

watch(() => props.moveDir, (newVal) => {
  localMoveDir.value = newVal || ''
})

// 컴포넌트 마운트 시 노선 목록 로딩
onMounted(() => {
  fetchRouteNos()
})

async function fetchRouteNos() {
  isLoadingRouteNos.value = true
  error.value = ''
  
  try {
    const res = await api.get('/api/route-nos')
    routeNos.value = res.data.sort((a, b) => Number(a) - Number(b))
  } catch (err) {
    console.error('🛑 노선 목록 로딩 실패:', err)
    error.value = '노선 목록을 불러오는데 실패했습니다.'
    routeNos.value = []
  } finally {
    isLoadingRouteNos.value = false
  }
}

async function handleRouteChange() {
  if (!localRouteNo.value) return
  
  emit('update:routeNo', localRouteNo.value)
  localRouteNote.value = ''
  localMoveDir.value = ''
  emit('update:routeNote', '')
  emit('update:moveDir', '')
  
  // 기존 선택 상태 초기화
  showRouteNote.value = false
  showMoveDir.value = false
  routeNotes.value = []
  moveDirs.value = []
  
  isLoadingRouteData.value = true
  error.value = ''
  
  try {
    // 방면 정보 먼저 확인
    const notesRes = await api.get('/api/route-notes', {
      params: { routeNo: localRouteNo.value }
    })
    const notes = notesRes.data.filter(n => n && n.trim() !== '')
    
    if (notes.length > 0) {
      routeNotes.value = notes
      showRouteNote.value = true
      showMoveDir.value = false
    } else {
      // 방면 없으면 방향 정보 로딩
      const dirRes = await api.get('/api/route-id/movedirs', {
        params: { routeNo: localRouteNo.value }
      })
      moveDirs.value = dirRes.data
      showMoveDir.value = true
      showRouteNote.value = false
      localMoveDir.value = ''
    }
  } catch (err) {
    console.error('🛑 노선 정보 로딩 실패:', err)
    error.value = '노선 정보를 불러오는데 실패했습니다.'
    showRouteNote.value = false
    showMoveDir.value = false
  } finally {
    isLoadingRouteData.value = false
  }
}

// 🚩 방면 또는 방향 선택 시 routeId 조회
async function handleNoteOrDirChange() {
  if (!localRouteNo.value) return
  
  emit('update:routeNote', localRouteNote.value)
  emit('update:moveDir', localMoveDir.value)

  const isMoveDir = showMoveDir.value
  const selectedValue = isMoveDir ? localMoveDir.value : localRouteNote.value
  
  if (!selectedValue) return
  
  const params = {
    routeNo: localRouteNo.value,
    ...(isMoveDir
        ? { moveDir: selectedValue }
        : { routeNote: selectedValue })
  }

  try {
    const res = await api.get(isMoveDir ? '/api/route-id/by-movedir' : '/api/route-id', {
      params
    })

    const routeId = String(res.data)

    if (routeId.trim() !== '') {
      emit('route-id-updated', {
        routeId,
        moveDir: isMoveDir ? selectedValue : null,
        routeNote: !isMoveDir ? selectedValue : null
      })
    } else {
      console.warn('🚨 routeId 없음:', routeId, 'params:', params)
      error.value = '해당 노선의 경로 ID(routeId)를 찾을 수 없습니다.'
    }
  } catch (err) {
    console.error('🛑 routeId 조회 실패:', err)
    error.value = '경로 정보를 불러오는데 실패했습니다.'
  }
}

// 다시 시도 함수
async function retryLoad() {
  error.value = ''
  await fetchRouteNos()
}
</script>

<style scoped>
@import "@/modules/board/assets/schedule.css";

.loading-indicator {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  font-style: italic;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
  color: #c62828;
}

.error-message p {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.retry-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #1565c0;
}

.selector-box select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
