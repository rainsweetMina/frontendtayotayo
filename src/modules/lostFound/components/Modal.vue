<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">✖</button>
      <slot />
    </div>
  </div>
</template>

<script setup>
// props도 따로 정의하고 싶다면 defineProps 사용 가능
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2100;
}

.modal-content {
  background: #fff; /* ✅ 기본 배경색 */
  padding: 1.5rem;   /* ✅ 내부 여백 */
  border-radius: 10px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;  /* ✅ 전체 폼에 스크롤을 넘기기 위해 hidden */
  position: relative;
  z-index: 2101;
  display: flex;
  flex-direction: column;
}


.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #000;
  z-index: 2102;
}
</style>
