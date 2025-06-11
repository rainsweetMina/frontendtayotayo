<template>
  <div class="container py-4">
    <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0">분실물 등록</h5>
        <button class="btn btn-outline-secondary btn-sm" @click="goBack">
          <i class="bi bi-arrow-left me-1"></i> 목록으로
        </button>
      </div>
      
      <LostItemForm @submit="handleCreate" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import LostItemForm from '@/modules/lostFound/components/LostItemForm.vue';
import { createLostItem } from '@/modules/lostFound/api/lostPublic.js';

const router = useRouter();

const goBack = () => {
  router.push('/lost');
};

const handleCreate = async (formData) => {
  try {
    await createLostItem(formData);
    alert('분실물이 등록되었습니다.');
    router.push('/lost');
  } catch (error) {
    console.error('분실물 등록 실패:', error);
    alert('등록 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style> 