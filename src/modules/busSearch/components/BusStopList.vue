<template>
  <div class="bus-stop-list">
    <div
        v-for="stop in stops"
        :key="stop.bsId"
        class="bus-stop-item"
        @click="$emit('selectStop', stop)"
    >
      <!-- 이름 + 버튼 한 줄 정렬 -->
      <div class="header-row">
        <strong class="stop-name" :title="stop.bsNm">{{ stop.bsNm }}</strong>
        <div class="buttons">
          <button @click.stop="$emit('selectAsStart', stop)" class="icon-button" title="출발지 선택">
            <img src="/images/start_icon.png" alt="출발" />
          </button>
          <button @click.stop="$emit('selectAsEnd', stop)" class="icon-button" title="도착지 선택">
            <img src="/images/arrival_icon.png" alt="도착" />
          </button>
        </div>
      </div>

      <!-- 도착 정보 -->
      <div v-if="openedStopId === stop.bsId" class="arrival-info">
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
          <li v-if="arrivalDataMap[stop.bsId]?.length === 0" class="arrival-empty">
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

defineEmits(['selectStop', 'selectAsStart', 'selectAsEnd'])
</script>

<style scoped>
.bus-stop-list {
  padding: 0 20px;
}

.bus-stop-item {
  padding: 18px 18px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  border-radius: 8px;
  background: #fff;
  transition: background 0.2s;
  cursor: pointer;
}

.bus-stop-item:hover {
  background: #f8f8f8;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stop-name {
  font-size: 17px;
  color: #4889cd;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 80px); /* 버튼 영역 확보 */
}

.buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.icon-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.icon-button img {
  width: 26px;
  height: 26px;
}

.arrival-info {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #ccc;
}

.arrival-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.arrival-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid #eee;
  font-size: 15px;
}

.arrival-text {
  color: #555;
}

.arrival-empty {
  font-size: 14px;
  color: #999;
  padding-top: 5px;
}
</style>
