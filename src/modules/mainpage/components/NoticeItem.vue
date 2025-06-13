<template>
  <div class="notice-item" @click="$emit('click')">
    <div class="notice-content">
      <h3>{{ title }}</h3>
      <p class="notice-date">{{ date }}</p>
    </div>
    <div class="notice-arrow">›</div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

defineEmits(['click']);
</script>

<style scoped>
.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notice-item:hover {
  background-color: rgba(42, 125, 192, 0.03);
  padding-left: 10px;
  padding-right: 10px;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-content h3 {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  transition: color 0.3s;
}

.notice-item:hover .notice-content h3 {
  color: #2a7dc0;
}

.notice-date {
  color: #888;
  font-size: 0.95rem;
  margin: 0;
}

.notice-arrow {
  color: #2a7dc0;
  font-size: 1.8rem;
  transition: transform 0.3s ease;
}

.notice-item:hover .notice-arrow {
  transform: translateX(5px);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .notice-item {
    padding: 15px 0;
  }
  
  .notice-content h3 {
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
  
  .notice-date {
    font-size: 0.9rem;
  }
  
  .notice-arrow {
    font-size: 1.5rem;
  }
}
</style> 