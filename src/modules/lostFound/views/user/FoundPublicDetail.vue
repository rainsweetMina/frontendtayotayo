<template>
  <div class="p-3">
    <h5 class="text-center mb-4">📦 습득물 상세 정보</h5>
    <div class="row">
      <!-- 이미지 -->
      <div class="col-md-4 text-center mb-3">
        <img :src="item.photoUrl" alt="등록된 이미지" class="img-fluid rounded shadow-sm" style="max-height: 220px;" />
      </div>

      <!-- 상세 정보 -->
      <div class="col-md-8">
        <table class="table table-bordered">
          <tbody>
          <tr>
            <th>물품명</th>
            <td>{{ item.itemName }}</td>
          </tr>
          <tr>
            <th>버스 회사</th>
            <td>{{ item.busCompany }}</td>
          </tr>
          <tr>
            <th>노선 번호</th>
            <td>{{ item.busNumber }}</td>
          </tr>
          <tr>
            <th>습득 위치</th>
            <td>{{ item.foundPlace }}</td>
          </tr>
          <tr>
            <th>습득일</th>
            <td>{{ formatDate(item.foundTime) }}</td>
          </tr>
          <tr>
            <th>연락처</th>
            <td>{{ item.handlerContact }}</td>
          </tr>
          <tr>
            <th>이메일</th>
            <td>{{ item.handlerEmail }}</td>
          </tr>
          <tr>
            <th>처리 상태</th>
            <td>{{ getStatusLabel(item.status) }}</td>
          </tr>
          <tr>
            <th>보관 장소</th>
            <td>{{ item.storageLocation }}</td>
          </tr>
          <tr>
            <th>내용</th>
            <td>{{ item.content }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  item: Object
});

// 날짜 포맷
const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '-';
};

// 상태 출력
const getStatusLabel = (status) => {
  switch (status) {
    case 'STORED': return '보관중';
    case 'RETURNED': return '수령완료';
    default: return status;
  }
};
</script>

<style scoped>
th {
  width: 30%;
  background-color: #f8f9fa;
}
td {
  white-space: pre-wrap;
}
</style>
