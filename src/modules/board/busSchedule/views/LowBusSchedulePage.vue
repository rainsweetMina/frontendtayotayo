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
import api from '@/api/axiosInstance'
import ScheduleSection from '../components/ScheduleSection.vue'

const routeNo = ref('')
const routeNos = ref([])
const scheduleSections = ref([])
const activeIndex = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/api/route-nos-low')
    routeNos.value = res.data
  } catch (e) {
    console.error('❌ 저상버스 노선 번호 불러오기 실패:', e)
    alert('노선 목록을 불러오는 데 실패했습니다.')
  }
})

const fetchSchedules = async () => {
  if (!routeNo.value) return
  scheduleSections.value = []
  activeIndex.value = null

  try {
    const notesRes = await api.get(`/api/route-notes`, { params: { routeNo: routeNo.value } })
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
      ? await api.get('/api/route-id/by-movedir', { params: { routeNo, moveDir } })
      : await api.get('/api/route-id', { params: { routeNo, routeNote } })
  const routeId = routeIdRes.data
  if (!routeId) return

  const headerRes = await api.get('/api/schedule-header', {
    params: { routeId, ...(moveDir !== null && { moveDir }) }
  })
  const header = headerRes.data
  if (!Array.isArray(header) || !header.length) return

  const mapRes = await api.get('/api/route-map', {
    params: { routeId, ...(moveDir !== null && { moveDir }) }
  })
  const map = mapRes.data

  const scheduleParams = { routeNo }
  if (routeNote) scheduleParams.routeNote = routeNote
  if (moveDir !== null) scheduleParams.moveDir = moveDir
  const scheduleRes = await api.get('/api/schedules', { params: scheduleParams })
  const schedules = scheduleRes.data.filter(s => s.busTCd === 'D')
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
@import '@/modules/board/assets/schedule.css';
</style>
