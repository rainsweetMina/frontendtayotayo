<template>
  <div class="w-full px-0 py-8">
    <div class="flex justify-between items-center mb-8 px-8">
      <h2 class="text-3xl font-extrabold">등록된 습득물 목록</h2>
      <button
        class="px-6 py-2 bg-blue-600 text-white text-lg rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        @click="goToCreatePage"
      >습득물 등록</button>
    </div>
    <div class="px-8 mb-6">
      <SearchBar
        placeholder="물품명, 버스회사, 노선번호 검색"
        @search="handleSearch"
        @reset="fetchFoundItems"
      />
    </div>
    <div class="bg-white shadow-lg rounded-xl overflow-x-auto w-full">
      <table class="w-full text-base">
        <thead>
        <tr class="bg-gray-100">
          <th class="py-3 px-4 font-bold text-gray-700 text-center">ID</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">사진</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-left">물품명</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">습득일</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">상태</th>
          <th class="py-3 px-4 font-bold text-gray-700 text-center">액션</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="item in foundItems"
          :key="item.id"
          :class="['border-b hover:bg-blue-50 transition cursor-pointer', rowClass(item)]"
          @click="goToDetailPage(item.id)"
        >
          <td class="py-3 px-4 text-center font-mono">{{ item.id }}</td>
          <td class="py-2 px-4 flex justify-center items-center">
            <img v-if="item.photoUrl" :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`" alt="사진" class="w-32 h-20 object-cover rounded shadow" />
            <span v-else class="text-gray-400">-</span>
          </td>
          <td class="py-2 px-4 font-semibold truncate">{{ item.itemName }}</td>
          <td class="py-2 px-4 text-center">{{ formatDate(item.foundTime) }}</td>
          <td class="py-2 px-4 text-center">
            <span :class="getStatusClass(item.status)">
              {{ getStatusText(item.status) }}
            </span>
            <span v-if="item.isDeleted || item.deleted" class="ml-2 text-xs text-red-600">(삭제됨)</span>
            <span v-else-if="item.visible === false" class="ml-2 text-xs text-gray-500">(숨김됨)</span>
          </td>
          <td class="py-2 px-4">
            <div class="flex justify-center items-center gap-2" @click.stop>
              <button
                class="px-4 py-1 rounded bg-green-50 text-green-700 font-semibold border border-green-200 hover:bg-green-100 transition"
                @click="goToEditPage(item.id)"
              >수정</button>
              <button
                class="px-4 py-1 rounded bg-gray-50 text-gray-700 font-semibold border border-gray-200 hover:bg-gray-100 transition"
                @click="hideItem(item)"
                :disabled="!item.visible || item.isDeleted || item.deleted"
                :class="inactiveBtnClass(item)"
              >숨김</button>
              <button
                class="px-4 py-1 rounded bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition"
                @click="deleteItem(item)"
                :disabled="item.isDeleted || item.deleted"
                :class="inactiveBtnClass(item)"
              >삭제</button>
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
import { getFoundItemsForAdmin, hideFoundItem, deleteFoundItem } from '@/modules/lostFound/api/foundAdmin'
import SearchBar from "@/modules/lostFound/components/SearchBar.vue";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const router = useRouter()
const foundItems = ref([])

const handleSearch = async (keyword) => {
  try {
    const { data } = await getFoundItemsForAdmin({ keyword });
    foundItems.value = data;
  } catch (error) {
    alert('검색 실패: ' + (error.response?.data?.message || error.message));
  }
}

const fetchFoundItems = async () => {
  try {
    const { data } = await getFoundItemsForAdmin()
    foundItems.value = data
  } catch (error) {
    console.error('습득물 목록 조회 실패:', error)
  }
}

const goToCreatePage = () => {
  router.push('/admin/found/create')
}

const goToDetailPage = (id) => {
  router.push(`/admin/found/${id}`)
}

const goToEditPage = (id) => {
  router.push(`/admin/found/edit/${id}`)
}

// ✅ 숨김 기능
const hideItem = async (item) => {
  if (!confirm('정말로 숨기겠습니까?')) return;
  try {
    await hideFoundItem(item.id);
    alert('숨김 처리되었습니다.');
    fetchFoundItems();
  } catch (e) {
    alert('숨김 처리 실패: ' + (e.response?.data?.message || e.message));
  }
}

// ✅ 삭제 기능
const deleteItem = async (item) => {
  if (!confirm('정말로 삭제하시겠습니까?')) return;
  try {
    await deleteFoundItem(item.id);
    alert('삭제되었습니다.');
    fetchFoundItems();
  } catch (e) {
    alert('삭제 실패: ' + (e.response?.data?.message || e.message));
  }
}

// ✅ 행 배경 색상/불투명도 동적 적용
const rowClass = (item) => {
  if (item.isDeleted || item.deleted) return "bg-red-100 opacity-60";        // 삭제 → 빨간색
  if (item.visible === false)    return "bg-blue-100 text-blue-800 opacity-90";        // 숨김 → 연파랑
  return "";
};

// ✅ 버튼 비활성화 스타일
const inactiveBtnClass = (item) => {
  // 삭제된 항목, 숨김된 항목에 대해 비활성
  if (item.isDeleted || item.deleted || item.visible === false) {
    return 'opacity-50 cursor-not-allowed pointer-events-none';
  }
  return '';
};

const getStatusText = (status) => {
  const map = {
    IN_STORAGE: '보관중',
    RETURNED: '수령완료'
  }
  return map[status] || status
}

const getStatusClass = (status) => {
  const map = {
    IN_STORAGE: 'bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full',
    RETURNED: 'bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full'
  }
  return map[status] || 'bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded-full'
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

onMounted(() => {
  fetchFoundItems()
})
</script>
