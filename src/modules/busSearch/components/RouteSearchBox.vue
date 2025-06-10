<template>
  <div class="search-box p-3">
    <!-- 출발지 -->
    <div class="d-flex mb-1 position-relative">
      <input
          type="text"
          v-model="store.departure"
          @input="showStartDropdown = true"
          @focus="store.selectingField = 'start'; showStartDropdown = true"
          @blur="hideDropdownWithDelay('start')"
          @keydown="onKeydown('start', $event)"
          placeholder="출발지"
          class="form-control me-1 custom-input"
          style="flex: 5;"
      />
      <button @click="swapInputs" class="btn btn-primary" style="flex: 1;">
        <img src="/images/swap_icon.png" alt="전환" style="width: 20px; height: 20px;" />
      </button>

      <ul v-if="showStartDropdown && startSuggestions.length" class="autocomplete-list">
        <li
            v-for="(stop, i) in startSuggestions"
            :key="stop.bsId"
            :class="{ active: i === startActiveIndex }"
            @mousedown.prevent="selectStop('start', stop)"
        >
          {{ stop.bsNm }}
        </li>
      </ul>
    </div>

    <!-- 도착지 -->
    <div class="d-flex position-relative">
      <input
          type="text"
          v-model="store.arrival"
          @input="showEndDropdown = true"
          @focus="store.selectingField = 'end'; showEndDropdown = true"
          @blur="hideDropdownWithDelay('end')"
          @keydown="onKeydown('end', $event)"r
          placeholder="도착지"
          class="form-control me-1 custom-input"
          style="flex: 5;"
      />
      <button @click="searchRoutes" class="btn btn-primary" style="flex: 1;">검색</button>

      <ul v-if="showEndDropdown && endSuggestions.length" class="autocomplete-list">
        <li
            v-for="(stop, i) in endSuggestions"
            :key="stop.bsId"
            :class="{ active: i === endActiveIndex }"
            @mousedown.prevent="selectStop('end', stop)"
        >
          {{ stop.bsNm }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash'
import { useSearchStore } from '@/stores/searchStore'
import { ref, watch } from 'vue'
import axios from 'axios'

const store = useSearchStore()

const startSuggestions = ref([])
const endSuggestions = ref([])
const showStartDropdown = ref(false)
const showEndDropdown = ref(false)
const startActiveIndex = ref(-1)
const endActiveIndex = ref(-1)

const debouncedFetch = debounce(async (type, keyword) => {
  try {
    const { data } = await axios.get('/api/bus/search-bus-stops', {
      params: { keyword }
    })

    const stops = data || []
    if (type === 'start') startSuggestions.value = stops
    else endSuggestions.value = stops
  } catch (e) {
    console.error('자동완성 실패:', e)
  }
}, 200, { leading: true, trailing: true })


function handleStartStopSelect(bs) {
  store.setStartCoord({ lat: bs.yPos, lng: bs.xPos })
  store.setStartBsId(bs.bsId)
}

function handleEndStopSelect(bs) {
  store.setEndCoord({ lat: bs.yPos, lng: bs.xPos })
  store.setEndBsId(bs.bsId)
}

function parseCoords(str) {
  const match = str.match(/^([0-9.]+),\s*([0-9.]+)$/);
  if (!match) return null;
  return { x: parseFloat(match[2]), y: parseFloat(match[1]) }; // [lat, lng] → [y, x]
}

function selectStop(type, stop) {
  if (type === 'start') {
    store.setStartStop(stop)
    store.departure = stop.bsNm
    startSuggestions.value = []
    showStartDropdown.value = false
    startActiveIndex.value = -1
  } else {
    store.setEndStop(stop)
    store.arrival = stop.bsNm
    endSuggestions.value = []
    showEndDropdown.value = false
    endActiveIndex.value = -1
  }
}

function onKeydown(type, event) {
  const suggestions = type === 'start' ? startSuggestions.value : endSuggestions.value
  const index = type === 'start' ? startActiveIndex : endActiveIndex

  if (!suggestions.length) {
    if (type === 'start') showStartDropdown.value = true
    else showEndDropdown.value = true
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    index.value = Math.min(index.value + 1, suggestions.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    index.value = Math.max(index.value - 1, 0)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    const item = suggestions[index.value]
    if (item) selectStop(type, item)
  }
}

function hideDropdownWithDelay(type) {
  setTimeout(() => {
    if (type === 'start') showStartDropdown.value = false
    else showEndDropdown.value = false
  }, 150)
}

function swapInputs() {
  const tempText = store.departure
  const tempStop = store.startStop
  store.departure = store.arrival
  store.arrival = tempText
  store.startStop = store.endStop
  store.endStop = tempStop
}

async function searchRoutes() {
  const startCoord = parseCoords(store.departure)
  const endCoord = parseCoords(store.arrival)

  try {
    // 🟦 출발지가 좌표일 경우 → 주변 정류장 먼저 찾기
    if (startCoord) {
      const res = await axios.get('/api/bus/nearby-stops', {
        params: {
          startX: startCoord.x,
          startY: startCoord.y,
          endX: startCoord.x, // 임시 (필수 파라미터 대응용)
          endY: startCoord.y,
          radius: 200
        }
      })

      const start = res.data.startCandidates?.[0]
      if (!start) {
        alert('출발지 좌표 근처에 정류장이 없습니다.')
        return
      }

      store.setStartStop(start)
      store.departure = start.bsNm
    }

    // 🟥 도착지가 좌표일 경우 → 주변 정류장 먼저 찾기
    if (endCoord) {
      const res = await axios.get('/api/bus/nearby-stops', {
        params: {
          startX: endCoord.x,
          startY: endCoord.y,
          endX: endCoord.x, // 임시 대응
          endY: endCoord.y,
          radius: 200
        }
      })

      const end = res.data.endCandidates?.[0]
      if (!end) {
        alert('도착지 좌표 근처에 정류장이 없습니다.')
        return
      }

      store.setEndStop(end)
      store.arrival = end.bsNm
    }

    // ✅ 정류장 ID가 둘 다 있어야 길찾기 실행
    if (!store.startStop || !store.endStop) {
      alert('출발지와 도착지를 모두 지정해주세요.')
      return
    }

    const { data } = await axios.get('/api/bus/findRoutes', {
      params: {
        startBsId: store.startStop.bsId,
        endBsId: store.endStop.bsId
      }
    })

    store.setRouteResults(data)
  } catch (err) {
    console.error('길찾기 실패:', err)
    alert('길찾기 도중 오류가 발생했습니다.')
  }
}

watch(() => store.departure, (val) => {
  if (store.selectingField !== 'start') return
  if (!val?.trim() || val.trim().length < 1) {
    startSuggestions.value = []
    return
  }
  debouncedFetch('start', val)
})

watch(() => store.arrival, (val) => {
  if (store.selectingField !== 'end') return
  if (!val?.trim() || val.trim().length < 1) {
    endSuggestions.value = []
    return
  }
  debouncedFetch('end', val)
})
</script>

<style scoped>
.custom-input {
  height: 40px !important;
  line-height: 38px;
  padding: 6px 12px;
  font-size: 14px;
}
.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 999;
  background: white;
  border: 1px solid #ccc;
  max-height: 250px;
  overflow-y: auto;
}
.autocomplete-list li {
  padding: 8px 12px;
  cursor: pointer;
}
.autocomplete-list li:hover {
  background: #f0f0f0;
}
.autocomplete-list li.active {
  background-color: #007bff;
  color: white;
}

ul {
  list-style: none;
}
</style>
