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
      <button @click="onSearch" class="btn btn-primary" style="flex:1;">검색</button>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/stores/searchStore'
const store = useSearchStore()

function onSearch() {
  if (!store.keyword.trim()) return
  store.commitSearch()
  store.toggleSidebar(true)
}
</script>

<style scoped>
.custom-input {
  height: 40px !important;
  line-height: 38px;
  padding: 6px 12px;
  font-size: 14px;
}
</style>
