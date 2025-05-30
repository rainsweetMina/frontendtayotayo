<template>
  <div class="search-box">
    <span class="d-flex flex-2 p-3">
      <input
          type="text"
          v-model="store.keyword"
          @keydown.enter="onSearch"
          placeholder="버스 번호/정류장 검색"
          style="flex: 5;"
      />
      <button @click="onSearch" class="btn btn-outline-primary" style="flex:1;">검색</button>
    </span>
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
