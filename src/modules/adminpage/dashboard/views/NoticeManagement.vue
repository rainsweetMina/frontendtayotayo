<template>
  <div class="notice-management">
    <div class="notice-header">
      <h2>공지사항 관리</h2>
      <router-link to="/admin/notices/new" class="btn btn-primary">새 공지사항</router-link>
    </div>

    <div v-if="error" class="alert alert-danger mb-3">
      {{ error }}
    </div>

    <div class="notice-list">
      <div v-if="isLoading" class="text-center my-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <table v-else class="table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>첨부파일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!notices || notices.length === 0">
            <td colspan="6" class="text-center">등록된 공지사항이 없습니다.</td>
          </tr>
          <tr v-for="notice in notices" :key="notice.id">
            <td>{{ notice.id }}</td>
            <td>
              <router-link :to="`/admin/notices/${notice.id}`" class="text-decoration-none">
                {{ notice.title }}
              </router-link>
            </td>
            <td>{{ notice.author }}</td>
            <td>{{ formatDate(notice.createdDate) }}</td>
            <td>
              <span v-if="hasAttachment(notice)" class="badge bg-success">
                <i class="bi bi-paperclip"></i> 있음
              </span>
              <span v-else class="text-muted">-</span>
            </td>
            <td>
              <router-link :to="`/admin/notices/${notice.id}/edit`" class="btn btn-warning btn-sm">수정</router-link>
              <button @click="deleteNotice(notice.id)" class="btn btn-danger btn-sm ms-2">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="!isLoading && notices && notices.length > 0" class="pagination mt-3">
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">이전</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">다음</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNoticeApi } from '../composables/useNoticeApi';

export default {
  name: 'NoticeManagement',
  setup() {
    const router = useRouter();
    const notices = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageSize = 10;
    const isLoading = ref(false);
    const error = ref('');

    const { getNotices, deleteNotice: apiDeleteNotice } = useNoticeApi();

    const fetchNotices = async (page = 1) => {
      try {
        isLoading.value = true;
        error.value = '';
        const response = await getNotices(page, pageSize);
        console.log('Fetched notices:', response.data);
        
        // 백엔드 응답 구조에 맞게 수정
        if (Array.isArray(response.data)) {
          notices.value = response.data;
          totalPages.value = Math.ceil(response.data.length / pageSize);
          
          // 파일 정보 구조 확인용 로그
          response.data.forEach(notice => {
            if (notice.fileName || notice.fileUrl || notice.files) {
              console.log(`Notice ${notice.id} file info:`, {
                fileName: notice.fileName,
                fileUrl: notice.fileUrl,
                files: notice.files
              });
            }
          });
        } else {
          notices.value = [];
          totalPages.value = 1;
        }
        
        currentPage.value = page;
      } catch (err) {
        console.error('공지사항 목록 조회 실패:', err);
        error.value = '공지사항 목록을 불러오는데 실패했습니다.';
        notices.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      fetchNotices(page);
    };

    const deleteNotice = async (id) => {
      if (confirm('정말 삭제하시겠습니까?')) {
        try {
          await apiDeleteNotice(id);
          await fetchNotices(currentPage.value);
        } catch (err) {
          console.error('공지사항 삭제 실패:', err);
          alert('공지사항 삭제에 실패했습니다.');
        }
      }
    };

    const hasAttachment = (notice) => {
      return !!(notice.fileName || notice.fileUrl || (notice.files && notice.files.length > 0));
    };

    onMounted(() => fetchNotices(1));

    return {
      notices,
      currentPage,
      totalPages,
      isLoading,
      error,
      deleteNotice,
      changePage,
      hasAttachment,
      formatDate: (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    };
  }
};
</script>

<style scoped>
.notice-management {
  padding: 20px;
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notice-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table th {
  background-color: #f8f9fa;
}
</style> 