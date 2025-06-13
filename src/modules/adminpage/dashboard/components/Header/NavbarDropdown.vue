<template>
  <li class="relative inline-block mx-3">
    <button
      class="px-3 py-2 text-gray-700 font-medium whitespace-nowrap rounded focus:outline-none"
      :class="{ 'bg-gray-200': isOpen, 'bg-white/80 hover:bg-white/90': !isOpen }"
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
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>