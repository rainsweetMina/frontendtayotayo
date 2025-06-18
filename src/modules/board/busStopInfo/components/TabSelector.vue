<template>
  <div class="tab-selector">
    <button
        :class="{ active: modelValue === 'region' }"
        @click="$emit('update:modelValue', 'region')"
    >
      지역 검색
    </button>
    |
    <button
        :class="{ active: modelValue === 'route' }"
        @click="$emit('update:modelValue', 'route')"
    >
      노선 검색
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
@import "@/modules/board/assets/busStopInfo.css";
</style>
