<template>
  <div class="container py-4">
    <h2 class="mb-3">분실물 목록</h2>

    <!-- 등록 버튼 -->
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-outline-secondary" @click="goToMyLostItems">내 글 모아보기</button>
      <button class="btn btn-outline-primary" @click="openModal('create')">분실물 등록</button>
    </div>

    <!-- 목록 테이블 -->
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
      <tr
          v-for="item in pagedItems"
          :key="item.id"
          @click="openModal('detail', item)"
          style="cursor: pointer;"
      >
        <td>{{ item.id }}</td>
        <td>{{ displayText(item.title) }}</td>
        <td>{{ trimText(item.content) }}</td>
        <td>{{ formatDate(item.lostTime) }}</td>
        <td>
          {{ displayText(item.busCompany) }}<br />
          {{ displayText(item.busNumber) }}
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 페이징 -->
    <div class="d-flex justify-content-center my-3">
      <button class="btn btn-sm btn-outline-secondary me-2" :disabled="page === 1" @click="page--">이전</button>
      <span class="align-self-center">Page {{ page }} / {{ totalPages }}</span>
      <button class="btn btn-sm btn-outline-secondary ms-2" :disabled="page === totalPages" @click="page++">다음</button>
    </div>

    <!-- 모달 -->
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

const router = useRouter();
const goToMyLostItems = () => {
  router.push('/mypage/lost');
};

import LostItemForm from '@/modules/lostFound/components/LostItemForm.vue';
import Modal from '@/modules/lostFound/components/Modal.vue';
import LostPublicDetail from '@/modules/lostFound/views/user/LostPublicDetail.vue';
import { getAllLostItems, createLostItem } from '@/modules/lostFound/api/lostFound';

const lostItems = ref([]);
const modalType = ref(null); // 'create' | 'detail' | null
const selectedItem = ref(null);

// 페이징
const page = ref(1);
const pageSize = 15;
const totalPages = computed(() => Math.ceil(lostItems.value.length / pageSize));
const pagedItems = computed(() => {
  const start = (page.value - 1) * pageSize;
  return lostItems.value.slice(start, start + pageSize);
});

// 데이터 로딩
const fetchItems = async () => {
  const res = await getAllLostItems();
  lostItems.value = res.data;
};

onMounted(fetchItems);

// 모달 열기/닫기
const openModal = (type, item = null) => {
  modalType.value = type;
  selectedItem.value = item;
};

const closeModal = () => {
  modalType.value = null;
  selectedItem.value = null;
};

// 등록 후 처리
const handleCreate = async (formData) => {
  await createLostItem(formData);
  await fetchItems();
  closeModal();
  page.value = 1;
};

// 유틸 함수들
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
</script>

<style scoped>
.container {
  max-width: 960px;
}
.table td,
.table th {
  vertical-align: middle;
}
</style>
