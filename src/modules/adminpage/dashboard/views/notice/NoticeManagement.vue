<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="공지사항 관리" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          공지사항 게시판
        </h2>

        <!-- 알림 메시지 -->
        <AlertMessage
          v-if="alert.show"
          :type="alert.type"
          :title="alert.title"
          :message="alert.message"
          :dismissible="true"
          @close="closeAlert"
        />

        <!-- 검색 및 필터 -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            <select v-model="searchType" class="border border-gray-200 rounded-md px-3 py-2 focus:border-blue-600 focus:ring focus:ring-opacity-40 focus:ring-blue-500 text-gray-700 w-24">
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
            </select>
            <div class="relative mx-4 lg:mx-0">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              <input
                v-model="searchKeyword"
                class="w-80 pl-10 pr-4 text-gray-700 border-gray-200 rounded-md sm:w-[32rem] md:w-[23rem] focus:border-blue-600 focus:ring focus:ring-opacity-40 focus:ring-blue-500"
                type="text"
                placeholder="검색어를 입력하세요"
                @keyup.enter="searchNotices"
              />
            </div>
            <button
              @click="searchNotices"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              검색
            </button>
          </div>
          <router-link to="/admin/notices/new" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            글쓰기
          </router-link>
        </div>

        <!-- 게시판 목록 -->
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
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  번호
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성자
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작성일
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!notices || notices.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">등록된 공지사항이 없습니다.</td>
              </tr>
              <tr v-for="notice in notices" 
                  :key="notice.id" 
                  :class="[
                    notice.topNotice ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'
                  ]">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <span v-if="notice.topNotice" class="font-bold bg-blue-500 text-white px-2 py-1 rounded">공지</span>
                  <span v-else>{{ notice.id }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <router-link 
                    :to="`/admin/notices/${notice.id}`" 
                    :class="{'font-bold text-black': notice.topNotice, 'text-blue-600 hover:text-blue-900': !notice.topNotice}"
                  >
                    {{ notice.title }}
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ notice.author }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ formatDate(notice.createdDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <router-link :to="`/admin/notices/${notice.id}/edit`" class="text-blue-600 hover:text-blue-900 mr-2">수정</router-link>
                  <button @click="openDeleteModal(notice.id)" class="text-red-600 hover:text-red-900 mr-2">삭제</button>
                  <button @click="toggleTopNotice(notice.id, !notice.topNotice)" class="text-purple-600 hover:text-purple-900">
                    {{ notice.topNotice ? '탑공지 해제' : '탑공지 설정' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="!isLoading && notices && notices.length > 0" class="flex justify-center mt-4">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click.prevent="changePage(page - 1)"
              :disabled="page === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'text-gray-300 cursor-not-allowed': page === 1 }"
            >
              이전
            </button>

            <button
              v-for="pageNum in totalPages"
              :key="pageNum"
              @click.prevent="changePage(pageNum)"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              :class="{ 'z-10 bg-blue-50 border-blue-500 text-blue-600': page === pageNum }"
            >
              {{ pageNum }}
            </button>

            <button
              @click.prevent="changePage(page + 1)"
              :disabled="page === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'text-gray-300 cursor-not-allowed': page === totalPages }"
            >
              다음
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
      :is-open="isDeleteModalOpen"
      :item-id="selectedItemId"
      title="공지사항 삭제"
      message="이 공지사항을 정말 삭제하시겠습니까?"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useNoticeApi } from '../../composables/useNoticeApi.js';
import Breadcrumb from '../../partials/AppBreadcrumb.vue';
import DeleteConfirmModal from '../../components/DeleteConfirmModal.vue';
import AlertMessage from '../../components/AlertMessage.vue';
import api from '@/api/axiosInstance.js'


export default {
  name: 'NoticeManagement',
  components: {
    Breadcrumb,
    DeleteConfirmModal,
    AlertMessage
  },
  setup() {
    const router = useRouter();
    const notices = ref([]);
    const page = ref(1);
    const pageSize = 10;
    const isLoading = ref(false);
    const error = ref('');
    const searchType = ref('all');
    const searchKeyword = ref('');

    // 삭제 모달 관련 상태
    const isDeleteModalOpen = ref(false);
    const selectedItemId = ref(null);
    
    // 알림 메시지 관련 상태
    const alert = ref({
      show: false,
      type: 'success',
      title: '',
      message: '',
      timeout: null
    });

    const { getNotices, deleteNotice: apiDeleteNotice } = useNoticeApi();

    // 현재 페이지에 표시할 공지사항 목록
    const pagedNotices = computed(() => {
      // 검색어가 있는 경우 필터링
      let filteredNotices = notices.value;

      if (searchKeyword.value && searchKeyword.value.trim() !== '') {
        const keyword = searchKeyword.value.toLowerCase().trim();
        filteredNotices = notices.value.filter(notice => {
          if (searchType.value === 'title') {
            return notice.title && notice.title.toLowerCase().includes(keyword);
          } else if (searchType.value === 'content') {
            return notice.content && notice.content.toLowerCase().includes(keyword);
          } else {
            // 전체 검색
            return (
              (notice.title && notice.title.toLowerCase().includes(keyword)) ||
              (notice.content && notice.content.toLowerCase().includes(keyword)) ||
              (notice.author && notice.author.toLowerCase().includes(keyword))
            );
          }
        });
        console.log(`검색어 '${keyword}'로 ${filteredNotices.length}개 항목 필터링됨`);
      }

      // 페이징 처리
      return filteredNotices.slice((page.value - 1) * pageSize, page.value * pageSize);
    });

    // 필터링된 공지사항의 총 개수에 따라 페이지 수 계산
    const filteredNotices = computed(() => {
      if (!searchKeyword.value || searchKeyword.value.trim() === '') {
        return notices.value;
      }

      const keyword = searchKeyword.value.toLowerCase().trim();
      return notices.value.filter(notice => {
        if (searchType.value === 'title') {
          return notice.title && notice.title.toLowerCase().includes(keyword);
        } else if (searchType.value === 'content') {
          return notice.content && notice.content.toLowerCase().includes(keyword);
        } else {
          // 전체 검색
          return (
            (notice.title && notice.title.toLowerCase().includes(keyword)) ||
            (notice.content && notice.content.toLowerCase().includes(keyword)) ||
            (notice.author && notice.author.toLowerCase().includes(keyword))
          );
        }
      });
    });

    // 전체 페이지 수 계산 (필터링된 결과 기준)
    const totalPages = computed(() => Math.ceil(filteredNotices.value.length / pageSize));

    const fetchNotices = async () => {
      try {
        isLoading.value = true;
        const response = await getNotices();
        
        if (Array.isArray(response)) {
          notices.value = response;
        } else if (response && Array.isArray(response.data)) {
          notices.value = response.data;
        } else if (response && response.data && Array.isArray(response.data.content)) {
          notices.value = response.data.content;
        } else {
          notices.value = [];
          error.value = '공지사항을 불러오는데 실패했습니다.';
        }
        
        // 탑공지를 상단에 정렬하는 로직 추가
        notices.value.sort((a, b) => {
          // 1. 둘 다 탑공지면 최신순
          if (a.topNotice && b.topNotice) {
            return new Date(b.createdDate || b.createdAt) - new Date(a.createdDate || a.createdAt);
          }
          // 2. a만 탑공지면 a가 위로
          if (a.topNotice) return -1;
          // 3. b만 탑공지면 b가 위로
          if (b.topNotice) return 1;
          // 4. 둘 다 탑공지가 아니면 최신순
          return new Date(b.createdDate || b.createdAt) - new Date(a.createdDate || a.createdAt);
        });

        console.log('공지사항 로드 완료:', notices.value.length, '개');
      } catch (err) {
        console.error('공지사항 로드 실패:', err);
        error.value = '공지사항을 불러오는데 실패했습니다.';
      } finally {
        isLoading.value = false;
      }
    };

    const changePage = (newPage) => {
      if (newPage < 1 || newPage > totalPages.value) return;
      page.value = newPage;
      // 페이지 변경 시 상단으로 스크롤
      if (typeof window !== 'undefined') window.scrollTo({top: 0, behavior: 'smooth'});
    };

    // 삭제 모달 관련 함수
    const openDeleteModal = (id) => {
      selectedItemId.value = id;
      isDeleteModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
      selectedItemId.value = null;
    };

    const confirmDelete = async (id) => {
      try {
        await apiDeleteNotice(id);
        await fetchNotices(); // 삭제 후 목록 새로고침
        showAlert('success', '성공', '공지사항이 성공적으로 삭제되었습니다.');
      } catch (err) {
        console.error('공지사항 삭제 실패:', err);
        showAlert('error', '오류', '공지사항 삭제에 실패했습니다.');
      }
    };

    const showAlert = (type, title, message, timeout = 10000) => {
      // 기존 타이머가 있으면 제거
      if (alert.value && alert.value.timeout) {
        clearTimeout(alert.value.timeout);
      }
      
      // 알림 표시
      if (alert.value) {
        alert.value = {
          show: true,
          type,
          title,
          message,
          timeout: null
        };
        
        // 자동으로 닫히는 타이머 설정
        if (timeout > 0) {
          const timer = setTimeout(() => {
            closeAlert();
          }, timeout);
          alert.value.timeout = timer;
        }
      }
    };
    
    const closeAlert = () => {
      if (alert.value && alert.value.timeout) {
        clearTimeout(alert.value.timeout);
      }
      if (alert.value) {
        alert.value.show = false;
      }
    };

    const searchNotices = () => {
      // 검색 시 페이지를 1로 초기화
      page.value = 1;

      // 검색어가 비어있으면 전체 목록 표시
      if (!searchKeyword.value || searchKeyword.value.trim() === '') {
        console.log('검색어가 비어있어 전체 목록을 표시합니다.');
        return;
      }

      const keyword = searchKeyword.value.toLowerCase().trim();
      console.log(`클라이언트 측 검색 실행: 타입=${searchType.value}, 키워드=${keyword}`);

      // 검색 결과 로깅
      const resultCount = filteredNotices.value.length;
      console.log(`검색 결과: ${resultCount}개 항목 찾음`);
    };

    // 탑공지 설정/해제
    const toggleTopNotice = async (id, isTop) => {
      try {
        isLoading.value = true;
        console.log(`공지 ${id} 탑공지 ${isTop ? '설정' : '해제'} 시도`);
        
        // PATCH API 호출
        const response = await api.patch(`/api/admin/notices/${id}/top?isTop=${isTop}`);
        console.log('탑공지 변경 응답:', response.data);
        
        // 성공 시 목록 다시 불러오기
        await fetchNotices();
        
        // 성공 알림 표시
        alert.value = {
          show: true,
          type: 'success',
          title: '성공',
          message: `공지사항 ${id}번의 탑공지가 ${isTop ? '설정' : '해제'}되었습니다.`,
          timeout: setTimeout(() => {
            alert.value.show = false;
          }, 3000)
        };
      } catch (error) {
        console.error('탑공지 설정 실패:', error);
        
        // 실패 알림 표시
        alert.value = {
          show: true,
          type: 'error',
          title: '오류',
          message: `탑공지 ${isTop ? '설정' : '해제'} 중 오류가 발생했습니다.`,
          timeout: setTimeout(() => {
            alert.value.show = false;
          }, 3000)
        };
      } finally {
        isLoading.value = false;
      }
    };

    // 컴포넌트 언마운트 시 타이머 정리
    onBeforeUnmount(() => {
      if (alert.value && alert.value.timeout) {
        clearTimeout(alert.value.timeout);
      }
    });

    onMounted(() => fetchNotices());

    return {
      notices: pagedNotices, // 페이징된 데이터만 반환
      page,
      totalPages,
      isLoading,
      error,
      searchType,
      searchKeyword,
      searchNotices,
      changePage,
      // 삭제 모달 관련
      isDeleteModalOpen,
      selectedItemId,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
      // 알림 관련
      alert,
      closeAlert,
      formatDate: (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      toggleTopNotice
    };
  }
};
</script>
