<template>
  <div class="scroll-container">
    <button class="scroll-arrow top"
            @mousedown="startScroll('up')"
            @touchstart.prevent="startScroll('up')"
            @mouseup="stopScroll"
            @mouseleave="stopScroll"
            @touchend="stopScroll">
      ▲
    </button>

    <div class="route-list" ref="scrollBox">
      <div
          v-for="(stop, index) in routeMapData"
          :key="stop.seq"
          class="stop-card"
      >
        <div class="marker" :class="getMarkerClass(stop.seq)">
          <div class="dot"></div>
          <div v-if="index < routeMapData.length - 1" class="line"></div>
        </div>
        <div class="info">
          <div class="stop-name">{{ stop.bsNm }}</div>
          <div class="stop-seq">#{{ stop.seq }}</div>
        </div>
      </div>
    </div>

    <button class="scroll-arrow bottom"
            @mousedown="startScroll('down')"
            @touchstart.prevent="startScroll('down')"
            @mouseup="stopScroll"
            @mouseleave="stopScroll"
            @touchend="stopScroll">
      ▼
    </button>
  </div>
</template>


<script setup>
import { ref, watch } from 'vue'
import api from '@/api/axiosInstance'

const props = defineProps({
  routeId: String,
  moveDir: String
})

const routeMapData = ref([])
const scrollBox = ref(null)
let scrollTimer = null

function getMarkerClass(seq) {
  const seqs = routeMapData.value.map(s => s.seq)
  const min = Math.min(...seqs)
  const max = Math.max(...seqs)
  if (seq === min) return 'start'
  if (seq === max) return 'end'
  return ''
}

// 스크롤 조작
function startScroll(direction) {
  stopScroll() // 중복 방지
  scrollTimer = setInterval(() => {
    if (!scrollBox.value) return
    scrollBox.value.scrollTop += direction === 'down' ? 10 : -10
  }, 16) // 약 60fps
}

function stopScroll() {
  clearInterval(scrollTimer)
  scrollTimer = null
}

watch(
    [() => props.routeId, () => props.moveDir],
    async () => {
      if (!props.routeId) return;

      const params = { routeId: props.routeId };
      if (props.moveDir != null) {
        params.moveDir = props.moveDir;
      }

      const res = await api.get('/api/route-map', { params });
      routeMapData.value = res.data;
    },
    { immediate: true }
)

</script>

<style scoped>
.scroll-container {
  max-width: 500px;
  min-width: 300px;
  margin: 24px auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scroll-arrow {
  width: 100%;
  height: 36px;
  background: transparent;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  transition: background 0.2s;
}

.scroll-arrow:hover {
  background: #f1f1f1;
}

.route-list {
  /* max-height: 360px → 높이 늘림 */
  max-height: 500px; /* 또는 height: 56px * 8 */
  min-height: 448px;
  overflow-y: auto;
  padding: 16px 24px;
  width: 100%;

  scrollbar-width: none; /* Firefox */
}

.stop-card {
  display: flex;
  align-items: center; /* ✅ 마커와 텍스트 세로 정렬 맞춤 */
  gap: 12px;
  margin-bottom: 16px;
  height: 56px; /* ✅ 고정 높이 */
}

.marker {
  position: relative;
  width: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* ✅ 마커 정중앙 정렬 */
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #1976d2;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #1976d2;
  z-index: 1;
}

.marker.start .dot {
  background-color: #f57c00;
  box-shadow: 0 0 0 2px #f57c00;
}

.marker.end .dot {
  background-color: #fbc02d;
  box-shadow: 0 0 0 2px #fbc02d;
}

.line {
  width: 2px;
  background-color: #ccc;
  flex-grow: 1;
  margin-top: 4px;
  height: 100%;
}

.info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stop-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  word-break: keep-all;
}

.stop-seq {
  font-size: 11px;
  color: #aaa;
}

.route-list {
  max-height: 360px;
  overflow-y: auto;
  padding: 16px 20px;
  width: 100%;
  scrollbar-width: none; /* Firefox */
}

.route-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}
</style>
