<template>
  <li class="relative inline-block mx-3">
    <button
      class="px-3 py-2 text-gray-700 font-medium whitespace-nowrap rounded hover:bg-gray-50 focus:outline-none transition-colors duration-200"
      :class="{ 'bg-gray-100': isOpen, 'hover:text-primary-600': !isOpen }"
      :id="id"
      @click="toggleDropdown"
      aria-expanded="false"
      ref="dropdownButton"
    >
      {{ title }}
    </button>
    <DropdownMenu :isOpen="isOpen" :items="items" :id="id" />
  </li>
</template>

<script>
import DropdownMenu from './DropdownMenu.vue';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
  name: 'NavbarDropdown',
  components: {
    DropdownMenu
  },
  props: {
    id: String,
    title: String,
    items: Array // [{ label: '버스 요금', to: '/fare' }, ...]
  },
  setup() {
    const isOpen = ref(false);
    const dropdownButton = ref(null);

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const closeDropdown = (event) => {
      // 드롭다운 버튼 외부를 클릭했을 때만 닫기
      if (dropdownButton.value && !dropdownButton.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', closeDropdown);
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown);
    });

    return {
      isOpen,
      toggleDropdown,
      dropdownButton
    };
  }
}
</script>

<style scoped>
button {
  position: relative;
}

button::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: theme('colors.primary.500');
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

button:hover::after {
  width: 70%;
}

.active button::after {
  width: 70%;
}
</style>