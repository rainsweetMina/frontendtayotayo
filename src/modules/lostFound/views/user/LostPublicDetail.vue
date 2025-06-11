<template>
  <div class="container py-4">
    <div class="card p-4 bg-light">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0">분실물 상세 정보</h5>
        <button class="btn btn-outline-secondary btn-sm" @click="goBack">
          <i class="bi bi-arrow-left me-1"></i> 목록으로
        </button>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">분실물</label>
        <input class="form-control" :value="item?.title || '-'" readonly />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">분실일</label>
        <input class="form-control" :value="formatDate(item?.lostTime)" readonly />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">버스 회사</label>
        <input class="form-control" :value="item?.busCompany || '-'" readonly />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">노선번호</label>
        <input class="form-control" :value="item?.busNumber || '-'" readonly />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">내용</label>
        <textarea class="form-control" :value="item?.content || '-'" readonly rows="4" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const item = ref(null);

const goBack = () => {
  router.push('/lost');
};

const fetchItem = async () => {
  try {
    const { data } = await axios.get(`/api/lost/${route.params.id}`);
    item.value = data;
  } catch (error) {
    console.error('분실물 상세 정보 조회 실패:', error);
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '-' : d.toISOString().split('T')[0];
};

onMounted(() => {
  fetchItem();
});
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
