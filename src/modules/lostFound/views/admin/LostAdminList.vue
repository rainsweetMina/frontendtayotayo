<template>
  <div class="w-full px-0 py-8">
    <div class="flex justify-between items-center mb-8 px-8">
      <h2 class="text-3xl font-extrabold">관리자용 분실물 목록</h2>
    </div>
    <div class="px-8 mb-6">
      <SearchBar
        placeholder="제목, 버스번호, 버스회사, 신고자 검색"
        @search="handleSearch"
        @reset="fetchLostItems"
      />
    </div>
    <div class="bg-white shadow-lg rounded-xl overflow-x-auto w-full">
      <table class="w-full text-base">
        <thead>
        <tr class="bg-gray-100">
          <th class="py-3 px-4 font-bold text-gray-700 text-center">ID</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-left">물품명</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">버스 번호</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">버스 회사</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">신고자</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">삭제 여부</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">숨김 여부</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">분실일</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">액션</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in lostItems" :key="item.id"
            :class="['border-b hover:bg-blue-50 transition cursor-pointer', rowClass(item)]"
            @click="goDetail(item.id)">
          <td class="py-3 px-4 text-center font-mono">{{ item.id }}</td>
          <td class="py-2 px-4 font-semibold truncate">{{ item.title }}</td>
          <td class="py-2 px-4 text-center">{{ item.busNumber }}</td>
          <td class="py-2 px-4 text-center">{{ item.busCompany }}</td>
          <td class="py-2 px-4 text-center">{{ item.memberName }}</td>
          <td class="py-2 px-4 text-center">
            <span v-if="item.deleted" class="bg-red-100 text-red-700 px-2 py-1 text-xs font-medium rounded-full">삭제됨</span>
            <span v-else class="bg-green-100 text-green-700 px-2 py-1 text-xs font-medium rounded-full">정상</span>
          </td>
          <td class="py-2 px-4 text-center">
            <span v-if="!item.visible" class="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">숨김</span>
            <span v-else class="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded-full">보임</span>
          </td>
          <td class="py-2 px-4 text-center">{{ formatDate(item.lostTime) }}</td>
          <td class="py-2 px-4">
            <div class="flex justify-center items-center gap-2" @click.stop>
              <button class="px-4 py-1 rounded bg-gray-50 text-gray-700 font-semibold border border-gray-200 hover:bg-gray-100 transition" @click="hideItem(item)" :disabled="item.deleted || !item.visible">숨김</button>
              <button class="px-4 py-1 rounded bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition" @click="deleteItem(item)" :disabled="item.deleted">삭제</button>
            </div>
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
  if (!item.visible) return 'bg-blue-100 text-blue-800 opacity-90';
  return '';
}

onMounted(fetchLostItems)
</script>
