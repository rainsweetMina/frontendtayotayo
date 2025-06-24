<template>
  <div class="w-full flex justify-start">
    <div class="flex flex-col sm:flex-row items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 mb-4 shadow-sm w-full sm:w-auto">
      <input
        v-model="keyword"
        :placeholder="placeholder"
        class="w-full sm:w-80 border-none focus:ring-0 bg-transparent px-2 py-1 text-base placeholder-gray-400"
        @keyup.enter="onSearch"
      />
      <button class="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-semibold" @click="onSearch">검색</button>
      <button class="px-4 py-1 bg-gray-100 text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition text-sm font-semibold" @click="onReset">초기화</button>
    </div>
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
