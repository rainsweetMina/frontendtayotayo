<template>
  <ul
      v-if="isOpen"
      class="dropdown-menu left-0 min-w-[180px] animate-fadeIn"
      :aria-labelledby="id"
  >
    <li v-for="item in items" :key="item.label">
      <router-link
        class="dropdown-item"
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
.animate-fadeIn {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style> 