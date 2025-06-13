<template>
  <section class="notice-section">
    <div class="notice-header">
      <div class="notice-title">
        <div class="notice-icon">🔔</div>
        <h2>공지사항</h2>
      </div>
      <div class="notice-more" @click="$emit('viewMore')">
        더보기
        <span class="arrow">›</span>
      </div>
    </div>
    
    <div class="notice-list">
      <notice-item 
        v-for="notice in notices" 
        :key="notice.id"
        :title="notice.title"
        :date="notice.date"
        @click="$emit('viewNotice', notice.id)"
      />
    </div>
    
    <div class="notice-footer">
      <button class="all-notices-btn" @click="$emit('viewMore')">
        전체 공지사항 보기
      </button>
    </div>
  </section>
</template>

<script setup>
import NoticeItem from './NoticeItem.vue';

defineProps({
  notices: {
    type: Array,
    required: true
  }
});

defineEmits(['viewMore', 'viewNotice']);
</script>

<style scoped>
.notice-section {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-top: 0;
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notice-section:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.notice-title {
  display: flex;
  align-items: center;
}

.notice-title h2 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: #333;
}

.notice-icon {
  font-size: 1.8rem;
  margin-right: 12px;
  color: #2a7dc0;
}

.notice-more {
  color: #2a7dc0;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.notice-more:hover {
  background-color: rgba(42, 125, 192, 0.08);
}

.arrow {
  font-size: 1.2rem;
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.notice-more:hover .arrow {
  transform: translateX(3px);
}

.notice-list {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.notice-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  text-align: center;
}

.all-notices-btn {
  background-color: transparent;
  color: #2a7dc0;
  border: 1px solid #2a7dc0;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.all-notices-btn:hover {
  background-color: #2a7dc0;
  color: white;
}

/* 반응형 스타일 */
@media (max-width: 992px) {
  .notice-section {
    margin-top: 40px;
  }
}

@media (max-width: 768px) {
  .notice-section {
    padding: 25px;
  }
  
  .notice-title h2 {
    font-size: 1.4rem;
  }
  
  .notice-icon {
    font-size: 1.5rem;
    margin-right: 10px;
  }
  
  .all-notices-btn {
    padding: 10px;
  }
}
</style> 