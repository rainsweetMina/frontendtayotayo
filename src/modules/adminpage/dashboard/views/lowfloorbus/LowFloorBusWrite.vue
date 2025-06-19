<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="mb-8 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEditMode ? '저상버스 대체 안내 수정' : '새 저상버스 대체 안내 작성' }}</h2>
    </div>

    <div class="bg-white rounded-lg shadow p-8">
      <form @submit.prevent="saveLowFloorBus">
        <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {{ error }}
        </div>

        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-4 py-2"
            required
            placeholder="제목을 입력하세요"
            :disabled="isSaving"
          />
        </div>
        
        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <QuillEditor
            v-model:content="formData.content"
            contentType="html"
            toolbar="full"
            theme="snow"
            :disabled="isSaving"
            ref="quillEditor"
            class="quill-editor border rounded-md"
          />
        </div>

        <div class="mb-6">
          <label for="file" class="block text-sm font-medium text-gray-700 mb-2">첨부파일</label>
          <input
            id="file"
            type="file"
            class="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            @change="handleFileUpload"
            multiple
            :disabled="isSaving"
          />
          <small class="text-gray-400">* 파일은 선택사항입니다</small>
          <div v-if="uploadedFiles.length > 0" class="mt-2 space-y-2">
            <div v-for="(file, index) in uploadedFiles" :key="index" class="flex items-center space-x-2">
              <span class="text-gray-700">{{ file.name }}</span>
              <button type="button" class="text-xs text-red-600 hover:underline" @click="removeFile(index)">
                삭제
              </button>
            </div>
          </div>
          
          <!-- 기존 첨부파일 목록 (수정 모드) -->
          <div v-if="existingFiles.length > 0" class="mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">기존 첨부파일</h4>
            <div v-for="(file, index) in existingFiles" :key="file.id" class="flex items-center justify-between space-x-2 mb-2">
              <span class="text-gray-700">{{ file.originalName }}</span>
              <div class="flex items-center">
                <a :href="`https://localhost:8081/api/admin/files/${file.id}/download`" target="_blank" class="text-blue-500 hover:text-blue-700 mr-2">
                  다운로드
                </a>
                <button type="button" class="text-xs text-red-600 hover:underline" @click="removeExistingFile(index)">
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="$router.push('/admin/lowfloorbus')"
            :disabled="isSaving"
          >
            취소
          </button>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isSaving"
          >
            {{ isSaving ? '저장 중...' : (isEditMode ? '수정' : '등록') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useLowFloorBusApi } from '../../composables/useLowFloorBusApi.js';
import axios from '@/config/axios.js';

// Base64 형식의 이미지를 Blob으로 변환
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// 이미지 압축 함수
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 크기 비율 유지하면서 축소
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // 압축된 이미지를 Blob으로 변환
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type, quality);
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export default {
  name: 'LowFloorBusWrite',
  components: {
    QuillEditor
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;
    const isEditMode = computed(() => !!id);
    const quillEditor = ref(null);
    
    const formData = ref({
      title: '',
      content: ''
    });
    
    const uploadedFiles = ref([]);
    const existingFiles = ref([]);
    const filesToDelete = ref([]);
    const isLoading = ref(false);
    const isSaving = ref(false);
    const error = ref('');

    const { getLowFloorBusDetail, createLowFloorBus, updateLowFloorBus } = useLowFloorBusApi();

    const fetchLowFloorBusDetail = async () => {
      if (!isEditMode.value) return;
      
      try {
        isLoading.value = true;
        error.value = '';
        const response = await getLowFloorBusDetail(id);
        const lowFloorBus = response.data;
        
        formData.value = {
          title: lowFloorBus.title || '',
          content: lowFloorBus.content || ''
        };
        
        if (lowFloorBus.files && lowFloorBus.files.length > 0) {
          existingFiles.value = [...lowFloorBus.files];
        }
      } catch (err) {
        console.error('저상버스 대체 안내 상세 조회 실패:', err);
        error.value = '저상버스 대체 안내 정보를 불러오는데 실패했습니다.';
      } finally {
        isLoading.value = false;
      }
    };

    const handleFileUpload = (event) => {
      const files = Array.from(event.target.files);
      uploadedFiles.value = [...uploadedFiles.value, ...files];
    };

    const removeFile = (index) => {
      uploadedFiles.value.splice(index, 1);
    };

    const removeExistingFile = (index) => {
      const fileToDelete = existingFiles.value[index];
      filesToDelete.value.push(fileToDelete.id);
      existingFiles.value.splice(index, 1);
    };

    // 이미지를 에디터에 삽입하는 함수
    const insertImage = (url) => {
      if (!quillEditor.value) return;
      const quill = quillEditor.value.getQuill();
      const range = quill.getSelection() || { index: quill.getLength() - 1, length: 1 };
      quill.insertEmbed(range.index, 'image', url);
      quill.setSelection(range.index + 1);
    };

    const saveLowFloorBus = async () => {
      if (!formData.value.title.trim()) {
        error.value = '제목을 입력해주세요.';
        return;
      }

      try {
        isSaving.value = true;
        error.value = '';
        
        // 에디터 내용에서 이미지 태그 검색
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        let hasInlineImages = false;
        let processedContent = formData.value.content;
        
        // 모든 base64 이미지를 서버에 업로드하고 URL로 변경
        while ((match = imgRegex.exec(formData.value.content)) !== null) {
          const imageUrl = match[1];
          hasInlineImages = true;
          
          // 이미 서버 URL인 경우에는 변환하지 않음
          if (imageUrl.startsWith('https://localhost:8081/api/')) {
            continue;
          }
          
          // Base64 이미지인 경우 서버에 업로드하고 URL로 변환
          if (imageUrl.startsWith('data:image/')) {
            try {
              // Base64 이미지를 서버에 업로드하고 URL로 변환
              const blob = dataURLtoBlob(imageUrl);
              const imgFormData = new FormData();
              imgFormData.append('file', blob, 'embedded-image.png');
              
              // 동기적으로 업로드 처리
              const uploadResponse = await axios.post('/api/admin/files/upload', imgFormData);
              const newUrl = uploadResponse.data.url;
              
              // 원본 URL을 새 URL로 교체
              processedContent = processedContent.replace(imageUrl, newUrl);
              console.log('이미지 업로드 성공:', newUrl);
            } catch (imgError) {
              console.error('이미지 업로드 실패:', imgError);
              throw imgError; // 이미지 업로드 실패 시 전체 과정 중단
            }
          }
        }
        
        // FormData 객체 생성
        const formDataToSend = new FormData();
        
        // lowFloorBus 객체 생성 (JSON 형태로 전송)
        const lowFloorBusData = {
          title: formData.value.title.trim(),
          author: '관리자', // 기본값으로 '관리자' 설정
          content: processedContent // 이미지 URL이 변환된 콘텐츠
        };
        
        console.log('전송할 데이터:', JSON.stringify(lowFloorBusData));
        
        // lowFloorBus JSON 객체를 FormData에 추가
        const lowFloorBusBlob = new Blob([JSON.stringify(lowFloorBusData)], {
          type: 'application/json'
        });
        formDataToSend.append('lowFloorBus', lowFloorBusBlob);
        
        // 새 파일 추가
        if (uploadedFiles.value.length > 0) {
          uploadedFiles.value.forEach(file => {
            formDataToSend.append('files', file);
          });
        }
        
        // 삭제할 파일 ID 추가 (수정 모드에서만)
        if (isEditMode.value && filesToDelete.value.length > 0) {
          formDataToSend.append('deleteFileIds', JSON.stringify(filesToDelete.value));
        }
        
        // FormData 내용 확인
        console.log('FormData 전송 준비:');
        for (const [key, value] of formDataToSend.entries()) {
          if (key === 'lowFloorBus') {
            console.log(`- ${key}: [Blob]`);
          } else if (key === 'files') {
            console.log(`- ${key}: ${value.name} (${value.type}, ${value.size} bytes)`);
          } else {
            console.log(`- ${key}: ${value}`);
          }
        }
        
        let response;
        if (isEditMode.value) {
          response = await updateLowFloorBus(id, formDataToSend);
        } else {
          response = await createLowFloorBus(formDataToSend);
        }
        
        console.log('저장 성공:', response.data);
        router.push('/admin/lowfloorbus');
      } catch (err) {
        console.error('저상버스 대체 안내 저장 실패:', err);
        if (err.response) {
          console.error('에러 응답:', err.response.data);
          error.value = `저상버스 대체 안내 저장에 실패했습니다: ${err.response.data}`;
        } else {
          error.value = '저상버스 대체 안내 저장에 실패했습니다.';
        }
      } finally {
        isSaving.value = false;
      }
    };

    const formatFileSize = (bytes) => {
      if (!bytes) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    onMounted(fetchLowFloorBusDetail);

    return {
      formData,
      uploadedFiles,
      existingFiles,
      isLoading,
      isSaving,
      error,
      isEditMode,
      quillEditor,
      handleFileUpload,
      removeFile,
      removeExistingFile,
      saveLowFloorBus,
      formatFileSize,
      insertImage
    };
  }
};
</script>

<style>
.quill-editor {
  height: 300px;
  margin-bottom: 20px;
}
.ql-editor {
  font-size: 16px;
  line-height: 1.6;
  min-height: 200px;
}
.ql-editor img {
  max-width: 100%;
  height: auto;
}
</style> 