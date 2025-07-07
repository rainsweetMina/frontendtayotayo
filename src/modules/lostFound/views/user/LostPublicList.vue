<template>
  <div class="board-main-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">분실물 목록</h1>
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
        <!-- 등록일 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">등록일</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" value="1" v-model="period" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">당일</span>
            </label>
            <label class="flex items-center">
              <input type="radio" value="3" v-model="period" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">3일</span>
            </label>
            <label class="flex items-center">
              <input type="radio" value="7" v-model="period" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
              <span class="ml-2 text-sm text-gray-700">7일</span>
            </label>
          </div>
        </div>

        <!-- 분실물명 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">분실물</label>
          <input 
            v-model="itemName"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="예: 지갑, 핸드폰" 
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- 버스회사 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">버스회사</label>
          <select 
            v-model="selectedBusCompanyId" 
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
            v-model="selectedBusNumber"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option disabled value="">선택</option>
            <option v-for="bus in buses" :key="bus" :value="bus">{{ bus }}</option>
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
    <div class="content-card mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">번호</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">분실물</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">내용</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">분실일</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40">버스정보</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="item in pagedItems" 
              :key="item.id" 
              @click="goToItemDetail(item.id)" 
              class="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ item.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{{ displayText(item.title) }}</td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate text-center">{{ trimText(item.content) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{{ formatDate(item.lostTime) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                <div>
                  <div class="font-medium">{{ displayText(item.busCompany) }}</div>
                  <div class="text-gray-500">{{ displayText(item.busNumber) }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 빈 상태 -->
      <div v-if="!pagedItems.length" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">등록된 분실물 신고가 없습니다</h3>
        <p class="mt-1 text-sm text-gray-500">검색 조건을 변경해보세요.</p>
      </div>
    </div>

    <!-- 페이징 -->
    <div v-if="totalPages > 1" class="flex justify-center space-x-2">
      <button 
        @click="page--" 
        :disabled="page === 1"
        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        이전
      </button>
      
      <span class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
        {{ page }} / {{ totalPages }}
      </span>
      
      <button 
        @click="page++" 
        :disabled="page === totalPages"
        class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        다음
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- 플로팅 버튼들 -->
    <div class="fixed bottom-8 right-8 flex flex-col space-y-3">
      <!-- 내 글 모아보기 버튼 -->
      <button 
        @click="goToMyLostItems"
        class="inline-flex items-center px-4 py-3 border border-transparent rounded-full shadow-lg text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        title="내 글 모아보기"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        내 글
      </button>
      
      <!-- 분실물 등록 버튼 -->
      <button 
        @click="goToCreatePage"
        class="inline-flex items-center px-6 py-3 border border-transparent rounded-full shadow-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        title="분실물 등록"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        등록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axiosInstance.js'
import { getAllLostItems, getBusCompanies, getBusesByCompany } from '@/modules/lostFound/api/lostPublic.js';

const router = useRouter();
const goToMyLostItems = () => router.push('/mypage/lost');
const goToItemDetail = (id) => router.push(`/lost/${id}`);
const goToCreatePage = () => router.push('/lost/create');

const lostItems = ref([]);

const period = ref('7');
const itemName = ref('');
const selectedBusCompanyId = ref('');
const selectedBusNumber = ref('');
const startDate = ref('');
const endDate = ref('');

const page = ref(1);
const pageSize = 15;

const busCompanies = ref([]);
const buses = ref([]);

const fetchBusCompanies = async () => {
  const { data } = await getBusCompanies();
  busCompanies.value = data;
};

const handleCompanyChange = async () => {
  const company = busCompanies.value.find(c => c.id === selectedBusCompanyId.value);
  if (company) {
    const { data } = await getBusesByCompany(company.id);
    buses.value = data;
  } else {
    buses.value = [];
  }
};

const calculateDateRange = () => {
  const today = new Date();
  const days = parseInt(period.value);
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - (days - 1));
  startDate.value = pastDate.toISOString().split('T')[0];
  endDate.value = today.toISOString().split('T')[0];
};

const handleSearch = async () => {
  calculateDateRange();
  const company = busCompanies.value.find(c => c.id === selectedBusCompanyId.value);
  const companyName = company ? company.companyName : '';

  const params = {
    itemName: itemName.value,
    busCompany: companyName,
    busNumber: selectedBusNumber.value,
    startDate: startDate.value,
    endDate: endDate.value
  };

  const res = await api.get(`/api/lost/search?` +
      `itemName=${encodeURIComponent(itemName.value)}&` +
      `busCompany=${encodeURIComponent(companyName)}&` +
      `busNumber=${encodeURIComponent(selectedBusNumber.value)}&` +
      `startDate=${startDate.value}&endDate=${endDate.value}`);

  lostItems.value = res.data;
  page.value = 1;
};

const resetFilters = () => {
  period.value = '7';
  itemName.value = '';
  selectedBusCompanyId.value = '';
  selectedBusNumber.value = '';
  buses.value = [];
  fetchItems();
};

const fetchItems = async () => {
  calculateDateRange();
  const res = await api.get(`/api/lost/search?` +
      `startDate=${startDate.value}&endDate=${endDate.value}`);
  lostItems.value = res.data;
};

const pagedItems = computed(() => {
  // 최신 등록순 정렬 (createdAt 기준, 없으면 lostTime)
  const sorted = [...lostItems.value].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.lostTime);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.lostTime);
    return dateB - dateA;
  });
  const start = (page.value - 1) * pageSize;
  return sorted.slice(start, start + pageSize);
});

const totalPages = computed(() => Math.ceil(lostItems.value.length / pageSize));

const trimText = (text, max = 50) => {
  if (!text || text === 'string') return '정보 없음';
  return text.length > max ? text.slice(0, max) + '…' : text;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toISOString().split('T')[0];
};

const displayText = (text) => {
  if (!text || text === 'string' || text.trim() === '') return '정보 없음';
  return text;
};

onMounted(() => {
  fetchItems();
  fetchBusCompanies();
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
