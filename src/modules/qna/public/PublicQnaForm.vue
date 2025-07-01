<template>
  <div class="board-main-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">{{ isEdit ? 'Q&A 수정' : 'Q&A 등록' }}</h1>
      <button @click="goList" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        목록으로
      </button>
    </div>
    <div class="content-card p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input v-model="form.title" required placeholder="제목을 입력하세요" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea v-model="form.content" required rows="8" placeholder="질문 내용을 자세히 입력하세요" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"></textarea>
        </div>
        <div class="flex items-center">
          <input type="checkbox" id="secret" v-model="form.isSecret" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
          <label for="secret" class="ml-2 block text-sm text-gray-700 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            비공개로 설정
          </label>
        </div>
        <div class="flex justify-end pt-6 border-t border-gray-200">
          <button type="submit" class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ isEdit ? '수정하기' : '등록하기' }}
          </button>
        </div>
      </form>
    </div>
    <CommonModal
      :isOpen="modalOpen"
      title="알림"
      :message="modalMessage"
      :showCancel="false"
      confirmText="닫기"
      @close="handleModalClose"
      @confirm="handleModalClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createQna, updateQna, fetchQnaDetail } from './api/publicQnaApi';
import CommonModal from '@/components/CommonModal.vue';

const route = useRoute();
const router = useRouter();
const isEdit = !!route.params.id;
const form = ref({ title: '', content: '', isSecret: false });

const modalOpen = ref(false);
const modalMessage = ref('');

onMounted(async () => {
  if (isEdit) {
    const { data } = await fetchQnaDetail(route.params.id);
    form.value = {
      title: data.title,
      content: data.content,
      isSecret: data.isSecret ?? data.secret ?? false,
    };
  }
});

async function handleSubmit() {
  if (isEdit) {
    await updateQna(route.params.id, form.value);
    modalMessage.value = '수정 완료';
    modalOpen.value = true;
  } else {
    await createQna(form.value);
    modalMessage.value = '등록 완료';
    modalOpen.value = true;
  }
}

function goList() {
  router.push('/qna');
}

function handleModalClose() {
  modalOpen.value = false;
  goList();
}
</script>

<style scoped>
@import "@/modules/board/assets/boardCommon.css";
.qna-form-container { max-width: 600px; margin: 0 auto; }
.qna-form-container form > div { margin-bottom: 1em; }
</style> 