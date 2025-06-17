<template>
  <div class="container py-4">
    <div class="card p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">📦 습득물 상세 정보</h5>
        <button class="btn btn-outline-secondary btn-sm" @click="goBack">
          <i class="bi bi-arrow-left me-1"></i> 목록으로
        </button>
      </div>
      
      <div class="row">
        <!-- 이미지 -->
        <div class="col-md-4 text-center mb-3">
          <img 
            v-if="item?.photoUrl" 
            :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`" 
            alt="등록된 이미지" 
            class="img-fluid rounded shadow-sm" 
            style="max-height: 220px;" 
          />
          <div v-else class="bg-light rounded d-flex align-items-center justify-content-center" style="height: 220px;">
            <span class="text-muted">이미지 없음</span>
          </div>
        </div>

        <!-- 상세 정보 -->
        <div class="col-md-8">
          <table class="table table-bordered">
            <tbody>
            <tr>
              <th>물품명</th>
              <td>{{ item?.itemName || '-' }}</td>
            </tr>
            <tr>
              <th>버스 회사</th>
              <td>{{ item?.busCompany || '-' }}</td>
            </tr>
            <tr>
              <th>노선 번호</th>
              <td>{{ item?.busNumber || '-' }}</td>
            </tr>
            <tr>
              <th>습득 위치</th>
              <td>{{ item?.foundPlace || '-' }}</td>
            </tr>
            <tr>
              <th>습득일</th>
              <td>{{ formatDate(item?.foundTime) }}</td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>{{ item?.handlerContact || '-' }}</td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>{{ item?.handlerEmail || '-' }}</td>
            </tr>
            <tr>
              <th>처리 상태</th>
              <td>{{ getStatusLabel(item?.status) }}</td>
            </tr>
            <tr>
              <th>보관 장소</th>
              <td>{{ item?.storageLocation || '-' }}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{{ item?.content || '-' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
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
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '';

const goBack = () => {
  router.push('/found');
};

const fetchItem = async () => {
  try {
    const { data } = await axios.get(`/api/found/${route.params.id}`);
    item.value = data;
  } catch (error) {
    console.error('습득물 상세 정보 조회 실패:', error);
  }
};

// 날짜 포맷
const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '-';
};

// 상태 출력
const getStatusLabel = (status) => {
  switch (status) {
    case 'IN_STORAGE': return '보관중';
    case 'RETURNED': return '수령완료';
    default: return status || '-';
  }
};


onMounted(() => {
  fetchItem();
});
</script>

<style scoped>
.container {
  max-width: 900px;
}

th {
  width: 30%;
  background-color: #f8f9fa;
}

td {
  white-space: pre-wrap;
}
</style>
