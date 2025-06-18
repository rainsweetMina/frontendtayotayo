<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">등록된 습득물 관리</h1>
      <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="goToCreatePage"
      >
        습득물 등록
      </button>
    </div>
    <SearchBar
        placeholder="물품명, 버스회사, 노선번호 검색"
        @search="handleSearch"
        @reset="fetchFoundItems"
    />

    <!-- ✅ 목록 테이블 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사진</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">물품명</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">습득일</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr
            v-for="item in foundItems"
            :key="item.id"
            :class="rowClass(item)"
            @click="goToDetailPage(item.id)"
        >
          <td class="px-4 py-3 text-sm text-gray-500">{{ item.id }}</td>
          <td class="px-4 py-3">
            <img v-if="item.photoUrl" :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`" alt="사진" class="w-12 h-12 object-cover rounded" />
            <span v-else class="text-gray-400 text-sm">-</span>
          </td>
          <td class="px-4 py-3">{{ item.itemName }}</td>
          <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(item.foundTime) }}</td>
          <td class="px-4 py-3">
            <span :class="getStatusClass(item.status)">
              {{ getStatusText(item.status) }}
            </span>
            <!-- 상태 표시 -->
            <span v-if="item.isDeleted || item.deleted" class="ml-2 text-xs text-red-600">(삭제됨)</span>
            <span v-else-if="item.visible === false" class="ml-2 text-xs text-gray-500">(숨김됨)</span>
          </td>
          <td class="px-4 py-3 text-sm">
            <div class="flex space-x-2" @click.stop>
              <!-- 수정은 항상 활성화 -->
              <button
                  class="text-green-600 hover:underline"
                  @click="goToEditPage(item.id)"
              >수정</button>
              <!-- 숨김/삭제는 비활성처리(스타일/속성 모두) -->
              <button
                  class="text-gray-600 hover:underline"
                  @click="hideItem(item)"
                  :disabled="!item.visible || item.isDeleted || item.deleted"
                  :class="inactiveBtnClass(item)"
              >숨김</button>
              <button
                  class="text-red-600 hover:underline"
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
  if (item.visible === false)    return "bg-gray-100 opacity-80";            // 숨김 → 회색
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
