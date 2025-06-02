<template>
  <div class="container py-4">
    <h2 class="mb-3">분실물 목록</h2><br>

    <!-- 검색 필터 -->
    <div class="card p-3 mb-4">
      <div class="row mb-2">
        <label class="col-sm-2 col-form-label fw-bold">등록일</label>
        <div class="col-sm-10">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="1" v-model="period" />
            <label class="form-check-label">당일</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="3" v-model="period" />
            <label class="form-check-label">3일</label>
          </div>
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="7" v-model="period" />
            <label class="form-check-label">7일</label>
          </div>
        </div>
      </div>

      <div class="row mb-2">
        <label class="col-sm-2 col-form-label fw-bold">분실물</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="itemName" placeholder="예: 지갑, 핸드폰" />
        </div>
      </div>

      <!-- 버스회사 / 노선 드롭다운 -->
      <div class="row mb-2">
        <label class="col-sm-2 col-form-label fw-bold">버스회사 / 노선</label>
        <div class="col-sm-5">
          <select class="form-select" v-model="selectedBusCompanyId" @change="handleCompanyChange">
            <option disabled value="">선택</option>
            <option v-for="company in busCompanies" :key="company.id" :value="company.id">
              {{ company.companyName }}
            </option>
          </select>
        </div>
        <div class="col-sm-5">
          <select class="form-select" v-model="selectedBusNumber">
            <option disabled value="">선택</option>
            <option v-for="bus in buses" :key="bus" :value="bus">{{ bus }}</option>
          </select>
        </div>
      </div>

      <div class="text-end">
        <!-- ✅ 초기화 버튼 추가 -->
        <button class="btn btn-secondary me-2" @click="resetFilters">초기화</button>
        <button class="btn btn-primary" @click="handleSearch">검색</button>
      </div>
    </div>

    <table class="table table-bordered text-center align-middle">
      <thead class="table-light">
      <tr>
        <th>번호</th>
        <th>분실물</th>
        <th>내용</th>
        <th>분실일</th>
        <th>버스회사<br />노선번호</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in pagedItems" :key="item.id" @click="openModal('detail', item)" style="cursor: pointer;">
        <td>{{ item.id }}</td>
        <td>{{ displayText(item.title) }}</td>
        <td>{{ trimText(item.content) }}</td>
        <td>{{ formatDate(item.lostTime) }}</td>
        <td>{{ displayText(item.busCompany) }}<br />{{ displayText(item.busNumber) }}</td>
      </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-outline-secondary" @click="goToMyLostItems">내 글 모아보기</button>
      <button class="btn btn-outline-primary" @click="openModal('create')">분실물 등록</button>
    </div>

    <div class="d-flex justify-content-center my-3">
      <button class="btn btn-sm btn-outline-secondary me-2" :disabled="page === 1" @click="page--">이전</button>
      <span class="align-self-center">Page {{ page }} / {{ totalPages }}</span>
      <button class="btn btn-sm btn-outline-secondary ms-2" :disabled="page === totalPages" @click="page++">다음</button>
    </div>

    <Modal v-if="modalType" @close="closeModal">
      <template #default>
        <LostItemForm v-if="modalType === 'create'" @submit="handleCreate" />
        <LostPublicDetail v-else :item="selectedItem" @close="closeModal" />
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Modal from '@/modules/lostFound/components/Modal.vue';
import LostItemForm from '@/modules/lostFound/components/LostItemForm.vue';
import LostPublicDetail from '@/modules/lostFound/views/user/LostPublicDetail.vue';
import { getAllLostItems, getBusCompanies, getBusesByCompany, createLostItem } from '@/modules/lostFound/api/lostFound';

const router = useRouter();
const goToMyLostItems = () => router.push('/mypage/lost');

const lostItems = ref([]);
const modalType = ref(null);
const selectedItem = ref(null);

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

  console.log('🔍 검색 파라미터 확인:', params);

  const res = await axios.get(`/api/lost/search?` +
      `itemName=${encodeURIComponent(itemName.value)}&` +
      `busCompany=${encodeURIComponent(companyName)}&` +
      `busNumber=${encodeURIComponent(selectedBusNumber.value)}&` +
      `startDate=${startDate.value}&endDate=${endDate.value}`);

  lostItems.value = res.data;
  page.value = 1;
};

// ✅ 초기화 메서드 추가
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

const openModal = (type, item = null) => {
  modalType.value = type;
  selectedItem.value = item;
};

const closeModal = () => {
  modalType.value = null;
  selectedItem.value = null;
};

const handleCreate = async (formData) => {
  await createLostItem(formData);
  await fetchItems();
  closeModal();
  page.value = 1;
};

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

<style scoped>
.container {
  max-width: 960px;
  font-size: 0.95rem;
}

h2 {
  text-align: center;
  font-weight: bold;
}

.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f8f9fa;
}

.form-label {
  font-weight: 600;
}

.form-check-label {
  font-weight: 500;
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

.btn-outline-primary,
.btn-outline-secondary {
  min-width: 100px;
}

.d-flex .btn {
  margin-left: 8px;
}
</style>
