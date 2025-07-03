<template>
  <div class="board-main-container">
    <AlertMessage
      v-if="alert.show"
      :type="alert.type"
      :title="alert.title"
      :message="alert.message"
      :dismissible="true"
      @close="alert.show = false"
    />
    <CommonModal
      :isOpen="modal.open"
      title="삭제 확인"
      message="정말 삭제하시겠습니까?"
      confirmText="삭제"
      confirmType="danger"
      :showCancel="true"
      cancelText="취소"
      @close="modal.open = false"
      @confirm="confirmDelete"
    />
    <div class="flex justify-between items-center mb-6">
      <h1 class="title">나의 분실물 신고 목록</h1>
      <p class="text-xs text-gray-500 mt-1">
        ※ 관리자가 숨김 또는 삭제한 글은 목록에 보이지 않습니다.
      </p>
    </div>

    <!-- 등록 폼: 오직 홈페이지(/lost)에서만 표시 -->
    <div v-if="isLostPage" class="content-card p-6 mb-6">
      <LostItemForm @submit="handleCreate" />
    </div>

    <!-- 목록 -->
    <div v-if="lostItems.length" class="content-card">
      <LostItemCard
          v-for="item in lostItems"
          :key="item.id"
          :item="item"
          @delete="handleDelete"
          @edit="goToEditPage"
          @view="goToDetailPage"
      />
    </div>
    <div v-else class="content-card p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">등록된 분실물이 없습니다</h3>
      <p class="mt-1 text-sm text-gray-500">새로운 분실물을 등록해보세요.</p>
    </div>
  </div>
  <router-link to="/mypage" class="back-button">← 마이페이지로 돌아가기</router-link>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMyLostItems, createLostItem, deleteLostItem } from '@/modules/lostFound/api/lostPublic.js';
import LostItemCard from '@/modules/lostFound/components/LostItemCard.vue';
import LostItemForm from '@/modules/lostFound/components/LostItemForm.vue';
import CommonModal from '@/components/CommonModal.vue';
import AlertMessage from '@/modules/adminpage/dashboard/components/AlertMessage.vue';

const lostItems = ref([]);
const route = useRoute();
const router = useRouter();

const isLostPage = computed(() => route.path.startsWith('/lost') && !route.path.startsWith('/mypage/lost'));

const modal = ref({ open: false, id: null });
const alert = ref({ show: false, type: 'success', title: '', message: '' });

const fetchItems = async () => {
  const { data } = await getMyLostItems();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  lostItems.value = data.filter(item => {
    // 등록일 또는 분실일 기준 7일 이내만 표시
    const itemDate = item.createdAt ? new Date(item.createdAt) : new Date(item.lostTime);
    if (itemDate < sevenDaysAgo) return false;
    // 7일 이내면 숨김/삭제여도 목록에 보임
    return true;
  }).sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.lostTime);
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.lostTime);
    return dateB - dateA;
  });
};

onMounted(fetchItems);

const handleCreate = async (formData) => {
  await createLostItem(formData);
  await fetchItems();
};

const handleDelete = (id) => {
  modal.value.open = true;
  modal.value.id = id;
};

const confirmDelete = async () => {
  const id = modal.value.id;
  modal.value.open = false;
  try {
    await deleteLostItem(id);
    alert.value = {
      show: true,
      type: 'success',
      title: '삭제 완료',
      message: '분실물 신고가 삭제되었습니다.'
    };
    await fetchItems();
  } catch (e) {
    alert.value = {
      show: true,
      type: 'error',
      title: '오류',
      message: e?.response?.data?.message || '삭제 중 오류가 발생했습니다.'
    };
  }
};

const goToEditPage = (item) => {
  router.push(`/mypage/lost/edit/${item.id}`);
};

const goToDetailPage = (item) => {
  router.push(`/mypage/lost/${item.id}`);
};
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

.container {
  max-width: 800px;
}

.back-button {
  background: none;
  color: #4889cd;
  border: none;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  margin: 0 auto 10px auto;
  display: block;
  text-align: center;

  position: relative;
  z-index: 10; /* 모달이나 다른 요소보다 위에 오도록 */
}
</style>
