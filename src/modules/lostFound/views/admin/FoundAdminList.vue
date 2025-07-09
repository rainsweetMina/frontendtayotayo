<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="습득물 관리" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          등록된 습득물 목록
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

        <!-- 검색바와 등록 버튼 -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchBar
              placeholder="물품명, 버스회사, 노선번호 검색"
              @search="handleSearch"
              @reset="fetchFoundItems"
          />
          <button
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="goToCreatePage"
              :disabled="authStore.role !== 'BUS'"
              :title="authStore.role !== 'BUS' ? 'ADMIN은 등록할 수 없습니다' : ''"
          >
            습득물 등록
          </button>
        </div>

        <!-- 상태 필터 버튼 -->
        <div class="mb-6 flex flex-wrap gap-3">
          <button @click="setStatusFilter('ALL')" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentStatusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            전체 ({{ allCount }})
          </button>
          <button @click="setStatusFilter('IN_STORAGE')" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentStatusFilter === 'IN_STORAGE' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            보관중 ({{ inStorageCount }})
          </button>
          <button @click="setStatusFilter('RETURNED')" :class="['px-4 py-2 rounded-lg text-sm font-medium transition-colors', currentStatusFilter === 'RETURNED' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']">
            수령완료 ({{ returnedCount }})
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
                사진
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                물품명
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                습득일
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="!pagedFoundItems || pagedFoundItems.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">등록된 습득물이 없습니다.</td>
            </tr>
            <tr
                v-for="item in pagedFoundItems"
                :key="item.id"
                :class="['hover:bg-gray-50', rowClass(item)]"
                @click="goToDetailPage(item.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {{ item.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <img
                    v-if="item.photoUrl"
                    :src="`${IMAGE_BASE_URL}/found/${item.photoUrl}`"
                    alt="사진"
                    class="w-28 h-20 object-cover rounded"
                />
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <router-link :to="`/admin/found/${item.id}`" class="hover:underline text-blue-700">
                  {{ item.itemName }}
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                {{ formatDate(item.foundTime) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                <span v-if="item.isDeleted || item.deleted" class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-red-100 text-red-500">삭제됨</span>
                <span v-else-if="item.visible === false" class="inline-block rounded-full px-3 py-1 text-sm font-bold bg-gray-200 text-gray-500">숨김</span>
                <span v-else :class="getStatusBadgeClass(item)">{{ getStatusText(item.status) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                <div class="flex justify-center items-center gap-2" @click.stop>
                  <router-link
                      v-if="!item.isDeleted && !item.deleted && authStore.role === 'BUS'"
                      :to="`/admin/found/edit/${item.id}`"
                      class="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    수정
                  </router-link>
                  <button
                      v-else-if="!item.isDeleted && !item.deleted && authStore.role === 'ADMIN'"
                      class="text-gray-400 cursor-not-allowed mr-2"
                      disabled
                      title="ADMIN은 수정할 수 없습니다"
                  >
                    수정
                  </button>
                  <button
                      v-else
                      class="text-gray-400 cursor-not-allowed mr-2"
                      disabled
                      title="삭제된 항목은 수정할 수 없습니다"
                  >
                    수정
                  </button>
                  <button
                      v-if="item.visible && !item.isDeleted && !item.deleted"
                      class="text-yellow-600 hover:text-yellow-900 mr-2"
                      @click="hideItem(item)"
                  >
                    숨김
                  </button>
                  <button
                      v-else
                      class="text-gray-400 cursor-not-allowed mr-2"
                      disabled
                      :title="item.isDeleted || item.deleted ? '삭제된 항목은 숨김 처리할 수 없습니다' : '이미 숨김 처리된 항목입니다'"
                  >
                    숨김
                  </button>
                  <button
                      v-if="!item.isDeleted && !item.deleted"
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
import { getFoundItemsForAdmin, hideFoundItem, deleteFoundItem } from '@/modules/lostFound/api/foundAdmin'
import SearchBar from "@/modules/lostFound/components/SearchBar.vue"
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'
import { useAuthStore } from '@/stores/auth'
import AlertMessage from '@/modules/adminpage/dashboard/components/AlertMessage.vue'

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const router = useRouter()
const foundItems = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = 10
const currentStatusFilter = ref('ALL');
const searchKeyword = ref('');
const filteredFoundItems = ref([]);

const authStore = useAuthStore()

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

function filterFoundItems() {
  let filtered = foundItems.value;

  switch (currentStatusFilter.value) {
    case 'IN_STORAGE':
      filtered = filtered.filter(item => item.status === 'IN_STORAGE');
      break;
    case 'RETURNED':
      filtered = filtered.filter(item => item.status === 'RETURNED');
      break;
    case 'DELETED':
      filtered = filtered.filter(item => item.deleted || item.isDeleted);
      break;
    case 'HIDDEN':
      filtered = filtered.filter(item => item.visible === false || item.isHidden === true);
      break;
    case 'ALL':
    default:
      // 전체는 필터링하지 않음
      break;
  }

  // 날짜 필터
  filtered = filtered.filter(item => {
    if (!item.createdAt) return true;
    const created = new Date(item.createdAt);
    const now = new Date();
    const diff = (now - created) / (1000 * 60 * 60 * 24);
    return diff <= 30;
  });

  // 검색어 필터 (옵션)
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(item =>
        (item.itemName && item.itemName.toLowerCase().includes(keyword)) ||
        (item.busCompany && item.busCompany.toLowerCase().includes(keyword)) ||
        (item.busNumber && item.busNumber.toLowerCase().includes(keyword))
    );
  }

  filteredFoundItems.value = filtered;
  page.value = 1;
}

function setStatusFilter(status) {
  currentStatusFilter.value = status;
  filterFoundItems();
}

const handleSearch = (keyword) => {
  searchKeyword.value = keyword;
  filterFoundItems();
}

const fetchFoundItems = async () => {
  try {
    loading.value = true
    const { data } = await getFoundItemsForAdmin()
    console.log('관리자 습득물 목록 API 응답:', data)

    // 데이터가 배열인지 확인하고 안전하게 처리
    const dataArray = Array.isArray(data) ? data : []
    foundItems.value = dataArray.sort((a, b) => b.id - a.id)
    filterFoundItems();
  } catch (error) {
    console.error('습득물 목록 조회 실패:', error)
    console.error('에러 상세 정보:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    alertMessage.value = '습득물 목록을 불러오는 중 오류가 발생했습니다.'
    showAlert.value = true
  } finally {
    loading.value = false
  }
}

const goToCreatePage = () => {
  router.push('/admin/found/create')
}

const goToDetailPage = (id) => {
  router.push(`/admin/found/${id}`)
}

// ✅ 숨김 기능
const hideItem = async (item) => {
  modalConfig.value = {
    isOpen: true,
    title: '숨김 확인',
    message: '정말로 숨기겠습니까?',
    confirmText: '숨김',
    confirmType: 'danger',
    showCancel: true
  }
  // 임시로 item을 저장
  window.tempItem = item
}

// ✅ 삭제 기능
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
      await hideFoundItem(item.id)
      await fetchFoundItems()
      alertMessage.value = '습득물이 숨김 처리되었습니다.'
      showAlert.value = true
    } else if (modalConfig.value.title === '삭제 확인') {
      await deleteFoundItem(item.id)
      await fetchFoundItems()
      alertMessage.value = '습득물이 삭제되었습니다.'
      showAlert.value = true
    }
  } catch (e) {
    showAlert.value = false
    alertMessage.value = '처리 중 오류가 발생했습니다: ' + (e.response?.data?.message || e.message)
    showAlert.value = true
  }

  // 임시 저장된 item 제거
  window.tempItem = null
  closeModal()
}

watch(showAlert, (val) => {
  if (val) {
    setTimeout(() => {
      showAlert.value = false
    }, 2000)
  }
})

// 알림 메시지 닫기
const closeModal = () => {
  modalConfig.value.isOpen = false
}

// ✅ 행 배경 색상/불투명도 동적 적용
const rowClass = (item) => {
  if (item.isDeleted || item.deleted) return "bg-red-50 text-red-700";
  if (item.visible === false) return "bg-gray-50 text-gray-500";
  return "";
};

const getStatusText = (status) => {
  const map = {
    IN_STORAGE: '보관중',
    RETURNED: '수령완료'
  }
  return map[status] || status
}

const getStatusBadgeClass = (item) => {
  if (item.status === 'IN_STORAGE') return 'inline-block rounded-full px-3 py-1 text-sm font-bold bg-blue-100 text-blue-700'
  if (item.status === 'RETURNED') return 'inline-block rounded-full px-3 py-1 text-sm font-bold bg-green-100 text-green-700'
  return 'inline-block rounded-full px-3 py-1 text-sm font-bold bg-gray-100 text-gray-400'
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

const totalPages = computed(() => Math.ceil(filteredFoundItems.value.length / pageSize));
const pagedFoundItems = computed(() =>
    filteredFoundItems.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

const allCount = computed(() => foundItems.value.filter(item => {
  if (!item.createdAt) return true;
  const created = new Date(item.createdAt);
  const now = new Date();
  const diff = (now - created) / (1000 * 60 * 60 * 24);
  return diff <= 30;
}).length)
const inStorageCount = computed(() => foundItems.value.filter(item => item.status === 'IN_STORAGE' && !item.deleted && !item.isDeleted && (() => {
  if (!item.createdAt) return true;
  const created = new Date(item.createdAt);
  const now = new Date();
  const diff = (now - created) / (1000 * 60 * 60 * 24);
  return diff <= 30;
})()).length)
const returnedCount = computed(() => foundItems.value.filter(item => item.status === 'RETURNED' && !item.deleted && !item.isDeleted && (() => {
  if (!item.createdAt) return true;
  const created = new Date(item.createdAt);
  const now = new Date();
  const diff = (now - created) / (1000 * 60 * 60 * 24);
  return diff <= 30;
})()).length)
const hiddenCount = computed(() => foundItems.value.filter(item => (item.visible === false && !item.deleted && (() => {
  if (!item.createdAt) return true;
  const created = new Date(item.createdAt);
  const now = new Date();
  const diff = (now - created) / (1000 * 60 * 60 * 24);
  return diff <= 30;
})())).length)
const deletedCount = computed(() => foundItems.value.filter(item => (item.deleted || item.isDeleted) && (() => {
  if (!item.createdAt) return true;
  const created = new Date(item.createdAt);
  const now = new Date();
  const diff = (now - created) / (1000 * 60 * 60 * 24);
  return diff <= 30;
})()).length)

onMounted(() => {
  fetchFoundItems()
})
</script>
