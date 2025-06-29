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
        <div class="left-info">
          <button
              @click.stop="toggleFavorite(stop)"
              class="favorite-button"
              :title="isFavorited(stop.bsId) ? '즐겨찾기 제거' : '즐겨찾기 추가'"
          >
            <span class="favorite-icon" :class="{ active: isFavorited(stop.bsId) }">★</span>
          </button>
          <strong class="stop-name" :title="stop.bsNm">{{ stop.bsNm }}</strong>
        </div>
        <div class="buttons">
          <button @click.stop="$emit('selectAsStart', stop)" class="icon-button" title="출발지 선택">
            <img :src="startIcon" alt="출발"/>
          </button>
          <button @click.stop="$emit('selectAsEnd', stop)" class="icon-button" title="도착지 선택">
            <img :src="arrivalIcon" alt="도착"/>
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
import startIcon from '@/assets/icons/start_icon.png'
import arrivalIcon from '@/assets/icons/arrival_icon.png'

defineProps({
  stops: Array,
  openedStopId: String,
  arrivalDataMap: Object,
  isFavorited: Function,
  toggleFavorite: Function
})

defineEmits(['selectStop', 'selectAsStart', 'selectAsEnd'])
</script>

<style scoped>
.bus-stop-list {
  padding: 0 20px;
}

.bus-stop-item {
  padding: 18px;
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

.left-info {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: calc(100% - 150px); /* 버튼 영역 고려 - 더 넓게 조정 */
  overflow: hidden;
}

.stop-name {
  font-size: 17px;
  color: #4889cd;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.buttons {
  display: flex;
  gap: 10px; /* 버튼 간격 늘림 */
  flex-shrink: 0;
}

.favorite-button,
.icon-button {
  background: none;
  border: none;
  padding: 4px; /* 패딩 추가 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-icon {
  font-size: 22px;
  color: #ddd;
  transition: color 0.3s;
  line-height: 1;
  vertical-align: middle;
}

.favorite-icon:hover {
  color: #bbb;
}

.favorite-icon.active {
  color: gold;
}

.icon-button img {
  width: 30px; /* 아이콘 크기 증가 */
  height: 30px; /* 아이콘 크기 증가 */
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
