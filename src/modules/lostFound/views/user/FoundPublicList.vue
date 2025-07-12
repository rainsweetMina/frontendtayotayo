<template>
  <div class="board-main-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">습득물 목록</h1>
    </div>

    <!-- 한달 후 폐기 안내 -->
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <p class="text-sm text-yellow-800 font-medium">
          습득물은 한달 후 폐기됩니다. 분실물을 찾으시는 경우 빠른 시일 내에 확인해주세요.
        </p>
      </div>
    </div>

    <!-- 검색 카드 -->
    <div class="content-card p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        검색 조건
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- 습득일 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">습득일</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" value="1" v-model="dateRange" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">당일</span>
            </label>
            <label class="flex items-center">
              <input type="radio" value="3" v-model="dateRange" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">3일</span>
            </label>
            <label class="flex items-center">
              <input type="radio" value="7" v-model="dateRange" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">일주일</span>
            </label>
          </div>
        </div>

        <!-- 내용물 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">내용물</label>
          <input
              type="text"
              v-model="searchKeyword"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="예: 지갑, 카드"
              @keyup.enter="handleSearch"
          />
        </div>

        <!-- 버스회사 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">버스회사</label>
          <select
              v-model="selectedCompanyId"
              @change="handleCompanyChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option disabled value="">선택</option>
            <option v-for="company in busCompanies" :key="company.id" :value="company.id">
              {{ company.companyName }}
            </option>
          </select>
        </div>

        <!-- 노선 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">노선</label>
          <select
              v-model="selectedRoute"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option disabled value="">선택</option>
            <option v-for="route in busRoutes" :key="route" :value="route">
              {{ route }}
            </option>
          </select>
        </div>
      </div>

      <!-- 검색 버튼 -->
      <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
        <button
            @click="resetFilters"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          초기화
        </button>
        <button
            @click="handleSearch"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          검색
        </button>
      </div>
    </div>

    <!-- 목록 테이블 -->
    <div class="content-card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">번호</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">사진</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">물품명</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">내용</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">습득일</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40">버스정보</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr
              v-for="item in sortedItems"
              :key="item.id"
              @click="goToItemDetail(item.id)"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ item.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <div class="flex-shrink-0 h-16 w-16 mx-auto">
                <img
                    v-if="item.photoUrl"
                    :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`"
                    alt="사진"
                    class="h-16 w-16 rounded-lg object-cover border border-gray-200"
                />
                <div v-else class="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{{ item.itemName }}</td>
            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate text-center">{{ item.content }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ formatDate(item.foundTime) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
              <div>
                <div class="font-medium">{{ item.busCompany }}</div>
                <div class="text-gray-500">{{ item.busNumber }}</div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 빈 상태 -->
      <div v-if="items.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">습득물이 없습니다</h3>
        <p class="mt-1 text-sm text-gray-500">검색 조건을 변경해보세요.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { publicApi } from '@/api/axiosInstance'
import { getBusCompanies, getBusesByCompany } from '@/modules/lostFound/api/foundPublic';

const router = useRouter();
const goToItemDetail = (id) => router.push(`/found/${id}`);

const dateRange = ref('7');
const searchKeyword = ref('');
const selectedCompanyId = ref('');
const selectedRoute = ref('');
const busCompanies = ref([]);
const busRoutes = ref([]);
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '';

const items = ref([]);

const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => (b.id || 0) - (a.id || 0));
});

// 🗓 날짜 계산
const getStartDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - (daysAgo - 1));
  return date.toISOString().split('T')[0];
};

// ✅ 목록 데이터 가져오기 (isSearch: 검색이면 true, 전체/초기화면 false)
const fetchFoundItems = async (isSearch = false) => {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = getStartDate(Number(dateRange.value));

    if (isSearch) {
      // ✅ 회사 id가 아니라, "회사명"을 찾아서 전달!
      const companyObj = busCompanies.value.find(c => c.id === selectedCompanyId.value);
      const companyName = companyObj ? companyObj.companyName : '';
      const params = {
        startDate,
        endDate,
        keyword: searchKeyword.value || undefined,
        busCompany: companyName || undefined,  // 회사명!
        busNumber: selectedRoute.value || undefined // 노선번호 그대로
      };
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      console.log("✅ [검색 파라미터]", params);

      const { data } = await publicApi.get('/api/found/search', { params });
      console.log('API 응답 데이터:', data);

      // 데이터가 배열인지 확인하고 안전하게 처리
      const dataArray = Array.isArray(data) ? data : [];
      items.value = dataArray.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : (a.foundTime ? new Date(a.foundTime) : 0);
        const dateB = b.createdAt ? new Date(b.createdAt) : (b.foundTime ? new Date(b.foundTime) : 0);
        return dateB - dateA;
      });
    } else {
      // 초기 로딩 시에도 날짜 범위 적용
      const params = {
        startDate,
        endDate
      };
      const { data } = await publicApi.get('/api/found/search', { params });
      console.log('초기 로딩 API 응답 데이터:', data);

      // 데이터가 배열인지 확인하고 안전하게 처리
      const dataArray = Array.isArray(data) ? data : [];
      items.value = dataArray.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : (a.foundTime ? new Date(a.foundTime) : 0);
        const dateB = b.createdAt ? new Date(b.createdAt) : (b.foundTime ? new Date(b.foundTime) : 0);
        return dateB - dateA;
      });
    }
  } catch (e) {
    // 로그인 필요 에러가 발생해도 빈 배열로 처리하여 페이지가 정상적으로 표시되도록 함
    items.value = [];
    if (e.message === '로그인 필요') {
      console.warn('⚠️ 로그인 없이 접근 - 빈 목록으로 표시');
    } else if (e.message === 'Network Error') {
      console.warn('⚠️ 서버 연결 실패 - 백엔드 서버가 실행되지 않았을 수 있습니다');
      // 사용자에게 알림 표시 (선택사항)
      // alert('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    } else {
      console.error('❌ 목록 조회 실패:', e);
      console.error('❌ 에러 상세 정보:', {
        message: e.message,
        response: e.response?.data,
        status: e.response?.status
      });
    }
  }
};

// 🏢 버스회사 목록
const fetchBusCompanies = async () => {
  try {
    const res = await getBusCompanies();
    busCompanies.value = res.data;
  } catch (e) {
    // 로그인 필요 에러가 발생해도 빈 배열로 처리
    busCompanies.value = [];
    if (e.message === '로그인 필요') {
      console.warn('⚠️ 로그인 없이 접근 - 버스회사 목록을 불러올 수 없습니다');
    } else if (e.message === 'Network Error') {
      console.warn('⚠️ 서버 연결 실패 - 버스회사 목록을 불러올 수 없습니다');
    } else {
      console.error('❌ 버스회사 목록 조회 실패:', e);
    }
  }
};

// 🚌 노선 목록
const handleCompanyChange = async () => {
  if (selectedCompanyId.value) {
    const res = await getBusesByCompany(selectedCompanyId.value);
    busRoutes.value = res.data;
  } else {
    busRoutes.value = [];
    selectedRoute.value = '';
  }
};

// ✅ 검색 버튼
const handleSearch = () => fetchFoundItems(true);

// ✅ 초기화 버튼
const resetFilters = () => {
  dateRange.value = '7';
  searchKeyword.value = '';
  selectedCompanyId.value = '';
  selectedRoute.value = '';
  busRoutes.value = [];
  fetchFoundItems(false);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return (
      date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0')
  );
};

onMounted(() => {
  fetchBusCompanies();
  // 초기 로딩시 검색 실행
  fetchFoundItems();
});
</script>

<style>
@import "@/modules/board/assets/boardCommon.css";
/* 공통 스타일 */
.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
  padding-left: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  border-left: 6px solid #4d9eff;
}

.content-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
