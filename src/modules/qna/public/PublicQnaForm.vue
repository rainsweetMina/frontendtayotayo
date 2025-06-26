<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <!-- 헤더 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            {{ isEdit ? 'Q&A 수정' : 'Q&A 등록' }}
          </h1>
        </div>
      </div>
    </div>

    <!-- 폼 카드 -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 제목 입력 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            제목
          </label>
          <input 
            v-model="form.title" 
            required 
            placeholder="제목을 입력하세요"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" 
          />
        </div>

        <!-- 내용 입력 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            내용
          </label>
          <textarea 
            v-model="form.content" 
            required 
            rows="8" 
            placeholder="질문 내용을 자세히 입력하세요"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
          ></textarea>
        </div>

        <!-- 비공개 설정 -->
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="secret" 
            v-model="form.isSecret" 
            class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label for="secret" class="ml-2 block text-sm text-gray-700 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            비공개로 설정
          </label>
        </div>

        <!-- 버튼 영역 -->
        <div class="flex justify-between pt-6 border-t border-gray-200">
          <button 
            type="button" 
            @click="goList"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            목록으로
          </button>
          <button 
            type="submit"
            class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {{ isEdit ? '수정하기' : '등록하기' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createQna, updateQna, fetchQnaDetail } from './api/publicQnaApi';

const route = useRoute();
const router = useRouter();
const isEdit = !!route.params.id;
const form = ref({ title: '', content: '', isSecret: false });

onMounted(async () => {
  if (isEdit) {
    const { data } = await fetchQnaDetail(route.params.id);
    form.value = {
      title: data.title,
      content: data.content,
      isSecret: data.isSecret,
    };
  }
});

async function handleSubmit() {
  console.log('QnA 등록/수정 전송 데이터:', form.value);
  if (isEdit) {
    await updateQna(route.params.id, form.value);
    alert('수정 완료');
  } else {
    await createQna(form.value);
    alert('등록 완료');
  }
  router.push('/qna');
}

function goList() {
  router.push('/qna');
}
</script>

<style scoped>
.qna-form-container { max-width: 600px; margin: 0 auto; }
.qna-form-container form > div { margin-bottom: 1em; }
</style> 