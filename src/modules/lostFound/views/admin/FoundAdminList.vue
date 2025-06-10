<template>
  <div class="container py-4">
    <h2 class="text-center mb-4">습득물 관리자 목록</h2>

    <!-- 🔍 검색 필터 -->
    <div class="card p-3 mb-4">
      <div class="row mb-2">
        <label class="col-sm-2 col-form-label fw-bold">습득일</label>
        <div class="col-sm-10">
          <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" value="1" v-model="dateRange" />
            <label class="form-check-label">당일</label>
            <input class="form-check-input ms-2" type="radio" value="3" v-model="dateRange" />
            <label class="form-check-label">3일</label>
            <input class="form-check-input ms-2" type="radio" value="7" v-model="dateRange" />
            <label class="form-check-label">일주일</label>
          </div>
        </div>
      </div>

      <div class="row mb-2">
        <label class="col-sm-2 col-form-label fw-bold">내용물</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="searchKeyword" placeholder="예: 지갑, 카드" />
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
        <th>ID</th>
        <th>사진</th>
        <th>물품명</th>
        <th>습득일</th>
        <th>상태</th>
        <th>매칭</th>
        <th>수정</th>
        <th>삭제</th>
        <th>숨김</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.id" :class="{ 'table-secondary': item.visible === false}">
        <td>
             <span v-if="item.visible === false" class="text-muted" title="숨김 항목">
              <i class="bi bi-eye-slash-fill me-1"></i>
            </span>
          {{ item.id }}</td>
        <td><img :src="getPhotoUrl(item.photoUrl)" width="50" height="50" /></td>
        <td>{{ item.itemName }}</td>
        <td>{{ formatDate(item.foundTime) }}</td>
        <td>{{ formatStatus(item) }}</td>
        <td>
          <input v-model="item.matchId" placeholder="분실물 ID" class="form-control mb-1" />
          <button class="btn btn-sm btn-outline-success" @click="matchItem(item)">매칭</button>
        </td>
        <td><button class="btn btn-sm btn-outline-primary" @click="editItem(item)">수정</button></td>
        <td><button class="btn btn-sm btn-outline-danger" @click="deleteItem(item)">삭제</button></td>
        <td><button class="btn btn-sm btn-outline-warning" @click="hideItem(item)">숨김</button></td>
      </tr>
      </tbody>
    </table>

    <!-- ➕ 등록 버튼 -->
    <div class="text-end">
      <button class="btn btn-success" @click="openRegisterModal">등록</button>
    </div>

    <!-- 모달 (등록 or 수정) -->
    <Modal v-if="showModal" @close="showModal = false">
      <FoundItemForm :item="selectedItem" @submitted="onItemSubmitted" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Modal from '@/modules/lostFound/components/Modal.vue';
import FoundItemForm from '@/modules/lostFound/components/FoundItemForm.vue';
import { getFoundItemsForAdmin } from '@/modules/lostFound/api/foundAdmin';
import {
  matchFoundItem,
  deleteFoundItem,
  hideFoundItem
} from '@/modules/lostFound/api/foundAdmin';


const dateRange = ref('7');
const searchKeyword = ref('');
const items = ref([]);
const showModal = ref(false);
const selectedItem = ref(null);

// 날짜 포맷
const getStartDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - (daysAgo - 1));
  return date.toISOString().split('T')[0];
};

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '-';
};

const formatStatus = (item) => {
  if (item.isDeleted) return '삭제됨';
  if (item.status === 'RETURNED') return '수령완료';
  return '보관중';
};

const fetchFoundItems = async () => {
  const params = {
    keyword: searchKeyword.value,
    startDate: getStartDate(Number(dateRange.value)),
    endDate: new Date().toISOString().split('T')[0],
  };
  const res = await getFoundItemsForAdmin(params);
  items.value = res.data.map(i => ({ ...i, matchId: '' }));
};

const resetFilters = () => {
  dateRange.value = '7';
  searchKeyword.value = '';
  fetchFoundItems();
};

const openRegisterModal = () => {
  selectedItem.value = null;
  showModal.value = true;
};

const editItem = (item) => {
  selectedItem.value = item;
  showModal.value = true;
};

const onItemSubmitted = () => {
  showModal.value = false;
  fetchFoundItems();
};

// matchItem: 목록에서 분실물 ID를 입력해 매칭
const matchItem = async (item) => {
  if (!item.matchId) {
    alert('분실물 ID를 입력하세요.');
    return;
  }
  try {
    await matchFoundItem(item.id, item.matchId);
    alert('매칭 완료');
    fetchFoundItems();
  } catch (e) {
    alert('매칭 실패');
  }
};

// deleteItem: 삭제 처리
const deleteItem = async (item) => {
  if (!confirm('삭제하시겠습니까?')) return;
  try {
    await deleteFoundItem(item.id);
    alert('삭제 완료');
    fetchFoundItems();
  } catch (e) {
    alert('삭제 실패');
  }
};

// hideItem: 숨김 처리
const hideItem = async (item) => {
  try {
    await hideFoundItem(item.id);
    alert('숨김 처리 완료');
    fetchFoundItems();
  } catch (e) {
    alert('숨김 실패');
  }
};
const getPhotoUrl = (photoUrl) => {
  return photoUrl ? `/uploads/found/${photoUrl}` : '/img/no-image.png';
};

onMounted(() => {
  fetchFoundItems();
});

// TODO: matchItem, deleteItem, hideItem 추가 필요
</script>
