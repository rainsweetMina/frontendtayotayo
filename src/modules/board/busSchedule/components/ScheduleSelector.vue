<template>
  <div class="selector-container">
    <!-- 🔸 노선 선택 -->
    <div class="selector-box">
      <label for="routeNo">노선 선택:</label>
      <select id="routeNo" v-model="localRouteNo" @change="handleRouteChange">
        <option value="" disabled>노선 선택</option>
        <option v-for="no in routeNos" :key="no" :value="no">{{ no }}</option>
      </select>
    </div>

    <!-- 🔸 방면 선택 -->
    <div class="selector-box" v-if="showRouteNote">
      <label for="routeNote">방면 선택:</label>
      <select id="routeNote" v-model="localRouteNote" @change="handleNoteOrDirChange">
        <option value="" disabled>방면 선택</option>
        <option v-for="note in routeNotes" :key="note" :value="note">{{ note }}</option>
      </select>
    </div>

    <!-- 🔸 방향 선택 -->
    <div class="selector-box" v-if="showMoveDir">
      <label for="moveDir">방향 선택:</label>
      <select id="moveDir" v-model="localMoveDir" @change="handleNoteOrDirChange">
        <option value="" disabled>방향 선택</option>
        <option v-for="dir in moveDirs" :key="dir" :value="dir">
          {{ dir === '0' ? '정방향' : dir === '1' ? '역방향' : dir }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/api/axiosInstance'

const emit = defineEmits(['update:routeNo', 'update:routeNote', 'update:moveDir', 'route-id-updated'])

const props = defineProps({
  routeNo: String,
  routeNote: String,
  moveDir: String
})

const localRouteNo = ref(props.routeNo || '')
const localRouteNote = ref(props.routeNote || '')
const localMoveDir = ref(props.moveDir || '')

const routeNos = ref([])
const routeNotes = ref([])
const moveDirs = ref([])

const showRouteNote = ref(false)
const showMoveDir = ref(false)

// 🚩 노선 목록 초기 불러오기
fetchRouteNos()

async function fetchRouteNos() {
  const res = await api.get('/api/route-nos')
  routeNos.value = res.data.sort((a, b) => Number(a) - Number(b))
}

async function handleRouteChange() {
  emit('update:routeNo', localRouteNo.value)
  localRouteNote.value = ''
  localMoveDir.value = ''
  emit('update:routeNote', '')
  emit('update:moveDir', '')

  const res = await api.get('/api/route-notes', {
    params: { routeNo: localRouteNo.value }
  })
  const notes = res.data.filter(n => n && n.trim() !== '')
  if (notes.length > 0) {
    routeNotes.value = notes
    showRouteNote.value = true
    showMoveDir.value = false
  } else {
    // 방면 없으면 moveDir 로딩
    const dirRes = await api.get('/api/route-id/movedirs', {
      params: { routeNo: localRouteNo.value }
    })
    moveDirs.value = dirRes.data

    // ✅ moveDir이 하나여도 자동 선택하지 않기
    showMoveDir.value = true
    showRouteNote.value = false
    // localMoveDir.value = moveDirs.value.length === 1 ? moveDirs.value[0] : ''
    localMoveDir.value = ''
  }
}

// 🚩 방면 또는 방향 선택 시 routeId 조회
async function handleNoteOrDirChange() {
  emit('update:routeNote', localRouteNote.value)
  emit('update:moveDir', localMoveDir.value)

  const isMoveDir = showMoveDir.value
  const params = {
    routeNo: localRouteNo.value,
    ...(isMoveDir
        ? { moveDir: localMoveDir.value }
        : { routeNote: localRouteNote.value })
  }

  const res = await api.get(isMoveDir ? '/api/route-id/by-movedir' : '/api/route-id', {
    params
  })

  const routeId = String(res.data)

  if (routeId.trim() !== '') {
    emit('route-id-updated', {
      routeId,
      moveDir: isMoveDir ? localMoveDir.value : null,
      routeNote: !isMoveDir ? localRouteNote.value : null
    })
  } else {
    console.warn('🚨 routeId 없음:', routeId, 'params:', params)
    alert('해당 노선의 경로 ID(routeId)를 찾을 수 없습니다.')
  }
}
</script>

<style scoped>
@import "@/modules/board/assets/schedule.css";

</style>
