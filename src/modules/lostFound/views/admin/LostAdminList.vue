<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">관리자용 분실물 목록</h2>
    <!-- ✅ 검색창 -->
    <SearchBar
        placeholder="제목, 버스번호, 버스회사, 신고자 검색"
        @search="handleSearch"
        @reset="fetchLostItems"
    />

    <div class="bg-white shadow rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
        <tr>
          <th>ID</th>
          <th>물품명</th>
          <th>버스 번호</th>
          <th>버스 회사</th>
          <th>신고자</th>
          <th>삭제 여부</th>
          <th>숨김 여부</th>
          <th>분실일</th>
          <th>액션</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in lostItems" :key="item.id"
            :class="rowClass(item)"
            @click="goDetail(item.id)">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.busNumber }}</td>
          <td>{{ item.busCompany }}</td>
          <td>{{ item.memberName }}</td>
          <td>
            <span v-if="item.deleted" class="text-red-500">삭제됨</span>
            <span v-else>정상</span>
          </td>
          <td>
            <span v-if="!item.visible" class="text-gray-500">숨김</span>
            <span v-else>보임</span>
          </td>
          <td>{{ formatDate(item.lostTime) }}</td>
          <td>
            <button class="btn btn-warning mr-2" @click.stop="hideItem(item)" :disabled="item.deleted || !item.visible">숨김</button>
            <button class="btn btn-danger" @click.stop="deleteItem(item)" :disabled="item.deleted">삭제</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLostItemsForAdmin, hideLostItem, deleteLostItem } from '@/modules/lostFound/api/lostAdmin'
import SearchBar from "@/modules/lostFound/components/SearchBar.vue";

const lostItems = ref([])
const router = useRouter()

const fetchLostItems = async () => {
  const { data } = await getLostItemsForAdmin()
  console.log(data); // <-- 실제 key 이름이 뭔지 찍어보기!
  lostItems.value = data
}

// ✅ 검색 함수 (검색어 없으면 전체목록)
const handleSearch = async (keyword) => {
  if (!keyword) {
    fetchLostItems();
    return;
  }
  // 검색 API (params로 넘기기)
  const res = await getLostItemsForAdmin({ keyword });
  lostItems.value = Array.isArray(res) ? res : res.data;
}

const goDetail = (id) => {
  router.push(`/admin/lost/${id}`)
}

const hideItem = async (item) => {
  if (!confirm('숨김 처리하시겠습니까?')) return;
  await hideLostItem(item.id);
  fetchLostItems();
}

const deleteItem = async (item) => {
  if (!confirm('정말로 삭제하시겠습니까?')) return;
  await deleteLostItem(item.id);
  fetchLostItems();
}

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toLocaleString('ko-KR') : '-';
}

const rowClass = (item) => {
  if (item.deleted) return 'bg-red-100 opacity-60';
  if (!item.visible) return 'bg-gray-100 opacity-80';
  return '';
}

onMounted(fetchLostItems)
</script>
