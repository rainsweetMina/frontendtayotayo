<template>
  <div class="p-5">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">저상버스 대체 안내 관리</h2>
      <router-link to="/admin/lowfloorbus/new" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">글쓰기</router-link>
    </div>

    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
      {{ error }}
    </div>

    <div class="bg-white rounded-lg shadow">
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else class="w-full">
        <table class="w-full divide-y divide-gray-200 table-fixed">
          <thead class="bg-gray-50">
          <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">번호</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[40%]">제목</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">작성자</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">작성일</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">관리</th>
          </tr>
        </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="!lowFloorBuses || lowFloorBuses.length === 0">
              <td colspan="5" class="px-4 py-4 text-center text-sm text-gray-500">등록된 저상버스 대체 안내가 없습니다.</td>
          </tr>
            <tr v-for="lowFloorBus in lowFloorBuses" :key="lowFloorBus.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-500">{{ lowFloorBus.id }}</td>
              <td class="px-4 py-3 truncate">
                <router-link :to="`/admin/lowfloorbus/${lowFloorBus.id}`" class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                {{ lowFloorBus.title }}
              </router-link>
            </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ lowFloorBus.author }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(lowFloorBus.createdDate) }}</td>
              <td class="px-4 py-3 text-right text-sm font-medium">
                <router-link :to="`/admin/lowfloorbus/${lowFloorBus.id}/edit`" class="text-indigo-600 hover:text-indigo-900 mr-2">수정</router-link>
                <button @click="deleteLowFloorBus(lowFloorBus.id)" class="text-red-600 hover:text-red-900">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      
      <div v-if="!isLoading && lowFloorBuses && lowFloorBuses.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
import { useLowFloorBusApi } from '../../composables/useLowFloorBusApi.js';

export default {
  name: 'LowFloorBusManagement',
  setup() {
    const router = useRouter();
    const lowFloorBuses = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageSize = 10;
    const isLoading = ref(false);
    const error = ref('');

    const { getLowFloorBuses, deleteLowFloorBus: apiDeleteLowFloorBus } = useLowFloorBusApi();

    const fetchLowFloorBuses = async (page = 1) => {
      try {
        isLoading.value = true;
        error.value = '';
        const response = await getLowFloorBuses(page, pageSize);
        console.log('Fetched lowFloorBuses:', response.data);
        
        // 백엔드 응답 구조에 맞게 수정
        if (response.data && Array.isArray(response.data)) {
          // 배열 형태로 응답이 오는 경우
          lowFloorBuses.value = response.data;
          totalPages.value = Math.ceil(response.data.length / pageSize);
        } else if (response.data && response.data.content) {
          // 페이징 처리된 응답이 오는 경우
          lowFloorBuses.value = response.data.content;
          totalPages.value = response.data.totalPages || 1;
          currentPage.value = response.data.number + 1;
        } else {
          // 기타 응답 형식
          lowFloorBuses.value = [];
          totalPages.value = 1;
        }
      } catch (err) {
        console.error('저상버스 대체 안내 목록 조회 실패:', err);
        error.value = '저상버스 대체 안내 목록을 불러오는데 실패했습니다.';
        lowFloorBuses.value = [];
        totalPages.value = 1;
      } finally {
        isLoading.value = false;
      }
    };

    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      fetchLowFloorBuses(page);
    };

    const deleteLowFloorBus = async (id) => {
      if (confirm('정말 삭제하시겠습니까?')) {
        try {
          await apiDeleteLowFloorBus(id);
          await fetchLowFloorBuses(currentPage.value);
        } catch (err) {
          console.error('저상버스 대체 안내 삭제 실패:', err);
          alert('저상버스 대체 안내 삭제에 실패했습니다.');
        }
      }
    };

    onMounted(() => fetchLowFloorBuses(1));

    return {
      lowFloorBuses,
      currentPage,
      totalPages,
      isLoading,
      error,
      deleteLowFloorBus,
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