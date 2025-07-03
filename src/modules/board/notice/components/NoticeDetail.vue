<template>
  <div>
    <!-- 로딩 인디케이터 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- 오류 메시지 -->
    <div v-else-if="error" class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
      <button @click="fetchNoticeDetail(noticeId)" class="ml-4 text-blue-500 hover:underline">
        다시 시도
      </button>
    </div>

    <!-- 공지사항 상세 내용 -->
    <div v-else-if="notice" class="content-card p-6 mb-6">
      <h2 class="text-2xl font-bold mb-4">{{ notice.title }}</h2>
      <div class="flex justify-between text-gray-600 mb-6 border-b pb-4">
        <div>작성일: {{ formatDate(notice.createdAt) }}</div>
        <div>조회수: {{ notice.viewCount || 0 }}</div>
      </div>
      
      <!-- HTML 콘텐츠 렌더링 -->
      <div v-if="notice.content" v-html="notice.content" class="html-content max-w-none mb-8"></div>
      <div v-else class="text-gray-500 italic mb-8">본문 내용이 없습니다.</div>
      
      <!-- 첨부파일 다운로드 섹션 -->
      <div v-if="notice.files && notice.files.length > 0" class="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 class="text-lg font-medium text-gray-900 mb-2">첨부파일</h3>
        
        <div v-for="(file, index) in notice.files" :key="index" class="mb-3">
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
      
      <div class="mt-6 flex justify-end">
        <button 
          @click="goBack" 
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          목록으로
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
// Quill 스타일 가져오기
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  noticeId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['back-to-list'])

const notice = ref(null)
const router = useRouter()
const isLoading = ref(false)
const error = ref('')

// 공지사항 상세 조회
const fetchNoticeDetail = async (id) => {
  try {
    isLoading.value = true;
    error.value = '';
    console.log(`공지사항 상세 조회 요청: ID=${id}`);
    
    try {
      // 일반 사용자용 공지사항 상세 API로 변경
      const response = await axios.get(`/api/public/notices/${id}`);
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
      
      notice.value = noticeData;
    } catch (apiError) {
      console.error('API 호출 오류:', apiError);
      // 상세 데이터 실패 시 목업 데이터 사용
      notice.value = {
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

const downloadFile = async (file, index) => {
  try {
    let url = `/api/public/notices/${props.noticeId}/files/${index}`
    
    // 파일 타입에 따라 다른 엔드포인트 사용
    if (file.fileType && file.fileType.startsWith('image/')) {
      url = `/api/public/notices/${props.noticeId}/images/${index}`
    }
    
    const response = await axios.get(url, {
      responseType: 'blob'
    })
    
    // 파일 다운로드 처리
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = file.originalName || '첨부파일'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('파일 다운로드 실패:', error)
    alert('파일 다운로드에 실패했습니다.')
  }
}

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

// 이미지 파일인지 확인하는 함수
const isImageFile = (file) => {
  if (!file || !file.fileType) return false;
  return file.fileType.startsWith('image/');
};

// 이미지 URL 생성
const getImageUrl = (file, index) => {
  return `${import.meta.env.VITE_BASE_URL}/api/public/notices/${props.noticeId}/images/${index}`
}

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
  emit('back-to-list');
};

onMounted(() => {
  console.log('NoticeDetail 컴포넌트 마운트됨, noticeId:', props.noticeId);
  fetchNoticeDetail(props.noticeId);
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

/* 카드 스타일 */
.content-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>