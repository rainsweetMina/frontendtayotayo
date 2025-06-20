<template>
  <div class="w-full max-w-6xl mx-auto py-12 px-4">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-10 tracking-tight">분실물 목록</h2>

    <!-- 검색 카드: 넓고 여유롭게 -->
    <div class="bg-white rounded-2xl shadow border border-gray-100 p-8 mb-12">
      <div class="flex flex-col gap-8">
        <!-- 등록일 필터 -->
        <div class="flex flex-row items-center gap-8">
          <span class="min-w-[80px] text-base font-semibold text-gray-700">등록일</span>
          <div class="flex gap-4">
            <label class="inline-flex items-center gap-1">
              <input type="radio" value="1" v-model="period" class="accent-blue-600" />
              <span class="text-gray-700 text-sm">당일</span>
            </label>
            <label class="inline-flex items-center gap-1">
              <input type="radio" value="3" v-model="period" class="accent-blue-600" />
              <span class="text-gray-700 text-sm">3일</span>
            </label>
            <label class="inline-flex items-center gap-1">
              <input type="radio" value="7" v-model="period" class="accent-blue-600" />
              <span class="text-gray-700 text-sm">7일</span>
            </label>
          </div>
        </div>

        <!-- 분실물명 -->
        <div class="flex flex-row items-center gap-8">
          <span class="min-w-[80px] text-base font-semibold text-gray-700">분실물</span>
          <input
              v-model="itemName"
              placeholder="예: 지갑, 핸드폰"
              class="flex-1 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 px-4 py-3 text-gray-900 bg-gray-50"
          />
        </div>

        <!-- 버스회사/노선 -->
        <div class="flex flex-row items-center gap-8">
          <span class="min-w-[80px] text-base font-semibold text-gray-700">버스회사/노선</span>
          <select
              class="w-56 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-gray-800"
              v-model="selectedBusCompanyId"
              @change="handleCompanyChange"
          >
            <option disabled value="">선택</option>
            <option v-for="company in busCompanies" :key="company.id" :value="company.id">
              {{ company.companyName }}
            </option>
          </select>
          <select
              class="w-56 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-gray-800"
              v-model="selectedBusNumber"
          >
            <option disabled value="">선택</option>
            <option v-for="bus in buses" :key="bus" :value="bus">{{ bus }}</option>
          </select>
        </div>

        <!-- 검색/초기화 버튼 -->
        <div class="flex justify-end gap-4 pt-2">
          <button
              type="button"
              class="rounded-xl px-5 py-3 bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition"
              @click="resetFilters"
          >초기화</button>
          <button
              type="button"
              class="rounded-xl px-5 py-3 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
              @click="handleSearch"
          >검색</button>
        </div>
      </div>
    </div>

    <!-- 분실물 테이블 -->
    <div class="bg-white rounded-2xl shadow border border-gray-100 overflow-x-auto mb-8">
      <table class="min-w-full divide-y divide-gray-200 text-center text-base">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-8 py-5 text-base font-bold text-gray-600">번호</th>
          <th class="px-8 py-5 text-base font-bold text-gray-600">분실물</th>
          <th class="px-8 py-5 text-base font-bold text-gray-600">내용</th>
          <th class="px-8 py-5 text-base font-bold text-gray-600">분실일</th>
          <th class="px-8 py-5 text-base font-bold text-gray-600">버스회사<br/>노선번호</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="item in pagedItems"
            :key="item.id"
            @click="goToItemDetail(item.id)"
            class="hover:bg-blue-50 cursor-pointer border-b transition"
        >
          <td class="px-8 py-5 text-gray-900 font-medium">{{ item.id }}</td>
          <td class="px-8 py-5">{{ displayText(item.title) }}</td>
          <td class="px-8 py-5 max-w-xs truncate">{{ trimText(item.content) }}</td>
          <td class="px-8 py-5">{{ formatDate(item.lostTime) }}</td>
          <td class="px-8 py-5">
            {{ displayText(item.busCompany) }}<br />
            {{ displayText(item.busNumber) }}
          </td>
        </tr>
        <tr v-if="!pagedItems.length">
          <td colspan="5" class="px-8 py-16 text-gray-400 text-lg text-center">
            등록된 분실물 신고가 없습니다.
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 하단 버튼 영역 -->
    <div class="flex flex-wrap justify-end gap-5 mb-8">
      <button
          class="rounded-lg border border-gray-300 px-7 py-3 text-gray-700 bg-white font-semibold hover:bg-gray-100 transition"
          @click="goToMyLostItems"
      >내 글 모아보기</button>
      <button
          class="rounded-lg px-7 py-3 bg-blue-50 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-100 transition"
          @click="goToCreatePage"
      >분실물 등록</button>
    </div>

    <!-- 페이징 -->
    <div class="flex items-center justify-center gap-8 my-10">
      <button
          class="rounded px-5 py-2 border border-gray-300 text-gray-500 bg-white hover:bg-gray-100 transition"
          :disabled="page === 1"
          :class="{ 'opacity-60 cursor-not-allowed': page === 1 }"
          @click="page--"
      >이전</button>
      <span class="font-medium text-lg text-gray-700">Page {{ page }} / {{ totalPages }}</span>
      <button
          class="rounded px-5 py-2 border border-gray-300 text-gray-500 bg-white hover:bg-gray-100 transition"
          :disabled="page === totalPages"
          :class="{ 'opacity-60 cursor-not-allowed': page === totalPages }"
          @click="page++"
      >다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
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

  const res = await axios.get(`/api/lost/search?` +
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
};

const fetchItems = async () => {
  const res = await getAllLostItems();
  lostItems.value = res.data;
};

const pagedItems = computed(() => {
  const start = (page.value - 1) * pageSize;
  return lostItems.value.slice(start, start + pageSize);
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
