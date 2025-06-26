<template>
  <div class="max-w-6xl mx-auto py-8 px-4">
    <!-- 헤더 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
      <div class="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-xl font-bold text-white flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            습득물 목록
          </h1>
        </div>
      </div>
    </div>

    <!-- 🔍 검색 카드 -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
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
              <input type="radio" value="1" v-model="dateRange" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500" />
              <span class="ml-2 text-sm text-gray-700">당일</span>
            </label>
            <label class="flex items-center">
              <input type="radio" value="3" v-model="dateRange" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500" />
              <span class="ml-2 text-sm text-gray-700">3일</span>
            </label>
            <label class="flex items-center">
              <input type="radio" value="7" v-model="dateRange" class="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500" />
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
            placeholder="예: 지갑, 카드" 
          />
        </div>

        <!-- 버스회사 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">버스회사</label>
          <select 
            v-model="selectedCompanyId" 
            @change="handleCompanyChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          초기화
        </button>
        <button 
          @click="handleSearch"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          검색
        </button>
      </div>
    </div>

    <!-- 📋 목록 테이블 -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사진</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">물품명</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">내용</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">습득일</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">버스정보</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="item in items" 
              :key="item.id" 
              @click="goToItemDetail(item.id)" 
              class="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex-shrink-0 h-16 w-16">
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.itemName }}</td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{{ item.content }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(item.foundTime) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
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

      const { data } = await axios.get('/api/found/search', { params });
      items.value = data;
    } else {
      // 초기 로딩 시에도 날짜 범위 적용
      const params = {
        startDate,
        endDate
      };
      const { data } = await axios.get('/api/found/search', { params });
      items.value = data;
    }
  } catch (e) {
    items.value = [];
    console.error('❌ 목록 조회 실패:', e);
  }
};

// 🏢 버스회사 목록
const fetchBusCompanies = async () => {
  const res = await getBusCompanies();
  busCompanies.value = res.data;
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
