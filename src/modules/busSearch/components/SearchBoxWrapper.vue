<template>
  <div class="search-wrapper">
    <div class="d-flex justify-content-end p-2">
      <button @click="isRouteMode = !isRouteMode" class="btn btn-sm btn-light">
        {{ isRouteMode ? '일반 검색' : '경로 검색' }}
      </button>
    </div>

    <BasicSearchBox v-if="!isRouteMode" />
    <RouteSearchBox v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BasicSearchBox from './SearchBox.vue'
import RouteSearchBox from './RouteSearchBox.vue'

const isRouteMode = ref(false)
</script>
