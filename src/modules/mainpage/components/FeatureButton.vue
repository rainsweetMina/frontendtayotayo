<template>
  <div class="feature-button" @click="$emit('click')">
    <div class="feature-icon">{{ icon }}</div>
    <div class="feature-text">{{ text }}</div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

defineEmits(['click']);
</script>

<style scoped>
.feature-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 120px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.feature-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background-color: #2a7dc0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.feature-button:hover::before {
  opacity: 1;
}

.feature-icon {
  font-size: 2.8rem;
  margin-right: 20px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(42, 125, 192, 0.1);
  border-radius: 12px;
  color: #2a7dc0;
}

.feature-button:hover .feature-icon {
  transform: scale(1.1);
  background-color: rgba(42, 125, 192, 0.15);
}

.feature-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  transition: color 0.3s ease;
}

.feature-button:hover .feature-text {
  color: #2a7dc0;
}

/* 태블릿 반응형 스타일 */
@media (max-width: 992px) {
  .feature-button {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 25px 15px;
    text-align: center;
  }

  .feature-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .feature-button::before {
    width: 100%;
    height: 4px;
    top: 0;
    left: 0;
  }
}

/* 모바일 반응형 스타일 */
@media (max-width: 768px) {
  .feature-button {
    min-height: 100px;
  }

  .feature-icon {
    font-size: 2.2rem;
    width: 50px;
    height: 50px;
  }

  .feature-text {
    font-size: 1.1rem;
  }
}
</style> 