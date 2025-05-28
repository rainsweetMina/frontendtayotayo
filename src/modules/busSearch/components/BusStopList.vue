<template>
  <div class="bus-stop-list p-2">
    <div
        v-for="stop in stops"
        :key="stop.bsId"
        class="bus-stop-item"
        @click="$emit('selectStop', stop)"
    >
      <strong>{{ stop.bsNm }}</strong>

      <!-- 도착 정보 영역 -->
      <div v-if="openedStopId === stop.bsId" class="arrival-info my-2">
        <ul class="arrival-list">
          <li
              v-for="bus in arrivalDataMap[stop.bsId]"
              :key="bus.routeNo"
              class="arrival-item"
          >
            <strong>{{ bus.routeNo }}</strong>
            <span class="arrival-text">
              {{ bus.arrList?.[0]?.arrState || '도착 정보 없음' }}
            </span>
          </li>
          <li v-if="arrivalDataMap[stop.bsId]?.length === 0" class="text-muted arrival-empty">
            도착 정보가 없습니다.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stops: Array,
  openedStopId: String,
  arrivalDataMap: Object
})
</script>

<style scoped>
.bus-stop-item {
  color: #4889cd;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.bus-stop-item:hover {
  background: #f0f0f0;
}
.arrival-info {
  margin-top: 10px;
  padding: 10px;
  color: #3a3a3a;
  background: #f9f9f9;
  border-top: 1px dashed #ccc;
}
.arrival-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
.arrival-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}
.arrival-text {
  font-size: 0.9em;
  color: #555;
}
.arrival-empty {
  font-size: 0.9em;
  padding-top: 5px;
}
</style>
