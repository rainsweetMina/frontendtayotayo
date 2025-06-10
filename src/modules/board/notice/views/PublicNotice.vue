<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">공지사항</h1>
      <router-link
        v-if="isAdmin"
        to="/notice/write"
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
      <button @click="fetchNotices(1)" class="ml-4 text-blue-500 hover:underline">
        다시 시도
      </button>
    </div>

    <!-- 공지사항 상세 페이지 -->
    <div v-else-if="selectedNotice" class="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-2xl font-bold mb-4">{{ selectedNotice.title }}</h2>
      <div class="flex justify-between text-gray-600 mb-6 border-b pb-4">
        <div>작성일: {{ formatDate(selectedNotice.createdAt) }}</div>
        <div>조회수: {{ selectedNotice.viewCount || 0 }}</div>
      </div>
      
      <!-- HTML 콘텐츠 렌더링 -->
      <div v-if="selectedNotice.content" v-html="selectedNotice.content" class="html-content prose max-w-none mb-8"></div>
      <div v-else class="text-gray-500 italic mb-8">본문 내용이 없습니다.</div>
      
      <!-- 첨부파일 다운로드 섹션 -->
      <div v-if="selectedNotice.files && selectedNotice.files.length > 0" class="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 class="text-lg font-medium text-gray-900 mb-2">첨부파일</h3>
        
        <div v-for="(file, index) in selectedNotice.files" :key="index" class="mb-3">
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

    <!-- 공지사항 목록 -->
    <div v-else-if="notices.length > 0" class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200">
        <li v-for="notice in notices" :key="notice.id">
          <router-link
            :to="'/notice/' + notice.id"
            class="block hover:bg-gray-50"
          >
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="text-lg font-medium text-gray-900 truncate">
                    {{ notice.title }}
                  </p>
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <span>{{ formatDate(notice.createdAt) }}</span>
                    <span class="mx-2">•</span>
                    <span>조회 {{ notice.viewCount || 0 }}</span>
                    <span v-if="notice.hasAttachment" class="ml-2">
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
    
    <!-- 공지사항 없음 -->
    <div v-else class="bg-white shadow rounded-md p-8 text-center">
      <p class="text-gray-500 text-lg">등록된 공지사항이 없습니다.</p>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="!selectedNotice && totalPages > 1" class="mt-6 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="fetchNotices(page)"
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

const notices = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isAdmin = ref(false)
const selectedNotice = ref(null)
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const fetchNotices = async (page = 1) => {
  try {
    isLoading.value = true;
    error.value = '';
    console.log(`공지사항 목록 조회 요청: 페이지=${page}`);
    
    try {
      // 일반 사용자용 공지사항 API로 변경
      const response = await axios.get(`https://localhost:8081/api/public/notices`);
      console.log('공지사항 목록 응답:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        // 배열 형태 응답 (public API 응답 형식)
        notices.value = response.data.map(notice => ({
          ...notice,
          createdAt: notice.createdAt || notice.createdDate || new Date().toISOString(),
          content: notice.content || '',
          viewCount: notice.viewCount || 0
        }));
        totalPages.value = 1;
      } else if (response.data && response.data.content) {
        // 페이징된 응답 구조
        notices.value = response.data.content.map(notice => ({
          ...notice,
          createdAt: notice.createdAt || notice.createdDate || new Date().toISOString(),
          content: notice.content || '',
          viewCount: notice.viewCount || 0
        }));
        totalPages.value = response.data.totalPages || 1;
      } else if (response.data) {
        // 단일 객체 응답
        notices.value = [{
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
    console.error('공지사항 로딩 실패:', error);
    console.error('응답 데이터:', error.response?.data);
    console.error('응답 상태:', error.response?.status);
    error.value = '공지사항을 불러오는데 실패했습니다.';
    
    // 에러 발생 시 목업 데이터 표시
    notices.value = [
      {
        id: 1,
        title: '시스템 점검 안내',
        content: '시스템 점검으로 인해 일시적으로 서비스가 중단될 수 있습니다.',
        createdAt: '2024-10-08',
        viewCount: 42
      },
      {
        id: 2,
        title: '추석 연휴 시내버스 특별운행 안내',
        content: '추석 연휴 기간 동안 시내버스 특별 운행 일정을 안내드립니다.',
        createdAt: '2024-08-30',
        viewCount: 56
      }
    ];
  } finally {
    isLoading.value = false;
  }
}

const checkAdminRole = async () => {
  try {
    // API 호출 오류로 인해 잠시 기본값 설정
    isAdmin.value = false;
    
    // 오류 발생하는 API 주석 처리
    // const response = await axios.get('https://localhost:8081/api/auth/check-role')
    // isAdmin.value = response.data.hasRole === 'ROLE_ADMIN'
  } catch (error) {
    console.error('관리자 권한 확인 실패:', error);
    isAdmin.value = false;
  }
}

const downloadFile = async (file, index) => {
  try {
    const noticeId = selectedNotice.value.id;
    // 일반 사용자용 첨부파일 다운로드 경로로 변경
    let url = `https://localhost:8081/api/public/notices/${noticeId}/files/${index}`;
    
    const response = await axios.get(url, {
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.originalName || file.fileName || '첨부파일';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('파일 다운로드 실패:', error);
    alert('파일 다운로드에 실패했습니다.');
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error);
    return dateString;
  }
}

// 공지사항 상세 조회
const fetchNoticeDetail = async (id) => {
  try {
    isLoading.value = true;
    error.value = '';
    console.log(`공지사항 상세 조회 요청: ID=${id}`);
    
    try {
      // 일반 사용자용 공지사항 상세 API로 변경
      const response = await axios.get(`https://localhost:8081/api/public/notices/${id}`);
      console.log('공지사항 상세 응답:', response.data);
      
      if (!response.data || !response.data.id) {
        throw new Error('유효하지 않은 공지사항 데이터');
      }
      
      // 응답 데이터 구조 조정 - createdAt 없는 경우 createdDate 사용
      const noticeData = {
        ...response.data,
        createdAt: response.data.createdAt || response.data.createdDate,
        content: response.data.content || '',
        viewCount: response.data.viewCount || 0,
        files: response.data.files || []
      };
      
      selectedNotice.value = noticeData;
    } catch (apiError) {
      console.error('API 호출 오류:', apiError);
      // 상세 데이터 실패 시 목업 데이터 사용
      selectedNotice.value = {
        id: parseInt(id),
        title: '공지사항 ' + id,
        content: '해당 공지사항을 불러올 수 없습니다.',
        createdAt: new Date().toISOString(),
        viewCount: 0,
        files: []
      };
      throw apiError;
    }
  } catch (error) {
    console.error('공지사항 상세 조회 실패:', error);
    console.error('응답 데이터:', error.response?.data);
    console.error('응답 상태:', error.response?.status);
    error.value = '공지사항을 불러오는데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
}

// 이미지 파일인지 확인하는 함수
const isImageFile = (file) => {
  if (!file || !file.fileType) return false;
  return file.fileType.startsWith('image/');
};

// 이미지 URL 생성
const getImageUrl = (file, index) => {
  // 일반 사용자용 이미지 조회 경로로 변경
  return `https://localhost:8081/api/public/notices/${selectedNotice.value.id}/images/${index}`;
};

// 파일 크기 포맷팅
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 목록으로 돌아가기
const goBack = () => {
  console.log('목록으로 돌아가기 클릭');
  
  // 상태 초기화
  selectedNotice.value = null;
  
  // 라우터로 공지사항 목록 페이지로 이동
  router.push('/notice');
  
  // 바로 목록 데이터 로드
  setTimeout(() => {
    fetchNotices(1);
  }, 100);
};

// 라우터 변경 감지
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchNoticeDetail(newId);
  } else {
    selectedNotice.value = null;
    // 공지사항 목록 로드
    fetchNotices(1);
  }
}, { immediate: true });

onMounted(() => {
  console.log('Notice 컴포넌트 마운트됨, 경로 params:', route.params);
  if (!route.params.id) {
    fetchNotices(1);
  }
  checkAdminRole();
});
</script>

<style>
/* Quill 에디터 콘텐츠 스타일 */
.html-content {
  font-size: 16px;
  line-height: 1.6;
}

/* 이미지 스타일 */
.html-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
  border-radius: 4px;
}

/* 텍스트 스타일 */
.html-content p {
  margin-bottom: 1rem;
}

/* 제목 스타일 */
.html-content h1, 
.html-content h2, 
.html-content h3, 
.html-content h4, 
.html-content h5, 
.html-content h6 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.25;
}

/* 리스트 스타일 */
.html-content ul, 
.html-content ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.html-content li {
  margin-bottom: 0.5rem;
}

/* 블록 스타일 */
.html-content blockquote {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
  color: #4a5568;
}

/* 코드 블록 */
.html-content pre {
  background-color: #f7fafc;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

/* 표 스타일 */
.html-content table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1rem;
}

.html-content th, 
.html-content td {
  border: 1px solid #e2e8f0;
  padding: 0.5rem;
}

.html-content th {
  background-color: #f7fafc;
  font-weight: 600;
  text-align: left;
}

/* 링크 스타일 */
.html-content a {
  color: #2a7dc0;
  text-decoration: underline;
}

.html-content a:hover {
  text-decoration: none;
}

/* Quill 특수 포맷 클래스 */
.html-content .ql-align-center {
  text-align: center;
}

.html-content .ql-align-right {
  text-align: right;
}

.html-content .ql-align-justify {
  text-align: justify;
}

.html-content .ql-indent-1 {
  padding-left: 3em;
}

.html-content .ql-indent-2 {
  padding-left: 6em;
}

.html-content .ql-indent-3 {
  padding-left: 9em;
}

.html-content .ql-bg-black {
  background-color: #000;
}

.html-content .ql-bg-red {
  background-color: #e60000;
}

.html-content .ql-bg-orange {
  background-color: #f90;
}

.html-content .ql-bg-yellow {
  background-color: #ff0;
}

.html-content .ql-bg-green {
  background-color: #008a00;
}

.html-content .ql-bg-blue {
  background-color: #06c;
}

.html-content .ql-bg-purple {
  background-color: #93f;
}

.html-content .ql-color-white {
  color: #fff;
}

.html-content .ql-color-red {
  color: #e60000;
}

.html-content .ql-color-orange {
  color: #f90;
}

.html-content .ql-color-yellow {
  color: #ff0;
}

.html-content .ql-color-green {
  color: #008a00;
}

.html-content .ql-color-blue {
  color: #06c;
}

.html-content .ql-color-purple {
  color: #93f;
}

/* Quill 글씨 크기 관련 클래스 */
.html-content .ql-size-small {
  font-size: 0.75em;
}

.html-content .ql-size-normal {
  font-size: 1em;
}

.html-content .ql-size-large {
  font-size: 1.5em;
}

.html-content .ql-size-huge {
  font-size: 2.5em;
}
</style> 