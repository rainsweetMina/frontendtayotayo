<template>
  <div class="d-flex align-items-center mb-3">
    <input
        v-model="keyword"
        :placeholder="placeholder"
        class="form-control me-2"
        style="max-width:320px"
        @keyup.enter="onSearch"
    />
    <button class="btn btn-primary" @click="onSearch">검색</button>
    <button class="btn btn-outline-secondary ms-2" @click="onReset">초기화</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ placeholder: String });
const emit = defineEmits(['search', 'reset']);
const keyword = ref('');

function onSearch() {
  emit('search', keyword.value.trim());
}
function onReset() {
  keyword.value = '';
  emit('reset');
}
</script>
