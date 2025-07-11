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

    <!-- 🔸 선택된 방향 표시 -->
    <div class="selector-box" v-if="showSelectedDirection">
      <label>선택된 방향:</label>
      <div class="selected-direction-display">
        <span class="direction-icon">
          {{ localMoveDir === '0' ? '→' : '←' }}
        </span>
        <span class="direction-text">
          {{ localMoveDir === '0' ? '정방향' : '역방향' }}
        </span>
        <button @click="showDirectionModal" class="change-direction-btn">변경</button>
      </div>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="retryLoad" class="retry-btn">다시 시도</button>
    </div>

    <!-- 방향 선택 모달 -->
    <DirectionModal
      :is-visible="isDirectionModalVisible"
      :route-no="localRouteNo"
      :directions="directionOptions"
      @close="closeDirectionModal"
      @confirm="handleDirectionConfirm"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import api from '@/api/axiosInstance'
import DirectionModal from './DirectionModal.vue'

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
const isDirectionModalVisible = ref(false)

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

// 방향 옵션 계산
const directionOptions = computed(() => {
  return moveDirs.value.map(dir => ({
    value: dir,
    label: dir === '0' ? '정방향' : dir === '1' ? '역방향' : dir,
    description: dir === '0' ? '기점 → 종점 방향' : dir === '1' ? '종점 → 기점 방향' : '기타 방향'
  }))
})

// 선택된 방향 표시 여부
const showSelectedDirection = computed(() => {
  return showMoveDir.value && localMoveDir.value
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
      // 방면 없으면 방향 정보 로딩 후 모달 표시
      const dirRes = await api.get('/api/route-id/movedirs', {
        params: { routeNo: localRouteNo.value }
      })
      moveDirs.value = dirRes.data
      showMoveDir.value = true
      showRouteNote.value = false
      
      // 방향이 있으면 모달 표시
      if (moveDirs.value.length > 0) {
        isDirectionModalVisible.value = true
      }
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

// 모달 관련 함수들
function showDirectionModal() {
  isDirectionModalVisible.value = true
}

function closeDirectionModal() {
  isDirectionModalVisible.value = false
}

function handleDirectionConfirm(direction) {
  localMoveDir.value = direction
  emit('update:moveDir', direction)
  isDirectionModalVisible.value = false
  
  // 방향 선택 후 routeId 조회
  handleNoteOrDirChange()
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

.selected-direction-display {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background-color: #f0f8ff;
  border: 1px solid #1976d2;
  border-radius: 6px;
  min-height: 34px;
}

.direction-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1976d2;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
}

.direction-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.change-direction-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.change-direction-btn:hover {
  background-color: #1565c0;
}
</style>
