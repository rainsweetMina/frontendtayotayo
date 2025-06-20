<template>
  <div class="search-box">
    <div class="d-flex flex-2 p-3">
      <input
          type="text"
          v-model="store.keyword"
          @keydown.enter="onSearch"
          class="form-control custom-input me-1"
          placeholder="버스 번호/정류장 검색"
          style="flex: 5;"
      />
      <button type="button" @click="onSearch" class="btn btn-primary" style="flex:1;">검색</button>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/stores/searchStore'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const store = useSearchStore()
const route = useRoute()
const emit = defineEmits(['search'])

function onSearch() {
  if (!store.keyword.trim()) return

  store.forceRouteMode = false

  emit('search', {
    keyword: store.keyword,
    newStart: store.startCoord,
    newEnd: store.endCoord
  })
  store.commitSearch()
  store.toggleSidebar(true)
}

// URL 쿼리 파라미터에서 검색어를 가져와 검색창에 표시
onMounted(() => {
  const keyword = route.query.keyword
  if (keyword) {
    store.setKeyword(keyword)
  }
})
</script>

<style scoped>
.custom-input {
  height: 40px !important;
  line-height: 38px;
  padding: 6px 12px;
  font-size: 14px;
}
</style>