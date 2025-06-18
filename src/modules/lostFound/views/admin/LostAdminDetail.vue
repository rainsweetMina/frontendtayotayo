<template>
  <div class="max-w-2xl mx-auto bg-white shadow p-8 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">분실물 상세 정보</h2>
    <table class="table-auto w-full mb-4">
      <tbody>
      <tr><th>ID</th><td>{{ item.id }}</td></tr>
      <tr><th>물품명</th><td>{{ item.title }}</td></tr>
      <tr><th>버스 번호</th><td>{{ item.busNumber }}</td></tr>
      <tr><th>버스 회사</th><td>{{ item.busCompany }}</td></tr>
      <tr><th>신고자</th><td>{{ item.memberName }}</td></tr>
      <tr><th>삭제 여부</th><td>{{ item.deleted ? '삭제됨' : '정상' }}</td></tr>
      <tr><th>숨김 여부</th><td>{{ item.visible ? '보임' : '숨김' }}</td></tr>
      <tr><th>분실일</th><td>{{ formatDate(item.lostTime) }}</td></tr>
      <tr><th>내용</th><td>{{ item.content }}</td></tr>
      </tbody>
    </table>
    <button class="btn btn-secondary" @click="goList">목록</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLostItemDetailForAdmin } from '@/modules/lostFound/api/lostAdmin'

const route = useRoute()
const router = useRouter()
const item = ref({})

const fetchItem = async () => {
  const { data } = await getLostItemDetailForAdmin(route.params.id)
  item.value = data
}

const goList = () => {
  router.push('/admin/lost')
}

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toLocaleString('ko-KR') : '-';
}

onMounted(fetchItem)
</script>
