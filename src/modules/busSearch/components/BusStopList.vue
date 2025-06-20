<template>
  <div class="px-5">
    <div
        v-for="stop in stops"
        :key="stop.bsId"
        class="p-[18px] border border-gray-200 mb-2.5 rounded-lg bg-white transition-colors cursor-pointer hover:bg-gray-50"
        @click="$emit('selectStop', stop)"
    >
      <!-- 이름 + 버튼 한 줄 정렬 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 max-w-[calc(100%-110px)] overflow-hidden">
          <button
              @click.stop="toggleFavorite(stop)"
              class="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center"
              :title="isFavorited(stop.bsId) ? '즐겨찾기 제거' : '즐겨찾기 추가'"
          >
            <span class="text-[22px] leading-none align-middle transition-colors" 
                  :class="isFavorited(stop.bsId) ? 'text-amber-400' : 'text-gray-300 hover:text-gray-400'">★</span>
          </button>
          <strong class="text-[17px] text-blue-600 font-bold whitespace-nowrap overflow-hidden text-ellipsis" :title="stop.bsNm">{{ stop.bsNm }}</strong>
        </div>
        <div class="flex gap-2 flex-shrink-0">
          <button @click.stop="$emit('selectAsStart', stop)" class="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center" title="출발지 선택">
            <img :src="startIcon" alt="출발" class="w-[26px] h-[26px]"/>
          </button>
          <button @click.stop="$emit('selectAsEnd', stop)" class="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center" title="도착지 선택">
            <img :src="arrivalIcon" alt="도착" class="w-[26px] h-[26px]"/>
          </button>
        </div>
      </div>

      <!-- 도착 정보 -->
      <div v-if="openedStopId === stop.bsId" class="mt-3 pt-2.5 border-t border-dashed border-gray-300">
        <ul class="list-none p-0 m-0">
          <li
              v-for="bus in arrivalDataMap[stop.bsId]"
              :key="bus.routeNo"
              class="flex justify-between py-1 border-b border-gray-100 text-[15px]"
          >
            <strong>{{ bus.routeNo }}</strong>
            <span class="text-gray-600">
              {{ bus.arrList?.[0]?.arrState || '도착 정보 없음' }}
            </span>
          </li>
          <li v-if="arrivalDataMap[stop.bsId]?.length === 0" class="text-sm text-gray-500 pt-1.5">
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
  max-width: calc(100% - 110px); /* 버튼 영역 고려 */
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
  gap: 8px;
  flex-shrink: 0;
}

.favorite-button,
.icon-button {
  background: none;
  border: none;
  padding: 0;
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
