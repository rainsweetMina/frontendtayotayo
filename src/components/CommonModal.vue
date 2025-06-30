<template>
  <div
    :class="`modal ${!isOpen && 'opacity-0 pointer-events-none'} z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
  >
    <div
      @click="closeModal"
      class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"
    ></div>

    <div
      class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md"
    >
      <div class="px-6 py-4 text-left modal-content">
        <!--Title-->
        <div class="flex items-center justify-between pb-3">
          <p class="text-2xl font-bold">{{ title }}</p>
          <div class="z-50 cursor-pointer modal-close" @click="closeModal">
            <svg
              class="text-black fill-current"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"
              />
            </svg>
          </div>
        </div>

        <!--Body-->
        <p class="mb-4">{{ message }}</p>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button
            v-if="showCancel"
            @click="closeModal"
            class="p-3 px-6 py-3 mr-2 text-gray-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
          >
            {{ cancelText }}
          </button>
          <button
            @click="confirm"
            :class="confirmBtnClass"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: '알림' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: '확인' },
  confirmType: { type: String, default: 'primary' }, // 'danger', 'primary', 'success'
  showCancel: { type: Boolean, default: false },
  cancelText: { type: String, default: '취소' }
})
const emit = defineEmits(['close', 'confirm'])
const closeModal = () => emit('close')
const confirm = () => emit('confirm')
const confirmBtnClass = computed(() => {
  if (props.confirmType === 'danger') {
    return 'px-6 py-3 font-medium tracking-wide text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none'
  } else if (props.confirmType === 'success') {
    return 'px-6 py-3 font-medium tracking-wide text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none'
  } else {
    return 'px-6 py-3 font-medium tracking-wide text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none'
  }
})
</script>

<style scoped>
.modal {
  transition: opacity 0.25s ease;
}
</style> 