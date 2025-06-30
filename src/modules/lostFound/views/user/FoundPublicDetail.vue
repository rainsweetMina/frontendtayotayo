<template>
  <div class="page-container">
    <div class="flex items-center mb-6">
      <h1 class="title">습득물 상세 정보</h1>
      <button 
        @click="goBack"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ml-auto"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        목록으로
      </button>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="content-card p-8 text-center">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-gray-700">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        정보를 불러오는 중...
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="content-card p-8 text-center">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-red-600">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        정보를 불러오는데 실패했습니다.
      </div>
    </div>

    <!-- 상세 정보 -->
    <div v-else-if="item" class="content-card p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 이미지 섹션 -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              물품 이미지
            </h3>
            <div class="flex justify-center">
              <img 
                v-if="item.photoUrl" 
                :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`" 
                alt="등록된 이미지" 
                class="max-w-full h-auto rounded-lg shadow-md object-cover" 
                style="max-height: 300px;" 
              />
              <div v-else class="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">이미지 없음</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 정보 섹션 -->
        <div class="lg:col-span-2">
          <!-- 물품명 -->
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">습득물</h3>
                <div class="mt-1 text-sm text-blue-700">
                  <p class="font-semibold text-lg">{{ item.itemName || '정보 없음' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 정보 그리드 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 버스 회사 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <label class="text-sm font-medium text-gray-700">버스 회사</label>
              </div>
              <p class="text-gray-900 font-medium">{{ item.busCompany || '정보 없음' }}</p>
            </div>

            <!-- 노선 번호 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"></path>
                </svg>
                <label class="text-sm font-medium text-gray-700">노선 번호</label>
              </div>
              <p class="text-gray-900 font-medium">{{ item.busNumber || '정보 없음' }}</p>
            </div>

            <!-- 습득 위치 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <label class="text-sm font-medium text-gray-700">습득 위치</label>
              </div>
              <p class="text-gray-900 font-medium">{{ item.foundPlace || '정보 없음' }}</p>
            </div>

            <!-- 습득일 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <label class="text-sm font-medium text-gray-700">습득일</label>
              </div>
              <p class="text-gray-900 font-medium">{{ formatDate(item.foundTime) }}</p>
            </div>

            <!-- 연락처 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <label class="text-sm font-medium text-gray-700">연락처</label>
              </div>
              <p class="text-gray-900 font-medium">{{ item.handlerContact || '정보 없음' }}</p>
            </div>

            <!-- 이메일 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <label class="text-sm font-medium text-gray-700">이메일</label>
              </div>
              <p class="text-gray-900 font-medium">{{ item.handlerEmail || '정보 없음' }}</p>
            </div>

            <!-- 처리 상태 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <label class="text-sm font-medium text-gray-700">처리 상태</label>
              </div>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getStatusClass(item.status)
              ]">
                {{ getStatusLabel(item.status) }}
              </span>
            </div>

            <!-- 보관 장소 -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <label class="text-sm font-medium text-gray-700">보관 장소</label>
              </div>
              <p class="text-gray-900 font-medium">{{ item.storageLocation || '정보 없음' }}</p>
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
              <p class="text-gray-900 whitespace-pre-wrap">{{ item.content || '내용이 없습니다.' }}</p>
            </div>
          </div>
        </div>
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
const error = ref(false);
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '';

const goBack = () => {
  router.push('/found');
};

const fetchItem = async () => {
  try {
    loading.value = true;
    error.value = false;
    const { data } = await axios.get(`/api/found/${route.params.id}`);
    item.value = data;
  } catch (err) {
    console.error('습득물 상세 정보 조회 실패:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// 날짜 포맷
const formatDate = (dateStr) => {
  if (!dateStr) return '정보 없음';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '정보 없음';
  
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// 상태 출력
const getStatusLabel = (status) => {
  switch (status) {
    case 'IN_STORAGE': return '보관중';
    case 'RETURNED': return '수령완료';
    default: return status || '정보 없음';
  }
};

// 상태별 스타일 클래스
const getStatusClass = (status) => {
  switch (status) {
    case 'IN_STORAGE': return 'bg-yellow-100 text-yellow-800';
    case 'RETURNED': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
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
  max-width: 900px;
}

th {
  width: 30%;
  background-color: #f8f9fa;
}

td {
  white-space: pre-wrap;
}
</style>
