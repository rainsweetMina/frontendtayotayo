<template>
  <div class="page-container">
    <div class="flex items-center mb-6">
      <h1 class="title">분실물 수정</h1>
      <button class="ml-auto inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors" @click="goBack">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        취소
      </button>
    </div>
    <div class="content-card p-6">
      <div v-if="item">
        <LostItemForm :initialData="item" @submit="handleSubmit" />
      </div>
      <div v-else class="text-center py-5">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-700" v-if="loading">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          로딩중...
        </div>
        <div v-else class="text-gray-500">정보를 찾을 수 없습니다.</div>
      </div>
    </div>
    <CommonModal
      :isOpen="modal.open"
      :title="modal.title"
      :message="modal.message"
      :confirmType="modal.confirmType"
      :showCancel="false"
      @close="modal.open = false"
      @confirm="modal.onConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import LostItemForm from './LostItemForm.vue';
import { updateLostItem } from '@/modules/lostFound/api/lostPublic.js';
import CommonModal from '@/components/CommonModal.vue';

const router = useRouter();
const route = useRoute();
const item = ref(null);
const loading = ref(true);

const modal = ref({ open: false, title: '', message: '', confirmType: 'primary', onConfirm: null });

const goBack = () => {
  router.push('/mypage/lost');
};

const fetchItem = async () => {
  try {
    loading.value = true;
    const { data } = await api.get(`/api/lost/${route.params.id}`);
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
    modal.value = {
      open: true,
      title: '수정 완료',
      message: '분실물 정보가 성공적으로 수정되었습니다.',
      confirmType: 'success',
      onConfirm: () => {
        modal.value.open = false;
        router.push('/mypage/lost');
      }
    };
  } catch (error) {
    console.error('수정 실패:', error);
    modal.value = {
      open: true,
      title: '오류',
      message: '수정 중 오류가 발생했습니다.',
      confirmType: 'danger',
      onConfirm: () => { modal.value.open = false; }
    };
  }
};

onMounted(() => {
  fetchItem();
});
</script>

<style>
.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-left: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  border-left: 6px solid #4d9eff;
}
.page-container {
  max-width: 960px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Noto Sans KR', sans-serif;
}
.content-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
