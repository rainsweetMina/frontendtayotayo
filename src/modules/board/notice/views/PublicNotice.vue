<template>
  <div class="board-main-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">공지사항</h1>
      <router-link
        v-if="isAdmin"
        to="/notice/write"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        글쓰기
      </router-link>
    </div>

    <!-- 로딩 인디케이터 -->
    <div v-if="isLoading && !selectedNotice" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- 오류 메시지 -->
    <div v-else-if="error && !selectedNotice" class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
      <button @click="fetchNotices(1)" class="ml-4 text-blue-500 hover:underline">
        다시 시도
      </button>
    </div>

    <!-- 공지사항 상세 페이지 -->
    <NoticeDetail
      v-if="selectedNotice"
      :noticeId="selectedNotice.id"
      @back-to-list="handleBackToList"
    />

    <!-- 공지사항 목록 테이블 -->
    <div v-else-if="pagedNotices.length > 0" class="content-card">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              번호
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              제목
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
              등록일
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              조회수
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(notice, index) in pagedNotices" 
              :key="notice.id" 
              :class="[
                notice.topNotice ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'
              ]">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              <span v-if="notice.topNotice" class="font-bold bg-blue-500 text-white px-2 py-1 rounded">공지</span>
              <span v-else>{{ notices.length - ((currentPage - 1) * pageSize + index) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
              <router-link
                :to="'/notice/' + notice.id"
                :class="{'font-bold text-black': notice.topNotice, 'text-gray-900 hover:text-blue-600': !notice.topNotice}"
              >
                {{ notice.title }}
                <span v-if="notice.hasAttachment" class="ml-2 inline-block">
                  <svg class="h-4 w-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </span>
              </router-link>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              {{ formatDate(notice.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
              {{ notice.viewCount || 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 공지사항 없음 -->
    <div v-else class="content-card p-8 text-center">
      <p class="text-gray-500 text-lg">등록된 공지사항이 없습니다.</p>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="!selectedNotice && totalPages > 1" class="mt-6 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          @click.prevent="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{ 'text-gray-300 cursor-not-allowed': currentPage === 1 }"
        >
          이전
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click.prevent="changePage(page)"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          :class="{ 'z-10 bg-blue-50 border-blue-500 text-blue-600': currentPage === page }"
        >
          {{ page }}
        </button>

        <button
          @click.prevent="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{ 'text-gray-300 cursor-not-allowed': currentPage === totalPages }"
        >
          다음
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import NoticeDetail from '../components/NoticeDetail.vue'

const notices = ref([])
const currentPage = ref(1)
const pageSize = 10 // 한 페이지당 표시할 항목 수
const isAdmin = ref(false)
const selectedNotice = ref(null)
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const error = ref('')

// 현재 페이지에 표시할 공지사항 목록
const pagedNotices = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return notices.value.slice(startIndex, endIndex);
});

// 전체 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(notices.value.length / pageSize);
});

const fetchNotices = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    console.log('공지사항 목록 조회 요청');

    try {
      // 일반 사용자용 공지사항 API로 변경
      const response = await axios.get(`https://localhost:8081/api/public/notices`);
      console.log('공지사항 목록 응답:', response.data);

      // 디버깅 - 응답 구조 확인
      if (response.data && response.data.length > 0) {
        console.log('첫 번째 공지사항 데이터 구조:', response.data[0]);
        console.log('탑공지 필드 확인:', {
          isTopNotice: response.data[0].isTopNotice,
          topNotice: response.data[0].topNotice,
          _isTopNotice: response.data[0]._isTopNotice
        });
      }

      if (response.data && Array.isArray(response.data)) {
        // 배열 형태 응답 (public API 응답 형식)
        notices.value = response.data.map(notice => ({
          ...notice,
          createdAt: notice.createdAt || notice.createdDate || new Date().toISOString(),
          content: notice.content || '',
          viewCount: notice.viewCount || 0
        }));
      } else if (response.data && response.data.content) {
        // 페이징된 응답 구조
        notices.value = response.data.content.map(notice => ({
          ...notice,
          createdAt: notice.createdAt || notice.createdDate || new Date().toISOString(),
          content: notice.content || '',
          viewCount: notice.viewCount || 0
        }));
      } else if (response.data) {
        // 단일 객체 응답
        notices.value = [{
          ...response.data,
          createdAt: response.data.createdAt || response.data.createdDate || new Date().toISOString(),
          content: response.data.content || '',
          viewCount: response.data.viewCount || 0
        }];
      } else {
        throw new Error('응답 데이터가 없습니다');
      }

      // 탑공지를 상단에 정렬하는 로직 추가
      notices.value.sort((a, b) => {
        // 1. 둘 다 탑공지면 최신순
        if (a.topNotice && b.topNotice) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // 2. a만 탑공지면 a가 위로
        if (a.topNotice) return -1;
        // 3. b만 탑공지면 b가 위로
        if (b.topNotice) return 1;
        // 4. 둘 다 탑공지가 아니면 최신순
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      console.log(`총 ${notices.value.length}개 공지사항 로드 완료, 전체 페이지: ${totalPages.value}`);
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

const changePage = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  currentPage.value = newPage;
  // 페이지 변경 시 상단으로 스크롤
  if (typeof window !== 'undefined') window.scrollTo({top: 0, behavior: 'smooth'});
};

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

// 공지사항 상세 조회 - NoticeDetail 컴포넌트로 이동
const handleBackToList = () => {
  // 상태 초기화
  selectedNotice.value = null;

  // 라우터로 공지사항 목록 페이지로 이동
  router.push('/notice');

  // 바로 목록 데이터 로드
  setTimeout(() => {
    fetchNotices();
  }, 100);
};

// 라우터 변경 감지
watch(() => route.params.id, (newId) => {
  if (newId) {
    // ID가 있으면 상세 보기 모드
    selectedNotice.value = { id: newId };
  } else {
    // ID가 없으면 목록 모드
    selectedNotice.value = null;
    currentPage.value = 1; // 목록으로 돌아올 때 첫 페이지로 초기화
  }
}, { immediate: true });

onMounted(() => {
  console.log('Notice 컴포넌트 마운트됨, 경로 params:', route.params);
  if (!route.params.id) {
    fetchNotices();
  }
  checkAdminRole();
});
</script>

<style scoped>
@import "@/modules/board/assets/boardCommon.css";
</style>
