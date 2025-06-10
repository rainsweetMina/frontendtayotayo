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
          <textarea
            id="content"
            v-model="form.content"
            class="form-control"
            rows="15"
            required
            placeholder="내용을 입력하세요"
            :disabled="isSubmitting"
          ></textarea>
        </div>

        <div class="form-group mb-3">
          <label for="file" class="form-label">첨부파일</label>
          <input
            id="file"
            type="file"
            class="form-control"
            @change="handleFileChange"
            :disabled="isSubmitting"
          />
          <small class="text-muted">* 파일은 선택사항입니다</small>
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
            <label for="popupStart" class="form-label">팝업 시작일시</label>
            <input
              id="popupStart"
              v-model="form.popupStart"
              type="datetime-local"
              class="form-control"
              :required="form.showPopup"
              :disabled="isSubmitting"
            />
          </div>
          <div class="col-md-6">
            <label for="popupEnd" class="form-label">팝업 종료일시</label>
            <input
              id="popupEnd"
              v-model="form.popupEnd"
              type="datetime-local"
              class="form-control"
              :required="form.showPopup"
              :disabled="isSubmitting"
            />
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/admin/notices" class="btn btn-secondary">
            취소
          </router-link>
          <button type="submit" class="btn btn-primary ms-2" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            {{ isSubmitting ? '저장 중...' : '저장' }}
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

export default {
  name: 'NoticeWrite',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const form = ref({
      title: '',
      content: '',
      file: null,
      showPopup: false,
      popupStart: '',
      popupEnd: ''
    });
    const errorMessage = ref('');
    const isSubmitting = ref(false);
    const isEdit = computed(() => !!route.params.id);

    const { createNotice, updateNotice, getNoticeDetail } = useNoticeApi();

    const handleFileChange = (event) => {
      form.value.file = event.target.files[0];
    };

    const handleSubmit = async () => {
      try {
        isSubmitting.value = true;
        errorMessage.value = '';

        if (!form.value.title.trim() || !form.value.content.trim()) {
          errorMessage.value = '제목과 내용을 모두 입력해주세요.';
          return;
        }

        if (isEdit.value) {
          await updateNotice(route.params.id, form.value);
          alert('공지사항이 수정되었습니다.');
        } else {
          await createNotice(form.value);
          alert('공지사항이 등록되었습니다.');
        }
        router.push('/admin/notices');
      } catch (error) {
        console.error('공지사항 저장 실패:', error);
        errorMessage.value = error.response?.data?.message || '공지사항 저장에 실패했습니다. 다시 시도해주세요.';
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
          file: null,
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
    });

    return {
      form,
      errorMessage,
      isSubmitting,
      isEdit,
      handleFileChange,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.notice-write {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.notice-form-container {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  margin-top: 30px;
  border-top: 1px solid #e9ecef;
}
</style> 