<template>
  <div class="container py-4">
    <h2 class="mb-3">나의 분실물 신고 목록</h2>

    <!-- 등록 폼: 오직 홈페이지(/lost)에서만 표시 -->
    <LostItemForm v-if="isLostPage" @submit="handleCreate" />

    <hr class="my-4" />

    <!-- 목록 -->
    <div v-if="lostItems.length">
      <LostItemCard
          v-for="item in lostItems"
          :key="item.id"
          :item="item"
          @delete="handleDelete"
      />
    </div>
    <div v-else class="text-muted">등록된 분실물이 없습니다.</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import { getMyLostItems, createLostItem, deleteLostItem } from '@/modules/lostFound/api/lostFound'
import LostItemCard from '@/modules/lostFound/components/LostItemCard.vue'
import LostItemForm from '@/modules/lostFound/components/LostItemForm.vue'

const lostItems = ref([])
const route = useRoute()

const isLostPage = computed(() => {
  return route.path.startsWith('/lost') && !route.path.startsWith('/mypage/lost')
})


const fetchItems = async () => {
  const { data } = await getMyLostItems()
  lostItems.value = data
}

onMounted(fetchItems)

const handleCreate = async (formData) => {
  await createLostItem(formData)
  await fetchItems()
}

const handleDelete = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await deleteLostItem(id)
    await fetchItems()
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
