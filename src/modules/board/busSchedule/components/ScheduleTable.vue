<template>
  <div class="schedule-view">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-message">
      <p>시간표를 불러오는 중...</p>
    </div>
    
    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="retryLoad" class="retry-btn">다시 시도</button>
    </div>
    
    <!-- 빈 데이터 상태 -->
    <div v-else-if="!schedules.length || !orderedStops.length" class="empty-message">
      <p>표시할 시간표가 없습니다.</p>
      <p>노선과 방면(또는 방향)을 선택해주세요.</p>
    </div>
    
    <!-- 정상 데이터 표시 -->
    <table v-else class="schedule-table">
      <thead>
        <tr>
          <th>순서</th>
          <th v-for="seq in orderedStops" :key="seq">{{ getStopName(seq) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in schedules" :key="index">
          <td>{{ row.scheduleNo }}</td>
          <td v-for="(seq, idx) in orderedStops" :key="idx">
            {{ formatTime(row[`schedule_${String.fromCharCode(65 + idx)}`]) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script setup>
import { ref, watch, computed } from 'vue'
import api from '@/api/axiosInstance'

const props = defineProps({
  routeId: {
    type: String,
    default: ''
  },
  moveDir: {
    type: [String, Number],
    default: null
  },
  selectedStops: {
    type: Array,
    default: () => []
  },
  routeNo: {
    type: String,
    default: ''
  },
  routeNote: {
    type: String,
    default: ''
  }
})

const schedules = ref([])
const stopMap = ref({})
const isLoading = ref(false)
const error = ref('')

// 정렬된 정류장 순서
const orderedStops = computed(() => {
  return [...props.selectedStops].sort((a, b) => a - b)
})

// 정류장 이름 로딩 함수
async function loadStopNames() {
  if (!props.routeId || (props.moveDir == null && !props.routeNote)) return
  
  try {
    const res = await api.get('/api/route-map', {
      params: {
        routeId: props.routeId,
        ...(props.moveDir != null && { moveDir: props.moveDir })
      }
    })
    stopMap.value = Object.fromEntries(res.data.map(s => [s.seq, s.bsNm]))
  } catch (err) {
    console.error('🛑 정류장 이름 로딩 실패:', err)
    error.value = '정류장 정보를 불러오는데 실패했습니다.'
  }
}

// 시간표 로딩 함수
async function loadSchedules() {
  if (!props.routeNo || (!props.routeNote && props.moveDir == null)) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const params = {
      routeNo: props.routeNo,
      ...(props.routeNote ? { routeNote: props.routeNote } : {}),
      ...(props.moveDir != null ? { moveDir: props.moveDir } : {})
    }

    const res = await api.get('/api/schedules', { params })
    schedules.value = res.data || []
  } catch (err) {
    console.error('🛑 시간표 로딩 실패:', err)
    schedules.value = []
    error.value = '시간표를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 다시 시도 함수
async function retryLoad() {
  await Promise.all([loadStopNames(), loadSchedules()])
}

// routeId 또는 moveDir 변경 시 정류장 이름 조회
watch(
    () => [props.routeId, props.moveDir, props.routeNote],
    loadStopNames,
    { immediate: true }
)

// routeNo, routeNote, moveDir 변경 시 시간표 조회
watch(
    () => [props.routeNo, props.routeNote, props.moveDir],
    loadSchedules,
    { immediate: true }
)

function getStopName(seq) {
  return stopMap.value[seq] || `정류장(${seq})`
}

function formatTime(timeStr) {
  if (!timeStr) return '-'
  // 시간 형식이 HH:MM 형태인지 확인
  if (typeof timeStr === 'string' && timeStr.includes(':')) {
    return timeStr
  }
  // 숫자로 된 시간을 HH:MM 형식으로 변환
  if (typeof timeStr === 'number') {
    const hours = Math.floor(timeStr / 100)
    const minutes = timeStr % 100
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
  return timeStr
}
</script>

<style scoped>
@import "../../assets/schedule.css";

.loading-message,
.error-message,
.empty-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.loading-message p {
  font-size: 16px;
  margin: 0;
}

.error-message {
  color: #d32f2f;
}

.error-message p {
  margin-bottom: 16px;
  font-size: 14px;
}

.retry-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #1565c0;
}

.empty-message p {
  margin: 8px 0;
  font-size: 14px;
}

.empty-message p:first-child {
  font-weight: 600;
  color: #333;
}
</style>
