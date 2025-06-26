<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- 헤더 -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            분실물 등록
          </h1>
          <button 
            @click="goBack"
            class="inline-flex items-center px-4 py-2 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            목록으로
          </button>
        </div>
      </div>
      
      <!-- 폼 내용 -->
      <div class="p-6">
        <LostItemForm @submit="handleCreate" />
      </div>
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