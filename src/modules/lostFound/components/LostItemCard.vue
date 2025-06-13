<template>
  <div
      class="lost-card"
      :class="{ deleted: item.deleted }"
  >
    <div class="card-header">
      <div>
        <div class="title" @click="$emit('view', item)" style="cursor: pointer;">{{ item.title }}</div>
        <div class="date">{{ formatDate(item.lostTime) }}</div>
      </div>
      <div class="button-group">
        <button class="btn btn-edit" @click="$emit('edit', item)">수정</button>
        <button class="btn btn-delete" @click="$emit('delete', item.id)">삭제</button>
      </div>
    </div>

    <div class="content" @click="$emit('view', item)" style="cursor: pointer;">
      {{ item.content || '내용 없음' }}
    </div>

    <div v-if="item.deleted" class="deleted-label">
      ※ 삭제된 게시글입니다
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ item: Object });

defineEmits(['edit', 'delete', 'view']);

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '-';
};
</script>

<style scoped>
.lost-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  background-color: white;
  transition: 0.2s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
}

.lost-card.deleted {
  background-color: #f8f9fa;
  color: #999;
  border-color: #ccc;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.7rem;
}

.title {
  font-weight: 600;
  font-size: 1.1rem;
}

.date {
  font-size: 0.85rem;
  color: #888;
  margin-top: 2px;
}

.content {
  font-size: 0.95rem;
  white-space: pre-line;
  line-height: 1.4;
}

.button-group {
  display: flex;
  gap: 6px;
}

.btn {
  border: none;
  padding: 4px 10px;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-edit {
  background-color: #eef4ff;
  color: #0d6efd;
}

.btn-delete {
  background-color: #ffeef0;
  color: #dc3545;
}

.deleted-label {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  text-align: right;
  color: #999;
}
</style>
