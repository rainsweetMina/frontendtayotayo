<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="분실물 관리" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          관리자용 분실물 목록
        </h2>

        <!-- 성공 메시지(AlertMessage) -->
        <AlertMessage
          v-if="showAlert"
          type="success"
          title="성공"
          :message="alertMessage"
          :dismissible="true"
          :show="showAlert"
          @close="showAlert = false"
        />

        <!-- 검색바 -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchBar
            placeholder="제목, 버스번호, 버스회사, 신고자 검색"
            @search="handleSearch"
            @reset="fetchLostItems"
          />
        </div>

        <!-- 상태 필터 버튼 -->
        <div class="mb-6 flex flex-wrap gap-3">
          <button @click="setStatusFilter('ALL')" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentStatusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            전체 ({{ allCount }})
          </button>
          <button @click="setStatusFilter('NORMAL')" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentStatusFilter === 'NORMAL' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            정상 ({{ normalCount }})
          </button>
          <button @click="setStatusFilter('HIDDEN')" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentStatusFilter === 'HIDDEN' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            숨김 ({{ hiddenCount }})
          </button>
          <button @click="setStatusFilter('DELETED')" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentStatusFilter === 'DELETED' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            삭제됨 ({{ deletedCount }})
          </button>
        </div>

        <!-- 로딩 표시 -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  물품명
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  버스 번호
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  버스 회사
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신고자
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  분실일
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!pagedLostItems || pagedLostItems.length === 0">
                <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">등록된 분실물이 없습니다.</td>
              </tr>
              <tr 
                v-for="item in pagedLostItems" 
                :key="item.id"
                :class="['hover:bg-gray-50', rowClass(item)]"
                @click="goDetail(item.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ item.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <router-link :to="`/admin/lost/${item.id}`" class="hover:underline text-blue-700">
                    {{ item.title }}
                  </router-link>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ item.busNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ item.busCompany }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ item.memberName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <span v-if="item.deleted" class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-red-100 text-red-500">삭제됨</span>
                  <span v-else-if="!item.visible" class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-gray-200 text-gray-500">숨김</span>
                  <span v-else class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-green-100 text-green-700">정상</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {{ formatDate(item.lostTime) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <div class="flex justify-center items-center gap-2" @click.stop>
                    <button 
                      v-if="item.visible && !item.deleted"
                      class="text-yellow-600 hover:text-yellow-900 mr-2"
                      @click="hideItem(item)"
                    >
                      숨김
                    </button>
                    <button 
                      v-else
                      class="text-gray-400 cursor-not-allowed mr-2"
                      disabled
                      :title="item.deleted ? '삭제된 항목은 숨김 처리할 수 없습니다' : '이미 숨김 처리된 항목입니다'"
                    >
                      숨김
                    </button>
                    <button 
                      v-if="!item.deleted"
                      class="text-red-600 hover:text-red-900"
                      @click="deleteItem(item)"
                    >
                      삭제
                    </button>
                    <button 
                      v-else
                      class="text-gray-400 cursor-not-allowed"
                      disabled
                      title="이미 삭제된 항목입니다"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지네이션 -->
        <div class="flex justify-center mt-4">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :disabled="page === 1"
              :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
              @click="() => { if (page > 1) page--; if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'smooth'}) }"
            >
              이전
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50',
                page === p ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : ''
              ]"
              @click="() => { page = p; if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'smooth'}) }"
            >
              {{ p }}
            </button>
            <button
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :disabled="page === totalPages"
              :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
              @click="() => { if (page < totalPages) page++; if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'smooth'}) }"
            >
              다음
            </button>
          </nav>
        </div>
      </div>
    </div>

    <CommonModal
      :is-open="modalConfig.isOpen"
      :title="modalConfig.title"
      :message="modalConfig.message"
      :confirm-text="modalConfig.confirmText"
      :confirm-type="modalConfig.confirmType"
      :show-cancel="modalConfig.showCancel"
      @close="closeModal"
      @confirm="handleModalConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getLostItemsForAdmin, hideLostItem, deleteLostItem } from '@/modules/lostFound/api/lostAdmin'
import SearchBar from "@/modules/lostFound/components/SearchBar.vue"
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'
import AlertMessage from '@/modules/adminpage/dashboard/components/AlertMessage.vue'

const lostItems = ref([])
const loading = ref(false)
const router = useRouter()
const page = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.max(1, Math.ceil(filteredLostItems.value.length / pageSize)))
const currentStatusFilter = ref('ALL')
const filteredLostItems = ref([])

const pagedLostItems = computed(() =>
  filteredLostItems.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

// 모달 상태 관리
const modalConfig = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  confirmType: 'primary',
  showCancel: false
})

const showAlert = ref(false)
const alertMessage = ref('')

const fetchLostItems = async () => {
  try {
    loading.value = true
    const { data } = await getLostItemsForAdmin()
    lostItems.value = data
    filterLostItems();
  } catch (error) {
    console.error('분실물 목록 조회 실패:', error)
    showAlert.value = true
    alertMessage.value = '분실물 목록을 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

// ✅ 검색 함수 (검색어 없으면 전체목록)
const handleSearch = async (keyword) => {
  if (!keyword) {
    fetchLostItems();
    return;
  }
  try {
    // 검색 API (params로 넘기기)
    const res = await getLostItemsForAdmin({ keyword });
    lostItems.value = Array.isArray(res) ? res : res.data;
  } catch (error) {
    showAlert.value = true
    alertMessage.value = '검색 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message)
  }
}

const goDetail = (id) => {
  router.push(`/admin/lost/${id}`)
}

const hideItem = async (item) => {
  modalConfig.value = {
    isOpen: true,
    title: '숨김 확인',
    message: '숨김 처리하시겠습니까?',
    confirmText: '숨김',
    confirmType: 'danger',
    showCancel: true
  }
  // 임시로 item을 저장
  window.tempItem = item
}

const deleteItem = async (item) => {
  modalConfig.value = {
    isOpen: true,
    title: '삭제 확인',
    message: '정말로 삭제하시겠습니까?',
    confirmText: '삭제',
    confirmType: 'danger',
    showCancel: true
  }
  // 임시로 item을 저장
  window.tempItem = item
}

// 모달 확인 처리
const handleModalConfirm = async () => {
  const item = window.tempItem
  if (!item) {
    closeModal()
    return
  }

  try {
    if (modalConfig.value.title === '숨김 확인') {
      await hideLostItem(item.id)
      await fetchLostItems()
      alertMessage.value = '분실물이 숨김 처리되었습니다.'
      showAlert.value = true
    } else if (modalConfig.value.title === '삭제 확인') {
      await deleteLostItem(item.id)
      await fetchLostItems()
      alertMessage.value = '분실물이 삭제되었습니다.'
      showAlert.value = true
    }
  } catch (error) {
    showAlert.value = false
    showAlert.value = true
    alertMessage.value = '처리 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message)
  }
  
  // 임시 저장된 item 제거
  window.tempItem = null
  closeModal()
}

watch(showAlert, (val) => {
  if (val) {
    setTimeout(() => { showAlert.value = false }, 2000)
  }
})

// 모달 닫기
const closeModal = () => {
  modalConfig.value.isOpen = false
}

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toLocaleString('ko-KR') : '-';
}

const rowClass = (item) => {
  if (item.deleted) return 'bg-red-50 text-red-700';
  if (!item.visible) return 'bg-gray-50 text-gray-500';
  return '';
}

function filterLostItems() {
  let filtered = lostItems.value;
  switch (currentStatusFilter.value) {
    case 'NORMAL':
      filtered = filtered.filter(item => (item.visible !== false && !item.deleted));
      break;
    case 'HIDDEN':
      filtered = filtered.filter(item => (item.visible === false && !item.deleted));
      break;
    case 'DELETED':
      filtered = filtered.filter(item => item.deleted);
      break;
    case 'ALL':
    default:
      // 전체는 필터링하지 않음
      break;
  }
  // 날짜 필터 (30일 이내)
  filtered = filtered.filter(item => {
    if (!item.createdAt) return true;
    const created = new Date(item.createdAt);
    const now = new Date();
    const diff = (now - created) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });
  filteredLostItems.value = filtered;
  page.value = 1;
}

function setStatusFilter(status) {
  currentStatusFilter.value = status;
  filterLostItems();
}

const allCount = computed(() => lostItems.value.filter(item => {
  if (!item.createdAt) return true;
  const created = new Date(item.createdAt);
  const now = new Date();
  const diff = (now - created) / (1000 * 60 * 60 * 24);
  return diff <= 30;
}).length)
const normalCount = computed(() => lostItems.value.filter(item => (item.visible !== false && !item.deleted && (() => {
  if (!item.createdAt) return true;
  const created = new Date(item.createdAt);
  const now = new Date();
  const diff = (now - created) / (1000 * 60 * 60 * 24);
  return diff <= 30;
})())).length)
const hiddenCount = computed(() => lostItems.value.filter(item => (item.visible === false && !item.deleted && (() => {
  if (!item.createdAt) return true;
  const created = new Date(item.createdAt);
  const now = new Date();
  const diff = (now - created) / (1000 * 60 * 60 * 24);
  return diff <= 30;
})())).length)
const deletedCount = computed(() => lostItems.value.filter(item => item.deleted && (() => {
  if (!item.createdAt) return true;
  const created = new Date(item.createdAt);
  const now = new Date();
  const diff = (now - created) / (1000 * 60 * 60 * 24);
  return diff <= 30;
})()).length)

onMounted(fetchLostItems)
</script>

