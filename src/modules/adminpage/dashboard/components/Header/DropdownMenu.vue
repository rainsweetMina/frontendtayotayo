<template>
  <ul
      v-if="isOpen"
      class="absolute top-full left-0 z-10 mt-1 w-[165px] py-2 bg-white rounded shadow-lg border border-gray-200"
      :aria-labelledby="id"
  >

    <li v-for="item in items" :key="item.label">
      <router-link
        class="block px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
        :to="item.to"
      >
        {{ item.label }}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: "DropdownMenu",
  props: {
    isOpen: Boolean,
    items: Array,
    id: String
  }
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style> 