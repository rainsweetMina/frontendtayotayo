<template>
  <div class="notice-detail">
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="notice" class="notice-content">
      <div class="notice-header">
        <h2>{{ notice.title }}</h2>
        <div class="notice-meta">
          <span class="badge bg-secondary me-2">{{ notice.author }}</span>
          <span class="text-muted">{{ formatDate(notice.createdDate) }}</span>
        </div>
      </div>

      <div class="notice-body">
        <div v-if="notice.showPopup" class="alert alert-info mb-3">
          <strong>팝업 표시:</strong> 
          {{ formatDate(notice.popupStart) }} ~ {{ formatDate(notice.popupEnd) }}
        </div>

        <div class="content-area">
          <pre>{{ notice.content }}</pre>
        </div>

        <div v-if="notice.files && notice.files.length > 0" class="attachment mt-4">
          <h5>첨부파일</h5>
          <div v-for="(file, index) in notice.files" :key="index" class="mb-2">
            <button @click="downloadFile(file, index)" 
                    class="btn btn-sm btn-outline-primary me-2">
              <i class="bi bi-download"></i> {{ getFileName(file) }}
            </button>
          </div>
        </div>
        
        <div v-else-if="notice.fileUrl || notice.fileDownloadUrl || notice.filePath" class="attachment mt-4">
          <h5>첨부파일</h5>
          <button @click="downloadSingleFile()" 
                  class="btn btn-sm btn-outline-primary">
            <i class="bi bi-download"></i> {{ notice.fileName || '파일 다운로드' }}
          </button>
        </div>
        
        <div v-else-if="notice.fileName" class="attachment mt-4">
          <h5>첨부파일</h5>
          <button @click="downloadByFileName()" 
                  class="btn btn-sm btn-outline-primary">
            <i class="bi bi-download"></i> {{ notice.fileName }}
          </button>
        </div>
      </div>

      <div class="notice-actions mt-4">
        <router-link to="/admin/notices" class="btn btn-secondary">목록</router-link>
        <router-link :to="`/admin/notices/${notice.id}/edit`" class="btn btn-warning ms-2">수정</router-link>
        <button @click="handleDelete" class="btn btn-danger ms-2">삭제</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNoticeApi } from '../composables/useNoticeApi';
import axios from '@/config/axios';

export default {
  name: 'NoticeDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const notice = ref(null);
    const isLoading = ref(false);
    const error = ref('');

    const { getNoticeDetail, deleteNotice } = useNoticeApi();

    const fetchNotice = async () => {
      try {
        isLoading.value = true;
        error.value = '';
        const response = await getNoticeDetail(route.params.id);
        notice.value = response.data;
        console.log('Notice data:', notice.value);
        
        if (notice.value) {
          console.log('File related fields:', {
            fileUrl: notice.value.fileUrl,
            files: notice.value.files,
            fileName: notice.value.fileName,
            fileUrls: notice.value.fileUrls,
            attachments: notice.value.attachments,
            filePath: notice.value.filePath,
            fileId: notice.value.fileId
          });
          
          // files 배열 상세 정보
          if (notice.value.files && Array.isArray(notice.value.files)) {
            console.log('Files array detail:', notice.value.files);
            notice.value.files.forEach((file, index) => {
              console.log(`File ${index}:`, file);
              console.log(`File ${index} keys:`, Object.keys(file));
              
              // NoticeFile 엔티티 구조 확인
              if (file && typeof file === 'object') {
                console.log(`File ${index} details:`, {
                  id: file.id,
                  originalName: file.originalName,
                  storedName: file.storedName,
                  fileType: file.fileType,
                  fileSize: file.fileSize
                });
              }
            });
          }
          
          // 전체 notice 객체의 키 확인
          console.log('All notice keys:', Object.keys(notice.value));
        }
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
        error.value = '공지사항을 불러오는데 실패했습니다.';
      } finally {
        isLoading.value = false;
      }
    };

    const handleDelete = async () => {
      if (confirm('정말 삭제하시겠습니까?')) {
        try {
          await deleteNotice(route.params.id);
          alert('삭제되었습니다.');
          router.push('/admin/notices');
        } catch (err) {
          console.error('삭제 실패:', err);
          alert('삭제에 실패했습니다.');
        }
      }
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // 파일 다운로드 URL 생성
    const getFileDownloadUrl = (file, index) => {
      // NoticeFile 엔티티 구조에 맞게 처리
      if (file && typeof file === 'object') {
        // originalName이 있는 경우 (NoticeFile 엔티티)
        if (file.originalName) {
          return `https://localhost:8081/api/admin/notices/${notice.value.id}/files/${index}`;
        }
        
        // file 객체에 직접 URL이 있는 경우
        if (file.url || file.fileUrl || file.downloadUrl) {
          const url = file.url || file.fileUrl || file.downloadUrl;
          return url.startsWith('http') ? url : `https://localhost:8081${url}`;
        }
      }
      
      // file이 문자열인 경우 (파일명만 있는 경우)
      if (typeof file === 'string') {
        return `https://localhost:8081/api/admin/notices/${notice.value.id}/download?filename=${encodeURIComponent(file)}`;
      }
      
      // 기본 다운로드 경로
      return `https://localhost:8081/api/admin/notices/${notice.value.id}/download`;
    };

    // 파일명 추출
    const getFileName = (file) => {
      if (typeof file === 'string') return file;
      // NoticeFile 엔티티 구조
      return file.originalName || file.fileName || file.name || `파일 ${file.id || ''}`;
    };

    // 단일 파일 URL 가져오기
    const getSingleFileUrl = () => {
      const n = notice.value;
      
      // 다양한 가능한 필드명 확인
      const url = n.fileUrl || n.fileDownloadUrl || n.filePath || n.downloadUrl;
      
      if (url) {
        // 절대 경로인지 확인
        return url.startsWith('http') ? url : `https://localhost:8081${url}`;
      }
      
      // 기본 다운로드 경로 (첫 번째 파일)
      return `https://localhost:8081/api/admin/notices/${n.id}/download`;
    };

    // 파일 다운로드 처리
    const downloadFile = async (file, index) => {
      try {
        const url = getFileDownloadUrl(file, index);
        
        // axios로 파일 다운로드 시도
        const response = await axios.get(url, {
          responseType: 'blob'
        });
        
        // Blob을 다운로드
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = getFileName(file);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('파일 다운로드 실패:', error);
        
        if (error.response?.status === 404) {
          alert('파일을 찾을 수 없습니다. 백엔드에 파일 다운로드 API가 구현되지 않았거나 파일이 삭제되었을 수 있습니다.');
        } else if (error.response?.status === 405) {
          alert('파일 다운로드 기능이 아직 구현되지 않았습니다. 백엔드 개발자에게 문의해주세요.');
        } else {
          alert('파일 다운로드 중 오류가 발생했습니다.');
        }
      }
    };
    
    // 단일 파일 다운로드
    const downloadSingleFile = async () => {
      try {
        const url = getSingleFileUrl();
        
        const response = await axios.get(url, {
          responseType: 'blob'
        });
        
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = notice.value.fileName || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('파일 다운로드 실패:', error);
        
        if (error.response?.status === 404) {
          alert('파일을 찾을 수 없습니다.');
        } else if (error.response?.status === 405) {
          alert('파일 다운로드 기능이 백엔드에 구현되지 않았습니다.\n\n백엔드 개발자에게 다음 API 구현을 요청하세요:\nGET /api/admin/notices/{id}/download');
        } else {
          alert('파일 다운로드 중 오류가 발생했습니다.');
        }
      }
    };
    
    // 파일명으로 다운로드
    const downloadByFileName = () => {
      downloadSingleFile();
    };

    onMounted(() => {
      fetchNotice();
    });

    return {
      notice,
      isLoading,
      error,
      handleDelete,
      formatDate,
      getFileDownloadUrl,
      getFileName,
      getSingleFileUrl,
      downloadFile,
      downloadSingleFile,
      downloadByFileName
    };
  }
};
</script>

<style scoped>
.notice-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.notice-content {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notice-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.notice-header h2 {
  margin-bottom: 10px;
}

.notice-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.content-area {
  min-height: 300px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.content-area pre {
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  font-family: inherit;
}

.attachment {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style> 