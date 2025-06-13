<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="mb-8 border-b pb-4">
      <h2 class="text-2xl font-bold text-gray-800">{{ isEdit ? '공지사항 수정' : '새 공지사항 작성' }}</h2>
    </div>

    <div class="bg-white rounded-lg shadow p-8">
      <form @submit.prevent="handleSubmit">
        <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {{ errorMessage }}
        </div>

        <div class="mb-6">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base px-4 py-2"
            required
            placeholder="제목을 입력하세요"
            :disabled="isSubmitting"
          />
        </div>
        
        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <QuillEditor
            v-model:content="form.content"
            contentType="html"
            toolbar="full"
            theme="snow"
            :disabled="isSubmitting"
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
            @change="handleFileChange"
            multiple
            :disabled="isSubmitting"
          />
          <small class="text-gray-400">* 파일은 선택사항입니다</small>
          <div v-if="form.files.length > 0" class="mt-2 space-y-2">
            <div v-for="(file, index) in form.files" :key="index" class="flex items-center space-x-2">
              <span class="text-gray-700">{{ file.name }}</span>
              <button type="button" class="text-xs text-red-600 hover:underline" @click="removeFile(index)">
                삭제
              </button>
            </div>
          </div>
        </div>

        <div class="mb-6 flex items-center">
          <input
            v-model="form.showPopup"
            type="checkbox"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
            :disabled="isSubmitting"
            id="showPopup"
          />
          <label for="showPopup" class="text-sm text-gray-700">팝업으로 표시</label>
        </div>

        <div v-if="form.showPopup" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label for="popupStart" class="block text-sm font-medium text-gray-700 mb-2">팝업 시작일</label>
            <input
              id="popupStart"
              v-model="form.popupStart"
              type="datetime-local"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
              :disabled="isSubmitting"
            />
          </div>
          <div>
            <label for="popupEnd" class="block text-sm font-medium text-gray-700 mb-2">팝업 종료일</label>
            <input
              id="popupEnd"
              v-model="form.popupEnd"
              type="datetime-local"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
              :disabled="isSubmitting"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="$router.push('/admin/notices')"
            :disabled="isSubmitting"
          >
            취소
          </button>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '저장 중...' : (isEdit ? '수정' : '등록') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNoticeApi } from '../../composables/useNoticeApi.js';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ImageUploader from 'quill-image-uploader';
import Quill from 'quill';
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

// Quill 에디터 확장: 붙여넣기 핸들러
class QuillPasteHandler {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.imageHandler = options.imageHandler || this.imageHandler.bind(this);
    this.quill.root.addEventListener('paste', this.pasteHandler.bind(this));
    this.addFileToAttachments = options.addFileToAttachments;
  }

  pasteHandler(event) {
    const clipboardData = event.clipboardData;
    if (!clipboardData || !clipboardData.items) return;

    const items = Array.from(clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));

    if (imageItems.length > 0) {
      event.preventDefault();
      imageItems.forEach(item => {
        const blob = item.getAsFile();
        this.imageHandler(blob);
      });
    }
  }

  imageHandler(blob) {
    if (!blob) return;
    
    // 이미지 압축 추가
    compressImage(blob, 800, 800, 0.6).then(compressedFile => {
      console.log(`붙여넣기 - 원본: ${blob.size}바이트, 압축 후: ${compressedFile.size}바이트`);
      
      // 이미지 파일 업로드 및 에디터에 삽입
      const fileName = `pasted-image-${new Date().getTime()}.png`;
      const imageFile = new File([compressedFile], fileName, { type: compressedFile.type });
      
      const formData = new FormData();
      formData.append('file', imageFile);
      
      axios.post('/api/admin/notices/upload/image', formData)
        .then(response => {
          const url = response.data.url;
          this.insertToEditor(url);
          
          // 첨부파일에도 추가 (첨부파일 표시용)
          if (typeof this.addFileToAttachments === 'function') {
            this.addFileToAttachments(imageFile);
          } else {
            console.error('addFileToAttachments 함수를 찾을 수 없습니다.');
          }
        })
        .catch(err => {
          console.error('이미지 업로드 실패:', err);
          alert('이미지 업로드에 실패했습니다.');
        });
    }).catch(err => {
      console.error('이미지 압축 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    });
  }

  insertToEditor(url) {
    const range = this.quill.getSelection();
    this.quill.insertEmbed(range ? range.index : 0, 'image', url);
  }
}

// Quill 에디터 확장: 드래그 앤 드롭 핸들러
class QuillDragDropHandler {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.imageHandler = options.imageHandler || this.imageHandler.bind(this);
    this.quill.root.addEventListener('drop', this.dropHandler.bind(this));
    this.quill.root.addEventListener('dragover', e => e.preventDefault());
    this.addFileToAttachments = options.addFileToAttachments;
  }

  dropHandler(event) {
    event.preventDefault();
    if (!event.dataTransfer || !event.dataTransfer.files) return;

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        this.imageHandler(file);
      });
    }
  }

  imageHandler(file) {
    if (!file) return;

    // 이미지 압축 추가
    compressImage(file, 800, 800, 0.6).then(compressedFile => {
      console.log(`드래그앤드롭 - 원본: ${file.size}바이트, 압축 후: ${compressedFile.size}바이트`);
      
      // 이미지 파일 업로드 및 에디터에 삽입
      const fileName = file.name || `dropped-image-${new Date().getTime()}.png`;
      const imageFile = new File([compressedFile], fileName, { type: compressedFile.type });
      
      const formData = new FormData();
      formData.append('file', imageFile);
      
      axios.post('/api/admin/notices/upload/image', formData)
        .then(response => {
          const url = response.data.url;
          this.insertToEditor(url);
          
          // 첨부파일에도 추가 (첨부파일 표시용)
          if (typeof this.addFileToAttachments === 'function') {
            this.addFileToAttachments(imageFile);
          } else {
            console.error('addFileToAttachments 함수를 찾을 수 없습니다.');
          }
        })
        .catch(err => {
          console.error('이미지 업로드 실패:', err);
          alert('이미지 업로드에 실패했습니다.');
        });
    }).catch(err => {
      console.error('이미지 압축 실패:', err);
      alert('이미지 처리에 실패했습니다.');
    });
  }

  insertToEditor(url) {
    const range = this.quill.getSelection() || { index: this.quill.getLength() };
    this.quill.insertEmbed(range.index, 'image', url);
  }
}

// Quill 에디터에 이미지 업로더 모듈 등록
Quill.register('modules/imageUploader', ImageUploader);
Quill.register('modules/pasteHandler', QuillPasteHandler);
Quill.register('modules/dragDropHandler', QuillDragDropHandler);

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
  name: 'NoticeWrite',
  components: {
    QuillEditor
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const quillEditor = ref(null);
    const form = ref({
      title: '',
      content: '',
      files: [],
      showPopup: false,
      popupStart: '',
      popupEnd: ''
    });
    const errorMessage = ref('');
    const isSubmitting = ref(false);
    const isEdit = computed(() => !!route.params.id);

    const { createNotice, updateNotice, getNoticeDetail } = useNoticeApi();

    // Quill 에디터 옵션 설정
    const editorOptions = {
      theme: 'snow',
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'video'] // 'image' 제거 - 우리의 커스텀 이미지 업로드 버튼 사용
          ],
          handlers: {
            // 기본 이미지 핸들러 비활성화
            image: function() {}
          }
        },
        pasteHandler: true,
        dragDropHandler: true
      },
      placeholder: '내용을 입력하세요...'
    };

    // 에디터 초기화 후 설정
    const initQuillEditor = () => {
      if (!quillEditor.value) return;
      
      const quill = quillEditor.value.getQuill();
      
      // 이미지 붙여넣기 비활성화 (별도의 이미지 업로드 버튼 사용)
      quill.clipboard.addMatcher('img', (node, delta) => {
        // 이미지 노드를 제거하고 텍스트만 유지
        console.log('이미지 붙여넣기 시도가 감지되었습니다. 별도 이미지 업로드 버튼을 사용해주세요.');
        return delta;
      });

      // 붙여넣기 및 드래그앤드롭 핸들러에 addFileToAttachments 함수 전달
      const pasteHandler = quill.getModule('pasteHandler');
      const dragDropHandler = quill.getModule('dragDropHandler');
      
      if (pasteHandler) {
        pasteHandler.addFileToAttachments = addFileToAttachments;
      }
      
      if (dragDropHandler) {
        dragDropHandler.addFileToAttachments = addFileToAttachments;
      }
    };

    const handleFileChange = (event) => {
      const newFiles = Array.from(event.target.files);
      form.value.files = [...form.value.files, ...newFiles];
    };

    const removeFile = (index) => {
      form.value.files.splice(index, 1);
    };

    // 이미지를 에디터에 삽입하는 함수
    const insertImage = (url) => {
      const quill = quillEditor.value.getQuill();
      const range = quill.getSelection() || { index: quill.getLength() - 1, length: 1 };
      quill.insertEmbed(range.index, 'image', url);
      quill.setSelection(range.index + 1);
    };

    // 이미지 업로드 인풋 열기
    const imageUploadInput = ref(null);
    const openImageUpload = () => {
      imageUploadInput.value.click();
    };

    // 이미지 업로드 처리
    const handleImageUpload = async (event) => {
      try {
        const file = event.target.files[0];
        if (!file) return;
        
        // 파일 크기 제한 (5MB)
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
          alert('이미지 크기가 5MB를 초과합니다. 더 작은 이미지를 선택해주세요.');
          return;
        }
        
        // 이미지 압축
        const compressedFile = await compressImage(file, 800, 800, 0.6);
        console.log(`이미지 업로드 - 원본: ${file.size}바이트, 압축 후: ${compressedFile.size}바이트`);
        
        // 이미지 파일 업로드 후 에디터에 삽입 (본문에 표시)
        const formData = new FormData();
        formData.append('file', compressedFile);
        
        const response = await axios.post('/api/admin/notices/upload/image', formData);
        const imageUrl = response.data.url;
        
        // 에디터에 이미지 삽입
        insertImage(imageUrl);
        
        // 첨부파일에 이미지 추가 (첨부파일 표시용)
        const imageFile = new File([compressedFile], file.name, { type: compressedFile.type });
        addFileToAttachments(imageFile);
        
        // 파일 인풋 초기화
        event.target.value = null;
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    };

    // 파일을 첨부파일 목록에 추가하는 헬퍼 함수
    const addFileToAttachments = (file) => {
      form.value.files = [...form.value.files, file];
    };

    const handleSubmit = async () => {
      try {
        isSubmitting.value = true;
        errorMessage.value = '';

        if (!form.value.title.trim() || !form.value.content.trim()) {
          errorMessage.value = '제목과 내용을 모두 입력해주세요.';
          return;
        }

        // 에디터 내용에서 이미지 태그 검색
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        let hasInlineImages = false;
        let processedContent = form.value.content;
        
        // 모든 base64 이미지를 서버에 업로드하고 URL로 변경
        while ((match = imgRegex.exec(form.value.content)) !== null) {
          const imageUrl = match[1];
          hasInlineImages = true;
          
          // 이미 서버 URL인 경우에는 변환하지 않음
          if (imageUrl.startsWith('https://localhost:8081/api/admin/notices/')) {
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
              const uploadResponse = await axios.post('/api/admin/notices/upload/image', imgFormData);
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
        
        // 인라인 이미지가 있을 경우 더미 첨부파일 추가 (첨부파일 표시용)
        if (hasInlineImages && form.value.files.length === 0) {
          // 이미 첨부파일이 없는 경우에만 더미 파일 추가
          const dummyFile = new File([new Blob([''])], '이미지.png', { type: 'image/png' });
          form.value.files.push(dummyFile);
        }

        const formData = new FormData();
        
        // 이미지가 URL로 변환된 content를 사용
        const noticeData = {
          title: form.value.title.trim(),
          content: processedContent, // 변환된 content 사용
          author: '관리자',  // 기본값으로 설정
          showPopup: form.value.showPopup,
          popupStart: form.value.showPopup ? form.value.popupStart : null,
          popupEnd: form.value.showPopup ? form.value.popupEnd : null
        };

        console.log('Submitting notice data:', noticeData);
        
        // notice 데이터를 JSON 문자열로 변환
        const noticeBlob = new Blob([JSON.stringify(noticeData)], {
          type: 'application/json'
        });
        formData.append('notice', noticeBlob);

        // 파일 추가
        if (form.value.files.length > 0) {
          console.log('Adding files to FormData:', form.value.files);
          form.value.files.forEach((file, index) => {
            console.log(`File ${index}:`, file.name, file.size, file.type);
            formData.append('files', file);
          });
        }

        // FormData 내용 로깅
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          if (key === 'notice') {
            console.log('notice: [Blob]');
          } else {
            console.log(`${key}: ${value instanceof File ? value.name : value}`);
          }
        }

        let response;
        try {
          if (isEdit.value) {
            console.log('Updating notice ID:', route.params.id);
            
            // 이미 모든 이미지가 처리되었으므로 추가 변환 작업 필요 없음
            response = await updateNotice(route.params.id, formData);
          } else {
            console.log('Creating new notice');
            response = await createNotice(formData);
          }
          
          console.log('Server response:', response);
          router.push('/admin/notices');
        } catch (apiError) {
          console.error('API 호출 오류:', apiError);
          
          if (apiError.response) {
            // 서버에서 응답이 왔지만 에러 상태코드인 경우
            console.error('Status:', apiError.response.status);
            console.error('Headers:', apiError.response.headers);
            console.error('Data:', apiError.response.data);
            
            if (apiError.response.data) {
              if (typeof apiError.response.data === 'string') {
                errorMessage.value = apiError.response.data;
              } else if (apiError.response.data.message) {
                errorMessage.value = apiError.response.data.message;
              } else if (apiError.response.data.error) {
                errorMessage.value = apiError.response.data.error;
              } else {
                errorMessage.value = `서버 오류 (${apiError.response.status}): 관리자에게 문의하세요.`;
              }
            } else {
              errorMessage.value = `서버 오류 (${apiError.response.status}): 관리자에게 문의하세요.`;
            }
          } else if (apiError.request) {
            // 요청은 보냈지만 응답이 없는 경우
            console.error('Request was made but no response was received');
            errorMessage.value = '서버 응답이 없습니다. 네트워크 연결을 확인하세요.';
          } else {
            // 요청 설정 중 오류 발생
            console.error('Error config:', apiError.config);
            errorMessage.value = '요청 처리 중 오류가 발생했습니다: ' + apiError.message;
          }
          
          throw apiError; // 오류를 다시 throw하여 상위 catch 블록에서 처리하도록 함
        }
      } catch (error) {
        console.error('공지사항 저장 실패:', error);
        if (!errorMessage.value) {
          errorMessage.value = '공지사항 저장에 실패했습니다. 다시 시도해주세요.';
        }
      } finally {
        isSubmitting.value = false;
      }
    };

    const fetchNotice = async () => {
      if (!isEdit.value) return;
      
      try {
        const response = await getNoticeDetail(route.params.id);
        const notice = response.data;
        form.value = {
          title: notice.title,
          content: notice.content,
          files: [],
          showPopup: notice.showPopup || false,
          popupStart: notice.popupStart || '',
          popupEnd: notice.popupEnd || ''
        };
      } catch (error) {
        console.error('공지사항 조회 실패:', error);
        errorMessage.value = '공지사항을 불러오는데 실패했습니다.';
      }
    };

    onMounted(async () => {
      // 에디터 초기화
      initQuillEditor();
      
      if (isEdit.value) {
        try {
          await fetchNotice();
        } catch (error) {
          console.error('공지사항 불러오기 실패:', error);
          errorMessage.value = '공지사항을 불러오는데 실패했습니다.';
        }
      }
    });

    return {
      form,
      errorMessage,
      isSubmitting,
      isEdit,
      quillEditor,
      imageUploadInput,
      openImageUpload,
      handleImageUpload,
      editorOptions,
      handleFileChange,
      removeFile,
      insertImage,
      handleSubmit,
      addFileToAttachments
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
}
.ql-editor img {
  max-width: 100%;
  height: auto;
}
</style> 