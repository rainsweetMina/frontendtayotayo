<template>
  <div class="board-main-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">저상버스 대체 안내</h1>
      <router-link
        v-if="isAdmin"
        to="/admin/lowfloorbus/new"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        글쓰기
      </router-link>
    </div>

    <!-- 로딩 인디케이터 -->
    <div v-if="isLoading && !selectedLowFloorBus" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- 오류 메시지 -->
    <div v-else-if="error && !selectedLowFloorBus" class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
      <button @click="fetchLowFloorBuses()" class="ml-4 text-blue-500 hover:underline">
        다시 시도
      </button>
    </div>

    <!-- 저상버스 대체 안내 상세 페이지 -->
    <div v-else-if="selectedLowFloorBus" class="p-6 mb-6 bg-white rounded-md shadow">
      <h2 class="text-2xl font-bold mb-4">{{ selectedLowFloorBus.title }}</h2>
      <div class="flex justify-between text-gray-600 mb-6 border-b pb-4">
        <div>작성일: {{ formatDate(selectedLowFloorBus.createdAt) }}</div>
        <div>조회수: {{ selectedLowFloorBus.viewCount || 0 }}</div>
      </div>

      <!-- HTML 콘텐츠 렌더링 -->
      <div v-if="selectedLowFloorBus.content" v-html="selectedLowFloorBus.content" class="html-content max-w-none mb-8"></div>
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
    <div v-else-if="pagedLowFloorBuses.length > 0" class="bg-white rounded-md shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              번호
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              제목
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              등록일
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              조회수
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(lowFloorBus, index) in pagedLowFloorBuses" :key="lowFloorBus.id"
            :class="[lowFloorBus.topNotice ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50']">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center font-bold">
              <span v-if="lowFloorBus.topNotice" class="font-bold bg-blue-500 text-white px-2 py-1 rounded">공지</span>
              <span v-else>{{ lowFloorBuses.length - ((currentPage - 1) * pageSize + index) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
              <router-link
                :to="'/lowfloorbus/' + lowFloorBus.id"
                :class="{'text-gray-900 hover:text-blue-600': !lowFloorBus.topNotice, 'font-bold text-black': lowFloorBus.topNotice}"
              >
                {{ lowFloorBus.title }}
                <span v-if="lowFloorBus.hasAttachment" class="ml-2 inline-block">
                  <svg class="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </span>
              </router-link>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              {{ formatDate(lowFloorBus.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              {{ lowFloorBus.viewCount || 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 저상버스 대체 안내 없음 -->
    <div v-else class="p-8 text-center bg-white rounded-md shadow">
      <p class="text-gray-500 text-lg">등록된 저상버스 대체 안내가 없습니다.</p>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="!selectedLowFloorBus && totalPages > 1" class="mt-6 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          @click.prevent="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{ 'text-gray-300 cursor-not-allowed': currentPage === 1 }"
        >
          이전
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click.prevent="changePage(page)"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page }"
        >
          {{ page }}
        </button>

        <button
          @click.prevent="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{ 'text-gray-300 cursor-not-allowed': currentPage === totalPages }"
        >
          다음
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
// Quill 스타일 가져오기
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const lowFloorBuses = ref([])
const currentPage = ref(1)
const pageSize = 10 // 한 페이지당 표시할 항목 수
const isAdmin = ref(false)
const selectedLowFloorBus = ref(null)
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const error = ref('')

// 현재 페이지에 표시할 저상버스 대체 안내 목록
const pagedLowFloorBuses = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return lowFloorBuses.value.slice(startIndex, endIndex);
});

// 전체 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(lowFloorBuses.value.length / pageSize);
});

const fetchLowFloorBuses = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await api.get('/api/public/lowfloorbuses')
    console.log('저상버스 대체안내 API 응답:', response.data)
    
    if (response.data && Array.isArray(response.data)) {
      lowFloorBuses.value = response.data
    } else if (response.data && Array.isArray(response.data.content)) {
      lowFloorBuses.value = response.data.content
    } else {
      lowFloorBuses.value = []
    }
  } catch (err) {
    console.error('저상버스 대체안내 로드 실패:', err)
    error.value = '저상버스 대체안내를 불러오는데 실패했습니다.'
    lowFloorBuses.value = []
  } finally {
    isLoading.value = false
  }
}

const changePage = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  currentPage.value = newPage;
  // 페이지 변경 시 상단으로 스크롤
  if (typeof window !== 'undefined') window.scrollTo({top: 0, behavior: 'smooth'});
};

const checkUserRole = async () => {
  try {
    const response = await api.get('/api/auth/check-role')
    userRole.value = response.data.role
    isAdmin.value = response.data.role === 'ADMIN'
  } catch (err) {
    console.error('사용자 역할 확인 실패:', err)
    userRole.value = 'USER'
    isAdmin.value = false
  }
}

const fetchLowFloorBusDetail = async (id) => {
  try {
    const response = await api.get(`/api/public/lowfloorbuses/${id}`)
    return response.data
  } catch (err) {
    console.error('저상버스 대체안내 상세 조회 실패:', err)
    throw err
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
  return `${import.meta.env.VITE_BASE_URL}/api/public/files/${file.id}`;
}

const downloadFile = (file) => {
  window.open(`${import.meta.env.VITE_BASE_URL}/api/public/files/${file.id}/download`, '_blank');
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
    currentPage.value = 1; // 목록으로 돌아올 때 첫 페이지로 초기화
    fetchLowFloorBuses();
  }
}, { immediate: true });

onMounted(async () => {
  await checkUserRole();
  if (!route.params.id) {
    fetchLowFloorBuses();
  }
});
</script>

<style scoped>
@import "@/modules/board/assets/boardCommon.css";
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
</style>
