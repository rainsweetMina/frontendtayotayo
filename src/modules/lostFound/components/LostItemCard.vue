<template>
  <div class="card mb-3">
    <div class="card-body">
      <h5 class="card-title">
        <router-link :to="`/mypage/lost/${item.id}`" class="text-decoration-none">
          {{ item.title }}
        </router-link>
      </h5>
      <p class="card-text mb-1">
        <strong>버스회사:</strong> {{ item.busCompany }} /
        <strong>노선:</strong> {{ item.busNumber }}
      </p>
      <p class="card-text mb-1"><strong>분실일:</strong> {{ formatDate(item.lostTime) }}</p>
      <p class="card-text"><strong>내용:</strong> {{ item.content }}</p>

      <button class="btn btn-outline-danger btn-sm" @click="$emit('delete', item.id)">
        삭제
      </button>
      <button class="btn btn-outline-primary btn-sm" @click="$emit('edit', item)">
        수정
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  item: Object
});

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '-' : d.toISOString().split('T')[0];
};

</script>
