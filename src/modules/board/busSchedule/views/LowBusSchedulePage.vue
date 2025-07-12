<template>
  <div class="schedule-page-container">
    <h2 class="schedule-title">저상버스 시간표</h2>

    <div class="selector-container">
      <div class="selector-box">
        <label for="routeNo">노선 선택</label>
        <select id="routeNo" v-model="routeNo" @change="fetchSchedules">
          <option value="" disabled selected>노선 선택</option>
          <option v-for="no in routeNos" :key="no" :value="no">{{ no }}</option>
        </select>
      </div>
    </div>

    <div class="schedule-tab-group" v-if="scheduleSections.length">
      <button
          v-for="(section, idx) in scheduleSections"
          :key="idx"
          class="route-toggle-btn"
          :class="{ active: activeIndex === idx }"
          @click="activeIndex = activeIndex === idx ? null : idx"
      >
        {{ activeIndex === idx ? '▼' : '▶' }} {{ (section.title || '').replaceAll('_', ' ') }}
      </button>
    </div>

    <ScheduleSection
        v-if="activeIndex !== null"
        :header="scheduleSections[activeIndex].header"
        :schedules="scheduleSections[activeIndex].schedules"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { publicApi } from '@/api/axiosInstance'
import ScheduleSection from '../components/ScheduleSection.vue'

const routeNo = ref('')
const routeNos = ref([])
const scheduleSections = ref([])
const activeIndex = ref(null)

onMounted(async () => {
  try {
    const res = await publicApi.get('/api/route-nos-low')
    routeNos.value = res.data
  } catch (e) {
    // 로그인 필요 에러가 발생해도 빈 배열로 처리
    routeNos.value = []
    if (e.message === '로그인 필요') {
      console.warn('⚠️ 로그인 없이 접근 - 저상버스 노선 목록을 불러올 수 없습니다')
    } else if (e.message === 'Network Error') {
      console.warn('⚠️ 서버 연결 실패 - 저상버스 노선 목록을 불러올 수 없습니다')
    } else {
      console.error('❌ 저상버스 노선 번호 불러오기 실패:', e)
    }
  }
})

const fetchSchedules = async () => {
  if (!routeNo.value) return
  scheduleSections.value = []
  activeIndex.value = null

  try {
    const notesRes = await publicApi.get(`/api/route-notes`, { params: { routeNo: routeNo.value } })
    const routeNotes = notesRes.data.filter(n => n && n.trim() !== '')

    if (routeNotes.length) {
      for (const note of routeNotes) {
        await loadSchedule(routeNo.value, note, null)
      }
    } else {
      for (const dir of [0, 1]) {
        await loadSchedule(routeNo.value, '', dir)
      }
    }
  } catch (e) {
    console.error('❌ 스케줄 조회 실패:', e)
  }
}

const loadSchedule = async (routeNo, routeNote = '', moveDir = null) => {
  const routeIdRes = moveDir !== null
      ? await publicApi.get('/api/route-id/by-movedir', { params: { routeNo, moveDir } })
      : await publicApi.get('/api/route-id', { params: { routeNo, routeNote } })
  const routeId = routeIdRes.data
  if (!routeId) return

  const headerRes = await publicApi.get('/api/schedule-header', {
    params: { routeId, ...(moveDir !== null && { moveDir }) }
  })
  const header = headerRes.data
  if (!Array.isArray(header) || !header.length) return

  const mapRes = await publicApi.get('/api/route-map', {
    params: { routeId, ...(moveDir !== null && { moveDir }) }
  })
  const map = mapRes.data

  const lowBusParams = { routeId }
  if (moveDir !== null && moveDir !== undefined) lowBusParams.moveDir = moveDir

  const scheduleRes = await publicApi.get('/api/lowbus-scheduls', { params: lowBusParams })
  const schedules = scheduleRes.data
  if (!schedules.length) return

  const headerNames = header.map((seq, idx) => {
    const stop = map.find(s => s.seq === seq)
    if (idx === 0) return stop?.bsNm || '출발'
    if (idx === header.length - 1) return stop?.bsNm || '도착'
    return stop?.bsNm || `중간${idx}`
  })

  scheduleSections.value.push({
    title: routeNote || (moveDir === 0 ? '정방향' : '역방향'),
    header: headerNames,
    schedules
  })
}
</script>

<style scoped>
@import '../../assets/schedule.css';
</style>
