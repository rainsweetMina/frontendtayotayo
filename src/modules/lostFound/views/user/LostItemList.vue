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
          @edit="goToEditPage"
          @view="goToDetailPage"
      />
    </div>
    <div v-else class="text-muted">등록된 분실물이 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMyLostItems, createLostItem, deleteLostItem } from '@/modules/lostFound/api/lostPublic.js';
import LostItemCard from '@/modules/lostFound/components/LostItemCard.vue';
import LostItemForm from '@/modules/lostFound/components/LostItemForm.vue';

const lostItems = ref([]);
const route = useRoute();
const router = useRouter();

const isLostPage = computed(() => route.path.startsWith('/lost') && !route.path.startsWith('/mypage/lost'));

const fetchItems = async () => {
  const { data } = await getMyLostItems();
  
  // 7일이 지난 게시글 필터링
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  lostItems.value = data.filter(item => {
    // 삭제된 게시글 제외
    if (item.deleted) return false;
    
    // 등록일 또는 분실일 기준으로 7일 이내인 것만 표시
    const itemDate = item.createdAt ? new Date(item.createdAt) : new Date(item.lostTime);
    return itemDate >= sevenDaysAgo;
  }).sort((a, b) => {
    // 최신 등록순 정렬 (createdAt 기준, 없으면 lostTime)
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

const handleDelete = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await deleteLostItem(id);
    await fetchItems();
  }
};

const goToEditPage = (item) => {
  router.push(`/mypage/lost/edit/${item.id}`);
};

const goToDetailPage = (item) => {
  router.push(`/mypage/lost/${item.id}`);
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
