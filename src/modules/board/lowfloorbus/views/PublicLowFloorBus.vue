<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">저상버스 대체 안내</h1>
      <router-link
        v-if="isAdmin"
        to="/admin/lowfloorbus/new"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        글쓰기
      </router-link>
    </div>

    <!-- 로딩 인디케이터 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- 오류 메시지 -->
    <div v-else-if="error" class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
      <button @click="fetchLowFloorBuses(1)" class="ml-4 text-blue-500 hover:underline">
        다시 시도
      </button>
    </div>

    <!-- 저상버스 대체 안내 상세 페이지 -->
    <div v-else-if="selectedLowFloorBus" class="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-2xl font-bold mb-4">{{ selectedLowFloorBus.title }}</h2>
      <div class="flex justify-between text-gray-600 mb-6 border-b pb-4">
        <div>작성일: {{ formatDate(selectedLowFloorBus.createdAt) }}</div>
        <div>조회수: {{ selectedLowFloorBus.viewCount || 0 }}</div>
      </div>
      
      <!-- HTML 콘텐츠 렌더링 -->
      <div v-if="selectedLowFloorBus.content" v-html="selectedLowFloorBus.content" class="html-content prose max-w-none mb-8"></div>
      <div v-else class="text-gray-500 italic mb-8">본문 내용이 없습니다.</div>
      
      <!-- 첨부파일 다운로드 섹션 -->
      <div v-if="selectedLowFloorBus.files && selectedLowFloorBus.files.length > 0" class="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 class="text-lg font-medium text-gray-900 mb-2">첨부파일</h3>
        
        <div v-for="(file, index) in selectedLowFloorBus.files" :key="index" class="mb-3">
          <!-- 이미지 파일인 경우 직접 표시 -->
          <div v-if="isImageFile(file)" class="mb-3">
            <div class="flex justify-center bg-gray-100 rounded-md p-3 mb-2">
              <img 
                :src="getImageUrl(file, index)" 
                :alt="file.originalName"
                class="max-h-64 rounded-md"
              />
            </div>
            <div class="flex items-center">
              <span class="mr-2">{{ file.originalName }}</span>
              <span class="text-sm text-gray-500 mr-2">({{ formatFileSize(file.fileSize) }})</span>
              <button
                @click="downloadFile(file, index)"
                class="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg class="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                다운로드
              </button>
            </div>
          </div>
          
          <!-- 이미지 파일이 아닌 경우 다운로드 버튼만 표시 -->
          <div v-else class="flex items-center mb-2">
            <button
              @click="downloadFile(file, index)"
              class="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {{ file.originalName }}
              <span class="text-sm text-gray-500 ml-2">({{ formatFileSize(file.fileSize) }})</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-between">
        <button 
          @click="goBack" 
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          목록으로
        </button>
      </div>
    </div>

    <!-- 저상버스 대체 안내 목록 -->
    <div v-else-if="lowFloorBuses.length > 0" class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="lowFloorBus in lowFloorBuses" :key="lowFloorBus.id">
          <router-link
            :to="'/lowfloorbus/' + lowFloorBus.id"
            class="block hover:bg-gray-50"
          >
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-lg font-medium text-gray-900 truncate">
                    {{ lowFloorBus.title }}
                  </p>
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <span>{{ formatDate(lowFloorBus.createdAt) }}</span>
                    <span class="mx-2">•</span>
                    <span>조회 {{ lowFloorBus.viewCount || 0 }}</span>
                    <span v-if="lowFloorBus.hasAttachment" class="ml-2">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    
    <!-- 저상버스 대체 안내 없음 -->
    <div v-else class="bg-white shadow rounded-md p-8 text-center">
      <p class="text-gray-500 text-lg">등록된 저상버스 대체 안내가 없습니다.</p>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="!selectedLowFloorBus && totalPages > 1" class="mt-6 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="fetchLowFloorBuses(page)"
          :class="[
            page === currentPage
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
          ]"
        >
          {{ page }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
// Quill 스타일 가져오기
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const lowFloorBuses = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isAdmin = ref(false)
const selectedLowFloorBus = ref(null)
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const fetchLowFloorBuses = async (page = 1) => {
  try {
    isLoading.value = true;
    error.value = '';
    console.log(`저상버스 대체 안내 목록 조회 요청: 페이지=${page}`);
    
    try {
      // 일반 사용자용 저상버스 대체 안내 API 호출
      const response = await axios.get(`https://localhost:8081/api/public/lowfloorbuses`);
      console.log('저상버스 대체 안내 목록 응답:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // 배열 형태 응답 (public API 응답 형식)
        lowFloorBuses.value = response.data.map(lowFloorBus => ({
          ...lowFloorBus,
          createdAt: lowFloorBus.createdAt || lowFloorBus.createdDate || new Date().toISOString(),
          content: lowFloorBus.content || '',
          viewCount: lowFloorBus.viewCount || 0
        }));
        totalPages.value = 1;
      } else if (response.data && response.data.content) {
        // 페이징된 응답 구조
        lowFloorBuses.value = response.data.content.map(lowFloorBus => ({
          ...lowFloorBus,
          createdAt: lowFloorBus.createdAt || lowFloorBus.createdDate || new Date().toISOString(),
          content: lowFloorBus.content || '',
          viewCount: lowFloorBus.viewCount || 0
        }));
        totalPages.value = response.data.totalPages || 1;
      } else if (response.data) {
        // 단일 객체 응답
        lowFloorBuses.value = [{
          ...response.data,
          createdAt: response.data.createdAt || response.data.createdDate || new Date().toISOString(),
          content: response.data.content || '',
          viewCount: response.data.viewCount || 0
        }];
        totalPages.value = 1;
      } else {
        throw new Error('응답 데이터가 없습니다');
      }
      
      currentPage.value = page;
    } catch (apiError) {
      console.error('API 호출 오류:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('저상버스 대체 안내 로딩 실패:', error);
    console.error('응답 데이터:', error.response?.data);
    console.error('응답 상태:', error.response?.status);
    error.value = '저상버스 대체 안내를 불러오는데 실패했습니다.';
    
    // 목업 데이터 제거
    lowFloorBuses.value = [];
  } finally {
    isLoading.value = false;
  }
}

const checkAdminRole = async () => {
  try {
    // 실제 API 호출로 변경
    const response = await axios.get('https://localhost:8081/api/auth/check-role')
    isAdmin.value = response.data.isAdmin
  } catch (error) {
    console.error('관리자 권한 확인 실패:', error)
    isAdmin.value = false
  }
}

const fetchLowFloorBusDetail = async (id) => {
  try {
    isLoading.value = true;
    error.value = '';
    console.log(`저상버스 대체 안내 상세 조회 요청: ID=${id}`);
    
    try {
      const response = await axios.get(`https://localhost:8081/api/public/lowfloorbuses/${id}`);
      console.log('저상버스 대체 안내 상세 응답:', response.data);
      
      if (response.data) {
        selectedLowFloorBus.value = {
          ...response.data,
          createdAt: response.data.createdAt || response.data.createdDate || new Date().toISOString(),
          content: response.data.content || '',
          viewCount: response.data.viewCount || 0
        };
      } else {
        throw new Error('응답 데이터가 없습니다');
      }
    } catch (apiError) {
      console.error('API 호출 오류:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('저상버스 대체 안내 상세 로딩 실패:', error);
    error.value = '저상버스 대체 안내를 불러오는데 실패했습니다.';
    selectedLowFloorBus.value = null;
  } finally {
    isLoading.value = false;
  }
}

const goBack = () => {
  selectedLowFloorBus.value = null;
  router.push('/lowfloorbus');
}

const isImageFile = (file) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = file.originalName.split('.').pop().toLowerCase();
  return imageExtensions.includes(extension);
}

const getImageUrl = (file) => {
  return `https://localhost:8081/api/public/files/${file.id}`;
}

const downloadFile = (file) => {
  window.open(`https://localhost:8081/api/public/files/${file.id}/download`, '_blank');
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchLowFloorBusDetail(newId);
  } else {
    selectedLowFloorBus.value = null;
    fetchLowFloorBuses(1);
  }
}, { immediate: true });

onMounted(async () => {
  await checkAdminRole();
  if (!route.params.id) {
    fetchLowFloorBuses(1);
  }
});
</script>

<style scoped>
.html-content {
  max-width: 100%;
  overflow-x: auto;
}

.html-content img {
  max-width: 100%;
  height: auto;
}
</style> 