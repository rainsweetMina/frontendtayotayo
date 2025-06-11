<template>
  <div class="container py-4">
    <div class="card p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0">분실물 상세 정보</h5>
        <div>
          <button class="btn btn-outline-primary me-2" @click="goToEditPage">수정</button>
          <button class="btn btn-outline-secondary" @click="goBack">목록으로</button>
        </div>
      </div>

      <div v-if="item">
        <div class="mb-3">
          <label class="form-label fw-bold">분실물</label>
          <input class="form-control" :value="item.title || '-'" readonly />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">분실일</label>
          <input class="form-control" :value="formatDate(item.lostTime)" readonly />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">버스 회사</label>
          <input class="form-control" :value="item.busCompany || '-'" readonly />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">노선번호</label>
          <input class="form-control" :value="item.busNumber || '-'" readonly />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">내용</label>
          <textarea class="form-control" :value="item.content || '-'" readonly rows="4"></textarea>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <div class="spinner-border text-primary" role="status" v-if="loading">
          <span class="visually-hidden">로딩중...</span>
        </div>
        <div v-else class="text-muted">정보를 찾을 수 없습니다.</div>
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
const loading = ref(true);

const goBack = () => {
  router.push('/mypage/lost');
};

const goToEditPage = () => {
  router.push(`/mypage/lost/edit/${route.params.id}`);
};

const fetchItem = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get(`/api/lost/${route.params.id}`);
    item.value = data;
  } catch (error) {
    console.error('분실물 상세 정보 조회 실패:', error);
  } finally {
    loading.value = false;
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