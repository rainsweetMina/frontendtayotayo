<template>
  <div class="search-box p-3">
    <div class="d-flex mb-2">
      <input
          type="text"
          v-model="store.departure"
          placeholder="출발지"
          class="form-control me-1"
      />
      <button @click="store.selectingField = 'start'">출발지 선택</button>
    </div>
    <div class="d-flex">
      <input
          type="text"
          v-model="store.arrival"
          placeholder="도착지"
          class="form-control me-1"
      />
      <button @click="store.selectingField = 'end'">도착지 선택</button>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/stores/searchStore'
import { ref } from 'vue'

const departure = ref('')
const arrival = ref('')
const selecting = ref('')
const store = useSearchStore()
</script>
