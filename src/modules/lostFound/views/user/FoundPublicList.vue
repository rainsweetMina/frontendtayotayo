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
        <button class="btn btn-primary" @click="fetchFoundItems">검색</button>
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
      <tr v-for="item in items" :key="item.id" @click="openDetail(item)" style="cursor: pointer;">
        <td>{{ item.id }}</td>
        <td><img :src="item.photoUrl" alt="사진" width="60" height="60" /></td>
        <td>{{ item.itemName }}</td>
        <td>{{ item.content }}</td>
        <td>{{ formatDate(item.foundTime) }}</td>
        <td>{{ item.busCompany }}<br />{{ item.busNumber }}</td>
      </tr>
      </tbody>
    </table>

    <!-- 📦 상세 모달 -->
    <Modal v-if="selectedItem" @close="selectedItem = null">
      <FoundPublicDetail :item="selectedItem" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Modal from '@/modules/lostFound/components/Modal.vue';
import FoundPublicDetail from './FoundPublicDetail.vue';
import { getBusCompanies, getBusesByCompany } from '@/modules/lostFound/api/foundPublic';

const dateRange = ref('7');
const searchKeyword = ref('');
const selectedCompanyId = ref('');
const selectedRoute = ref('');
const busCompanies = ref([]);
const busRoutes = ref([]);

const items = ref([]);
const selectedItem = ref(null);

// 🗓 날짜 계산
const getStartDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - (daysAgo - 1));
  return date.toISOString().split('T')[0];
};

// 🔍 검색 API 요청
const fetchFoundItems = async () => {
  const companyObj = busCompanies.value.find(c => c.id === selectedCompanyId.value);
  const companyName = companyObj ? companyObj.companyName : '';

  const params = {
    keyword: searchKeyword.value,
    busCompany: companyName,
    busNumber: selectedRoute.value,
    startDate: getStartDate(Number(dateRange.value)),
    endDate: new Date().toISOString().split('T')[0],
  };

  // 빈 값 제거
  Object.keys(params).forEach(key => {
    if (!params[key]) delete params[key];
  });

  try {
    const res = await axios.get('/api/found/search', { params });
    items.value = res.data;
  } catch (e) {
    console.error('❌ 검색 실패:', e);
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
  dateRange.value = '7';
  searchKeyword.value = '';
  selectedCompanyId.value = '';
  selectedRoute.value = '';
  busRoutes.value = [];
  fetchFoundItems();
};

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '-';
};

const openDetail = (item) => {
  selectedItem.value = item;
};

onMounted(() => {
  fetchBusCompanies();
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
