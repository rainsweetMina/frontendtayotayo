<template>
  <transition name="fade">
    <div v-if="show" class="toast-top">
      <p>{{ message }}</p>
      <button class="confirm-button" @click="confirm">확인</button>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  message: String
})
const emit = defineEmits(['close'])
function confirm() {
  emit('close')
}
</script>

<style scoped>
.toast-top {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 9999;
  text-align: center;
}

/* 버튼 스타일 추가 */
.confirm-button {
  margin-top: 12px;
  padding: 8px 16px;
  background-color: #4889cd;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.confirm-button:hover {
  background-color: #2877cd;
}

/* 페이드 전환 효과 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
