<template>
  <div class="container py-4">
    <h2 class="text-center mb-3">습득물 목록</h2>

    <!-- 🔍 검색 카드 -->
    <div class="card p-3 mb-4">
      <div class="row mb-2">
        <label class="col-sm-2 col-form-label fw-bold">습득일</label>
        <div class="col-sm-10">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="1" v-model="dateRange" />
            <label class="form-check-label">당일</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="3" v-model="dateRange" />
            <label class="form-check-label">3일</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="7" v-model="dateRange" />
            <label class="form-check-label">일주일</label>
          </div>
        </div>
      </div>

      <div class="row mb-2">
        <label class="col-sm-2 col-form-label fw-bold">내용물</label>
        <div class="col-sm-10">
          <input type="text" v-model="searchKeyword" class="form-control" placeholder="예: 지갑, 카드" />
        </div>
      </div>

      <div class="row mb-2">
        <label class="col-sm-2 col-form-label fw-bold">버스회사 / 노선</label>
        <div class="col-sm-5">
          <select class="form-select" v-model="selectedCompanyId" @change="handleCompanyChange">
            <option disabled value="">선택</option>
            <option v-for="company in busCompanies" :key="company.id" :value="company.id">
              {{ company.companyName }}
            </option>
          </select>
        </div>
        <div class="col-sm-5">
          <select class="form-select" v-model="selectedRoute">
            <option disabled value="">선택</option>
            <option v-for="route in busRoutes" :key="route" :value="route">
              {{ route }}
            </option>
          </select>
        </div>
      </div>

      <div class="text-end">
        <button class="btn btn-secondary me-2" @click="resetFilters">초기화</button>
        <button class="btn btn-primary" @click="handleSearch">검색</button>
      </div>
    </div>

    <!-- 📋 목록 테이블 -->
    <table class="table table-bordered text-center align-middle">
      <thead class="table-light">
      <tr>
        <th>번호</th>
        <th>사진</th>
        <th>물품명</th>
        <th>내용</th>
        <th>습득일</th>
        <th>버스회사<br />노선번호</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.id" @click="goToItemDetail(item.id)" style="cursor: pointer;">
        <td>{{ item.id }}</td>
        <td>
          <img 
            v-if="item.photoUrl" 
            :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`" 
            alt="사진" 
            width="60" 
            height="60" 
            class="rounded border"
          />
          <div v-else class="bg-light rounded d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
            <span class="text-muted small">없음</span>
          </div>
        </td>
        <td>{{ item.itemName }}</td>
        <td>{{ item.content }}</td>
        <td>{{ formatDate(item.foundTime) }}</td>
        <td>{{ item.busCompany }}<br />{{ item.busNumber }}</td>
      </tr>
      </tbody>
    </table>
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

// 검색 버튼 클릭시
const handleSearch = async () => {
  console.log('검색 버튼 클릭');
  fetchFoundItems();
};

// 🔍 검색 API 요청
const fetchFoundItems = async () => {
  try {
    console.log('🔍 검색 요청 시작');
    
    // 검색 파라미터 준비
    const companyObj = busCompanies.value.find(c => c.id === selectedCompanyId.value);
    const companyName = companyObj ? companyObj.companyName : '';

    // 날짜 계산
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = getStartDate(Number(dateRange.value));
    
    console.log('날짜 범위:', { startDate, endDate });

    // 목록 데이터 가져오기 (검색 대신 기본 목록 API 사용)
    console.log('전체 목록 조회 요청');
    const { data } = await axios.get('/api/found');
    console.log('목록 응답:', data);
    
    items.value = data;
  } catch (e) {
    console.error('❌ 목록 조회 실패:', e);
    items.value = [];
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

// 초기화
const resetFilters = () => {
  console.log('필터 초기화');
  dateRange.value = '7';
  searchKeyword.value = '';
  selectedCompanyId.value = '';
  selectedRoute.value = '';
  busRoutes.value = [];
  
  // 초기화 후 목록 다시 로드
  fetchFoundItems();
};

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '-';
};

onMounted(() => {
  fetchBusCompanies();
  // 초기 로딩시 검색 실행
  fetchFoundItems();
});
</script>

<style scoped>
.container {
  max-width: 960px;
  font-size: 0.95rem;
}

.card {
  border-radius: 10px;
  background-color: #f8f9fa;
}

.table th,
.table td {
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table thead th {
  background-color: #f1f3f5;
  font-weight: bold;
}
</style>
