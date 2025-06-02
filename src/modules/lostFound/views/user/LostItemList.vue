<template>
  <div class="container py-4">
    <h2 class="mb-3">나의 분실물 신고 목록</h2>

    <!-- 등록 폼: 오직 홈페이지(/lost)에서만 표시 -->
    <LostItemForm v-if="isLostPage" @submit="handleCreate" />

    <hr class="my-4" />

    <div v-if="lostItems.length">
      <LostItemCard
          v-for="item in lostItems"
          :key="item.id"
          :item="item"
          @delete="handleDelete"
          @edit="openEditModal"
      />
    </div>
    <div v-else class="text-muted">등록된 분실물이 없습니다.</div>

    <!-- ✅ 수정 모달 -->
    <Modal v-if="showEditModal" @close="closeModal">
      <LostItemEdit :item="selectedItem" @updated="fetchItems" @close="closeModal" />
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getMyLostItems, createLostItem, deleteLostItem } from '@/modules/lostFound/api/lostFound';
import LostItemCard from '@/modules/lostFound/components/LostItemCard.vue';
import LostItemForm from '@/modules/lostFound/components/LostItemForm.vue';
import Modal from '@/modules/lostFound/components/Modal.vue';
import LostItemEdit from '@/modules/lostFound/components/LostItemEdit.vue';

const lostItems = ref([]);
const route = useRoute();

const showEditModal = ref(false);
const selectedItem = ref(null);

const isLostPage = computed(() => route.path.startsWith('/lost') && !route.path.startsWith('/mypage/lost'));

const fetchItems = async () => {
  const { data } = await getMyLostItems();
  lostItems.value = data;
};

onMounted(fetchItems);

const handleCreate = async (formData) => {
  await createLostItem(formData);
  await fetchItems();
};

const handleDelete = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await deleteLostItem(id);
    await fetchItems();
  }
};

const openEditModal = (item) => {
  selectedItem.value = item;
  showEditModal.value = true;
};

const closeModal = () => {
  selectedItem.value = null;
  showEditModal.value = false;
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
