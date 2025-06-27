<template>
  <div class="max-w-4xl mx-auto py-8 px-4" v-if="qna">
    <!-- 헤더 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Q&A 상세보기
          </h1>
        </div>
      </div>
    </div>

    <!-- 질문 카드 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <!-- 질문 헤더 -->
      <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center">
              {{ qna.title }}
              <span v-if="qna.secret" class="ml-2 text-yellow-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </span>
              <span v-if="qna.status === 'ANSWERED'" class="ml-2 text-green-500" title="답변 완료">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </span>
            </h2>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ maskWriterName(qna.writerName || qna.username) }}
              <span class="mx-2">•</span>
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {{ formatDate(qna.createdAt) }}
            </div>
          </div>
          <span 
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
            :class="qna.secret ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'"
          >
            <svg v-if="qna.secret" class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            {{ qna.secret ? '비공개' : '공개' }}
          </span>
        </div>
      </div>

      <!-- 질문 내용 -->
      <div class="px-6 py-6">
        <div class="prose max-w-none">
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ qna.content }}</p>
        </div>
      </div>
    </div>

    <!-- 답변 카드 -->
    <div v-if="qna.answer" class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div class="bg-green-50 px-6 py-4 border-b border-green-200">
        <h3 class="text-lg font-semibold text-green-800 flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          답변
        </h3>
      </div>
      <div class="px-6 py-6">
        <div class="prose max-w-none">
          <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ qna.answer }}</p>
        </div>
      </div>
    </div>

    <!-- 액션 버튼 -->
    <div class="flex justify-between items-center">
      <button 
        @click="goList"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        목록으로
      </button>
      
      <div v-if="isMineOrAdmin" class="flex space-x-3">
        <router-link 
          :to="`/qna/edit/${qna.id}`"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          수정
        </router-link>
        <button 
          @click="handleDelete"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchQnaDetail, deleteQna } from './api/publicQnaApi';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const userId = computed(() => auth.userId);
const isAdmin = computed(() => auth.role === 'ADMIN');
const qna = ref(null);

const isMineOrAdmin = computed(() => {
  if (isAdmin.value) return true;
  if (!qna.value) return false;
  const myId = String(userId.value);
  return (
    (qna.value.writerId && String(qna.value.writerId) === myId) ||
    (qna.value.userId && String(qna.value.userId) === myId) ||
    (qna.value.username && qna.value.username === auth.username)
  );
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

// 작성자 이름 마스킹 함수
function maskWriterName(name) {
  if (!name || isAdmin.value) return name;  // 관리자는 전체 이름 표시
  if (name.length === 1) return '*';        // 1글자는 *로 표시
  return name.charAt(0) + '*'.repeat(name.length - 1);  // 첫글자 + 나머지는 *
}

onMounted(async () => {
  try {
    const { data } = await fetchQnaDetail(route.params.id);
    qna.value = data;
    // 비밀글 접근 제한: 관리자/본인만 허용
    if (data.secret && !isMineOrAdmin.value) {
      alert('비공개 글입니다. 열람 권한이 없습니다.');
      router.replace('/qna');
      return;
    }
  } catch (e) {
    alert('존재하지 않는 글이거나 권한이 없습니다.');
    router.replace('/qna');
  }
});

async function handleDelete() {
  if (confirm('정말 삭제하시겠습니까?')) {
    await deleteQna(qna.value.id);
    alert('삭제 완료');
    router.push('/qna');
  }
}

function goList() {
  router.push('/qna');
}
</script>

<style scoped>
.qna-detail-container { max-width: 700px; margin: 0 auto; }
.qna-meta { color: #888; margin-bottom: 1em; }
.qna-content { margin-bottom: 2em; }
.qna-answer { background: #f9f9f9; padding: 1em; margin-bottom: 1em; }
.qna-actions { margin-bottom: 1em; }
.qna-actions > * { margin-right: 1em; }
</style> 