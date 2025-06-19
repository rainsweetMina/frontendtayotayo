<template>
  <div class="p-5">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">공지사항 관리</h2>
      <router-link to="/admin/notices/new" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">글쓰기</router-link>
    </div>

    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
      {{ error }}
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
          </tr>
        </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="!notices || notices.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">등록된 공지사항이 없습니다.</td>
          </tr>
            <tr v-for="notice in notices" :key="notice.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ notice.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link :to="`/admin/notices/${notice.id}`" class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                {{ notice.title }}
              </router-link>
            </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ notice.author }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(notice.createdDate) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <router-link :to="`/admin/notices/${notice.id}/edit`" class="text-indigo-600 hover:text-indigo-900 mr-3">수정</router-link>
                <button @click="deleteNotice(notice.id)" class="text-red-600 hover:text-red-900">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      
      <div v-if="!isLoading && notices && notices.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click.prevent="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">이전</span>
                이전
              </button>
              
              <button
                v-for="page in totalPages"
                :key="page"
                @click.prevent="changePage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page 
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              
              <button
                @click.prevent="changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                ]"
              >
                <span class="sr-only">다음</span>
                다음
              </button>
        </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNoticeApi } from '../../composables/useNoticeApi.js';

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

    onMounted(() => fetchNotices(1));

    return {
      notices,
      currentPage,
      totalPages,
      isLoading,
      error,
      deleteNotice,
      changePage,
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