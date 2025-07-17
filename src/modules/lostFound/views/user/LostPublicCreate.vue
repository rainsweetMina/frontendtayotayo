<template>
  <div class="board-main-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">분실물 등록</h1>
      <button 
        @click="goBack"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        목록으로
      </button>
    </div>
    
    <!-- 폼 내용 -->
    <div class="content-card p-6">
      <LostItemForm @submit="handleCreate" />
    </div>

    <CommonModal
      :isOpen="modalOpen"
      title="알림"
      :message="modalMessage"
      :showCancel="false"
      :confirmText="modalMessage === '분실물이 등록되었습니다.' ? '확인' : '로그인하기'"
      @close="handleModalClose"
      @confirm="handleModalClose"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import LostItemForm from '@/modules/lostFound/components/LostItemForm.vue';
import { createLostItem } from '@/modules/lostFound/api/lostPublic.js';
import { ref } from 'vue';
import CommonModal from '@/components/CommonModal.vue';

const router = useRouter();

const modalOpen = ref(false);
const modalMessage = ref('');

const goBack = () => {
  router.push('/lost');
};

const handleCreate = async (formData) => {
  try {
    await createLostItem(formData);
    modalMessage.value = '분실물이 등록되었습니다.';
    modalOpen.value = true;
  } catch (error) {
    console.error('분실물 등록 실패:', error);
    
    // 로그인이 필요한 경우 안내 모달 표시
    if (error.message === '로그인 필요' || error.message.includes('로그인')) {
      modalMessage.value = '분실물 등록을 위해 로그인 또는 회원가입이 필요합니다.';
      modalOpen.value = true;
      return;
    }
    
    // 기타 오류는 모달로 표시
    modalMessage.value = '등록 중 오류가 발생했습니다.';
    modalOpen.value = true;
  }
};

const handleModalClose = () => {
  modalOpen.value = false;
  
  // 등록 성공 시 목록으로 이동
  if (modalMessage.value === '분실물이 등록되었습니다.') {
    router.push('/lost');
  }
  // 로그인 필요 시 로그인 페이지로 이동
  else if (modalMessage.value === '분실물 등록을 위해 로그인 또는 회원가입이 필요합니다.') {
    router.push('/login');
  }
};
</script>

<style>
@import "@/modules/board/assets/boardCommon.css";
/* 공통 스타일 */
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

.content-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.container {
  max-width: 800px;
}
</style> 