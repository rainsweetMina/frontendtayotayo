<template>
  <div class="container py-4">
    <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0">분실물 수정</h5>
        <button class="btn btn-outline-secondary btn-sm" @click="goBack">
          <i class="bi bi-arrow-left me-1"></i> 취소
        </button>
      </div>
      
      <div v-if="item">
        <LostItemForm :initialData="item" @submit="handleSubmit" />
      </div>
      <div v-else class="text-center py-5">
        <div class="spinner-border text-primary" role="status" v-if="loading">
          <span class="visually-hidden">로딩중...</span>
        </div>
        <div v-else class="text-muted">정보를 찾을 수 없습니다.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import LostItemForm from './LostItemForm.vue';
import { updateLostItem } from '@/modules/lostFound/api/lostPublic.js';

const router = useRouter();
const route = useRoute();
const item = ref(null);
const loading = ref(true);

const goBack = () => {
  router.push('/mypage/lost');
};

const fetchItem = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get(`/api/lost/${route.params.id}`);
    item.value = data;
  } catch (error) {
    console.error('분실물 정보 조회 실패:', error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (formData) => {
  try {
    await updateLostItem(route.params.id, formData);
    alert('수정되었습니다.');
    router.push('/mypage/lost');
  } catch (error) {
    console.error('수정 실패:', error);
    alert('수정 중 오류가 발생했습니다.');
  }
};

onMounted(() => {
  fetchItem();
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
