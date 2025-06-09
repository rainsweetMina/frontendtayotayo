<template>
  <div class="notice-write">
    <div class="page-header">
      <h2>{{ isEdit ? '공지사항 수정' : '새 공지사항 작성' }}</h2>
    </div>

    <div class="notice-form-container">
      <form @submit.prevent="handleSubmit">
        <div v-if="errorMessage" class="alert alert-danger mb-3">
          {{ errorMessage }}
        </div>

        <div class="form-group mb-3">
          <label for="title" class="form-label">제목</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="form-control"
            required
            placeholder="제목을 입력하세요"
            :disabled="isSubmitting"
          />
        </div>
        
        <div class="form-group mb-3">
          <label for="content" class="form-label">내용</label>
          <QuillEditor
            v-model:content="form.content"
            contentType="html"
            toolbar="full"
            theme="snow"
            :disabled="isSubmitting"
            ref="quillEditor"
            class="quill-editor"
          />
        </div>

        <div class="form-group mb-3">
          <label for="file" class="form-label">첨부파일</label>
          <input
            id="file"
            type="file"
            class="form-control"
            @change="handleFileChange"
            multiple
            :disabled="isSubmitting"
          />
          <small class="text-muted">* 파일은 선택사항입니다</small>
          <div v-if="form.files.length > 0" class="mt-2">
            <div v-for="(file, index) in form.files" :key="index" class="d-flex align-items-center mb-2">
              <span class="me-2">{{ file.name }}</span>
              <button type="button" class="btn btn-sm btn-danger" @click="removeFile(index)">
                삭제
              </button>
            </div>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="form-check-label">
            <input
              v-model="form.showPopup"
              type="checkbox"
              class="form-check-input me-2"
              :disabled="isSubmitting"
            />
            팝업으로 표시
          </label>
        </div>

        <div v-if="form.showPopup" class="row mb-3">
          <div class="col-md-6">
            <div class="form-group">
              <label for="popupStart" class="form-label">팝업 시작일</label>
              <input
                id="popupStart"
                v-model="form.popupStart"
                type="datetime-local"
                class="form-control"
                :disabled="isSubmitting"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="popupEnd" class="form-label">팝업 종료일</label>
              <input
                id="popupEnd"
                v-model="form.popupEnd"
                type="datetime-local"
                class="form-control"
                :disabled="isSubmitting"
              />
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-secondary me-2"
            @click="$router.push('/admin/notices')"
            :disabled="isSubmitting"
          >
            취소
          </button>
          <button
            type="submit"
            class="btn btn-primary"
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
import { useNoticeApi } from '../composables/useNoticeApi';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import ImageUploader from 'quill-image-uploader';
import Quill from 'quill';
import axios from '@/config/axios';

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

    const formData = new FormData();
    formData.append('file', blob);

    axios.post('/api/admin/upload/image', formData)
      .then(response => {
        const url = response.data.url;
        this.insertToEditor(url);
      })
      .catch(err => {
        console.error('이미지 업로드 실패:', err);
        alert('이미지 업로드에 실패했습니다.');
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

    const formData = new FormData();
    formData.append('file', file);

    axios.post('/api/admin/upload/image', formData)
      .then(response => {
        const url = response.data.url;
        this.insertToEditor(url);
      })
      .catch(err => {
        console.error('이미지 업로드 실패:', err);
        alert('이미지 업로드에 실패했습니다.');
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
        toolbar: [
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
          ['link', 'image', 'video']
        ],
        imageUploader: {
          upload: (file) => {
            return new Promise((resolve, reject) => {
              const formData = new FormData();
              formData.append('file', file);

              axios.post('/api/admin/upload/image', formData)
                .then(response => {
                  resolve(response.data.url);
                })
                .catch(err => {
                  console.error('이미지 업로드 실패:', err);
                  reject('이미지 업로드에 실패했습니다.');
                });
            });
          }
        },
        pasteHandler: {},
        dragDropHandler: {}
      },
      placeholder: '내용을 입력하세요...'
    };

    // 에디터 초기화 후 설정
    const initQuillEditor = () => {
      if (!quillEditor.value) return;
      
      const quill = quillEditor.value.getQuill();
      
      // 붙여넣은 이미지의 Base64 데이터를 URL로 변환
      quill.clipboard.addMatcher('img', (node, delta) => {
        const Delta = Quill.import('delta');
        if (node.src && node.src.startsWith('data:image/')) {
          try {
            // 이미지 데이터를 서버에 업로드
            const blob = dataURLtoBlob(node.src);
            const formData = new FormData();
            formData.append('file', blob, 'pasted-image.png');
            
            // 비동기 처리를 위한 임시 로딩 이미지 삽입
            const loadingPlaceholder = '/loading-placeholder.gif';
            const newDelta = new Delta().insert({ image: loadingPlaceholder });
            
            axios.post('/api/admin/upload/image', formData)
              .then(response => {
                // 이미지 URL을 받아와서 에디터에 삽입
                const imageUrl = response.data.url;
                
                // 로딩 이미지를 실제 이미지로 교체
                const imgElements = quill.root.querySelectorAll(`img[src="${loadingPlaceholder}"]`);
                if (imgElements.length > 0) {
                  imgElements[imgElements.length - 1].src = imageUrl;
                }
              })
              .catch(err => {
                console.error('이미지 업로드 실패:', err);
              });
              
            return newDelta;
          } catch (error) {
            console.error('Base64 이미지 처리 오류:', error);
          }
        }
        return delta;
      });
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
      const range = quill.getSelection();
      quill.insertEmbed(range.index, 'image', url);
    };

    const handleSubmit = async () => {
      try {
        isSubmitting.value = true;
        errorMessage.value = '';

        if (!form.value.title.trim() || !form.value.content.trim()) {
          errorMessage.value = '제목과 내용을 모두 입력해주세요.';
          return;
        }

        const formData = new FormData();
        
        // notice 데이터를 JSON으로 변환
        const noticeData = {
          title: form.value.title.trim(),
          content: form.value.content.trim(),
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
            response = await updateNotice(route.params.id, formData);
          } else {
            console.log('Creating new notice');
            response = await createNotice(formData);
          }
          
          console.log('Server response:', response);
          alert(isEdit.value ? '공지사항이 수정되었습니다.' : '공지사항이 등록되었습니다.');
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

    onMounted(() => {
      fetchNotice();
      // 에디터 초기화 후 설정
      initQuillEditor();
    });

    return {
      form,
      errorMessage,
      isSubmitting,
      isEdit,
      quillEditor,
      editorOptions,
      handleFileChange,
      removeFile,
      insertImage,
      handleSubmit
    };
  }
};
</script>

<style>
.notice-write {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.notice-form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Quill 에디터 스타일 */
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