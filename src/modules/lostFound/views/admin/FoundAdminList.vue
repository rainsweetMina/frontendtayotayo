<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">등록된 습득물 관리</h1>
      <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="toggleForm"
      >
        {{ showForm ? '닫기' : '습득물 등록' }}
      </button>
    </div>

    <!-- 등록 모달 -->
    <Modal v-if="showForm" @close="toggleForm">
      <FoundItemForm @submitted="onFormSubmitted" @close="toggleForm" />
    </Modal>

    <!-- 상세보기 모달 -->
    <FoundAdminDetail
        v-if="showDetail"
        :item="selectedItem"
        @close="closeDetail"
        @edit="startEdit"
    />

    <!-- 수정 모달 -->
    <Modal v-if="showEdit" @close="closeEdit">
      <FoundAdminEdit :item="selectedItem" @updated="onEditSubmitted" />
    </Modal>

    <!-- 추후: 매칭 모달도 비슷한 방식으로 연결 가능 -->
    <!-- <Modal v-if="showMatch" @close="closeMatch">
      <FoundAdminMatch :item="selectedItem" @matched="onMatched" />
    </Modal> -->

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
            class="hover:bg-gray-50 cursor-pointer"
            @click="viewDetails(item)"
        >
          <td class="px-4 py-3 text-sm text-gray-500">{{ item.id }}</td>
          <td class="px-4 py-3">
            <img v-if="item.photoUrl" :src="item.photoUrl" alt="사진" class="w-12 h-12 object-cover rounded" />
            <span v-else class="text-gray-400 text-sm">-</span>
          </td>
          <td class="px-4 py-3">{{ item.itemName }}</td>
          <td class="px-4 py-3 text-sm text-gray-500">{{ formatDate(item.foundTime) }}</td>
          <td class="px-4 py-3">
              <span :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </span>
          </td>
          <td class="px-4 py-3 text-sm">
            <div class="flex space-x-2" @click.stop>
              <button class="text-blue-600 hover:underline" @click="viewDetails(item)">상세</button>
              <button class="text-green-600 hover:underline" @click="editItem(item)">수정</button>
              <button class="text-yellow-600 hover:underline" @click="matchItem(item)">매칭</button>
              <button class="text-gray-600 hover:underline" @click="hideItem(item)">숨김</button>
              <button class="text-red-600 hover:underline" @click="deleteItem(item)">삭제</button>
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
import FoundItemForm from '@/modules/lostFound/components/FoundItemForm.vue'
import Modal from '@/modules/lostFound/components/Modal.vue'
import FoundAdminDetail from '@/modules/lostFound/views/admin/FoundAdminDetail.vue'
import FoundAdminEdit from '@/modules/lostFound/views/admin/FoundAdminEdit.vue'
// 추후에 매칭도 추가 가능
// import FoundAdminMatch from '@/modules/lostFound/views/admin/FoundAdminMatch.vue'

import { getFoundItemsForAdmin } from '@/modules/lostFound/api/foundAdmin'

const foundItems = ref([])
const showForm = ref(false)
const showDetail = ref(false)
const showEdit = ref(false)
// const showMatch = ref(false)

const selectedItem = ref(null)

const fetchFoundItems = async () => {
  try {
    const { data } = await getFoundItemsForAdmin()
    foundItems.value = data
  } catch (error) {
    console.error('습득물 목록 조회 실패:', error)
  }
}

const toggleForm = () => {
  showForm.value = !showForm.value
}

const onFormSubmitted = () => {
  showForm.value = false
  fetchFoundItems()
}

const viewDetails = (item) => {
  selectedItem.value = item
  showDetail.value = true
}

const closeDetail = () => {
  showDetail.value = false
  selectedItem.value = null
}

const startEdit = () => {
  showDetail.value = false
  showEdit.value = true
}

const editItem = (item) => {
  selectedItem.value = item
  showEdit.value = true
}

const closeEdit = () => {
  showEdit.value = false
  selectedItem.value = null
}

const onEditSubmitted = () => {
  showEdit.value = false
  selectedItem.value = null
  fetchFoundItems()
}

const matchItem = (item) => {
  selectedItem.value = item
  // showMatch.value = true
}

const hideItem = async (item) => {
  // TODO: 숨김 API 연동
}

const deleteItem = async (item) => {
  // TODO: 삭제 API 연동
}

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
