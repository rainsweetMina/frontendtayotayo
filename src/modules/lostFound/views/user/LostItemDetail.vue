<template>
  <div class="page-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">분실물 상세 정보</h1>
      <div>
        <button class="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mr-2" @click="goToEditPage">수정</button>
        <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors" @click="goBack">목록으로</button>
      </div>
    </div>

    <div v-if="item !== null && item !== undefined" class="content-card p-6">
      <template v-if="item.deleted">
        <div class="text-center py-12 text-red-600 font-semibold text-lg">
          이 게시글은 관리자가 삭제 처리했습니다.
        </div>
      </template>
      <template v-else-if="item.visible === true">
        <div class="text-center py-12 text-gray-500 font-semibold text-lg">
          이 게시글은 관리자가 숨김 처리했습니다.
        </div>
      </template>
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 분실물명 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <label class="text-sm font-medium text-gray-700">분실물</label>
            </div>
            <p class="text-gray-900 font-medium">{{ item.title || '-' }}</p>
          </div>

          <!-- 분실일 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <label class="text-sm font-medium text-gray-700">분실일</label>
            </div>
            <p class="text-gray-900 font-medium">{{ formatDate(item.lostTime) }}</p>
          </div>

          <!-- 버스 회사 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <label class="text-sm font-medium text-gray-700">버스 회사</label>
            </div>
            <p class="text-gray-900 font-medium">{{ item.busCompany || '-' }}</p>
          </div>

          <!-- 노선번호 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"></path>
              </svg>
              <label class="text-sm font-medium text-gray-700">노선번호</label>
            </div>
            <p class="text-gray-900 font-medium">{{ item.busNumber || '-' }}</p>
          </div>
        </div>

        <!-- 내용 -->
        <div class="bg-gray-50 rounded-lg p-4 mt-6">
          <div class="flex items-center mb-3">
            <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <label class="text-sm font-medium text-gray-700">상세 내용</label>
          </div>
          <div class="bg-white rounded border p-4 min-h-[100px]">
            <p class="text-gray-900 whitespace-pre-wrap">{{ item.content || '-' }}</p>
          </div>
        </div>
      </template>
    </div>
    <div v-else class="content-card p-8 text-center">
      <div v-if="loading" class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-700">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        로딩중...
      </div>
      <div v-else class="text-gray-500 font-semibold text-lg">
        이 게시글은 관리자가 숨김 또는 삭제 처리했습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const item = ref(null);
const loading = ref(true);

const goBack = () => {
  router.push('/mypage/lost');
};

const goToEditPage = () => {
  router.push(`/mypage/lost/edit/${route.params.id}`);
};

const fetchItem = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get(`/api/lost/${route.params.id}`);
    item.value = data;
  } catch (error) {
    console.error('분실물 상세 정보 조회 실패:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '-' : d.toISOString().split('T')[0];
};

onMounted(() => {
  fetchItem();
});
</script>

<style>
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

.container {
  max-width: 800px;
}
</style> 