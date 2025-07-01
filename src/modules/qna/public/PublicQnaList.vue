<template>
  <div class="board-main-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">Q&A 리스트</h1>
    </div>

    <!-- 검색 카드 -->
    <div class="content-card p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        검색 조건
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">검색 필드</label>
          <select v-model="field" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="title">제목</option>
            <option value="user">작성자</option>
            <option value="all">제목+내용</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">검색어</label>
          <input v-model="keyword" placeholder="검색어를 입력하세요" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" @keyup.enter="searchQna" />
        </div>
        <div class="flex items-end space-x-3">
          <button @click="searchQna" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            검색
          </button>
          <button @click="resetSearch" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            초기화
          </button>
        </div>
      </div>
    </div>

    <!-- 목록 테이블 -->
    <div class="content-card mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">번호</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">답변상태</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="qna in qnaList" :key="qna.id" class="hover:bg-gray-50 cursor-pointer transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ qna.id }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                <template v-if="qna.secret">
                  <span v-if="isMineOrAdmin(qna)">
                    <router-link :to="`/qna/${qna.id}`" class="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">
                      {{ qna.title }}
                      <span class="ml-2 text-yellow-500">
                        <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </span>
                    </router-link>
                  </span>
                  <span v-else class="text-gray-500">
                    {{ qna.title }}
                    <span class="ml-2 text-yellow-500">
                      <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </span>
                  </span>
                </template>
                <template v-else>
                  <router-link :to="`/qna/${qna.id}`" class="text-blue-700 hover:text-blue-900 font-medium transition-colors duration-200">
                    {{ qna.title }}
                  </router-link>
                </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{{ maskWriterName(qna.writerName || qna.username) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{{ formatDate(qna.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span v-if="qna.status === '답변 완료'" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                  <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  답변완료
                </span>
                <span v-else class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                  <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  미답변
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="qnaList.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Q&A가 없습니다</h3>
        <p class="mt-1 text-sm text-gray-500">검색 조건을 변경해보세요.</p>
      </div>
    </div>

    <!-- 페이징 -->
    <div v-if="totalPages > 1" class="flex justify-center space-x-2 mt-8">
      <button @click="goPage(currentPage - 1)" :disabled="currentPage === 0" class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        이전
      </button>
      <button v-for="page in pageNumbers" :key="page" @click="goPage(page)" :class="['inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-all duration-200 shadow-sm', page === currentPage ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300']">
        {{ page + 1 }}
      </button>
      <button @click="goPage(currentPage + 1)" :disabled="currentPage === totalPages - 1" class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
        다음
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- 등록 버튼 -->
    <button class="fixed bottom-8 right-8 inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105" @click="goRegister">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      등록
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { fetchAllQna } from './api/publicQnaApi';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const qnaList = ref([]);
const keyword = ref('');
const field = ref('title');
const currentPage = ref(0);
const totalPages = ref(1);
const auth = useAuthStore();
const router = useRouter();
const userId = computed(() => auth.userId);
const isAdmin = computed(() => auth.role === 'ADMIN');

function isMineOrAdmin(qna) {
  if (isAdmin.value) return true;
  if (!qna) return false;
  const myId = String(userId.value);
  return (
    (qna.writerId && String(qna.writerId) === myId) ||
    (qna.userId && String(qna.userId) === myId) ||
    (qna.username && qna.username === auth.username)
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// 작성자 이름 마스킹 함수
function maskWriterName(name) {
  if (!name || isAdmin.value) return name;  // 관리자는 전체 이름 표시
  if (name.length === 1) return '*';        // 1글자는 *로 표시
  return name.charAt(0) + '*'.repeat(name.length - 1);  // 첫글자 + 나머지는 *
}

async function loadQna(page = 0) {
  const { data } = await fetchAllQna(page, keyword.value, field.value);
  qnaList.value = data.content || [];
  currentPage.value = data.number || 0;
  totalPages.value = data.totalPages || 1;
}

function searchQna() {
  loadQna(0);
}
function resetSearch() {
  keyword.value = '';
  field.value = 'title';
  loadQna(0);
}
function goRegister() {
  router.push('/qna/new');
}
function goPage(page) {
  if (page < 0 || page >= totalPages.value) return;
  loadQna(page);
}
const pageNumbers = computed(() => {
  const pages = [];
  const start = Math.max(0, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 5);
  for (let i = start; i < end; i++) pages.push(i);
  return pages;
});

onMounted(() => loadQna(0));
</script>

<style scoped>
@import "@/modules/board/assets/boardCommon.css";
.content-card { background-color: #fff; border-radius: 0.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
.title { font-size: 26px; font-weight: 700; margin-bottom: 24px; padding-left: 8px; display: flex; align-items: center; gap: 10px; color: #2c3e50; border-left: 6px solid #4d9eff; }
.qna-table { width: 100%; border-collapse: collapse; }
.qna-table th, .qna-table td { border: 1px solid #ddd; padding: 8px; }
.qna-write-btn { float: right; margin-bottom: 10px; }
</style> 