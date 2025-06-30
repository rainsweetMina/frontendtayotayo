<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="분실물 상세" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <div v-if="!item || Object.keys(item).length === 0" class="flex justify-center items-center py-20 text-gray-400 text-base">
          <div v-if="loading" class="flex justify-center">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
          <p v-else>정보를 찾을 수 없습니다.</p>
        </div>
        <div v-else>
          <div class="border-b border-gray-200 pb-4 mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ item.title }}</h2>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                {{ item.memberName || '-' }}
              </span>
              <span>{{ formatDate(item.lostTime) }}</span>
            </div>
          </div>

          <div v-if="item.deleted" class="mb-4 p-3 bg-red-50 text-red-700 rounded font-bold text-center">삭제된 분실물입니다. (내용 확인만 가능)</div>
          <div v-else-if="!item.visible" class="mb-4 p-3 bg-blue-50 text-blue-700 rounded font-bold text-center">숨김 처리된 분실물입니다.</div>

          <!-- 상세 정보 -->
          <div class="py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">ID</span>
                  <span class="text-sm text-gray-900">{{ item.id }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">물품명</span>
                  <span class="text-sm text-gray-900">{{ item.title }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">버스 번호</span>
                  <span class="text-sm text-gray-900">{{ item.busNumber }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">버스 회사</span>
                  <span class="text-sm text-gray-900">{{ item.busCompany }}</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">신고자</span>
                  <span class="text-sm text-gray-900">{{ item.memberName }}</span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">삭제 여부</span>
                  <span :class="item.deleted ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700'">
                    {{ item.deleted ? '삭제됨' : '정상' }}
                  </span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">숨김 여부</span>
                  <span :class="!item.visible ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'">
                    {{ item.visible ? '보임' : '숨김' }}
                  </span>
                </div>
                <div class="flex items-center">
                  <span class="w-24 text-sm font-medium text-gray-500">분실일</span>
                  <span class="text-sm text-gray-900">{{ formatDate(item.lostTime) }}</span>
                </div>
              </div>
            </div>

            <!-- 내용 -->
            <div class="mt-6">
              <h3 class="text-sm font-medium text-gray-500 mb-2">내용</h3>
              <div class="prose max-w-none">
                <div class="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">{{ item.content }}</div>
              </div>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="pt-4 mt-6 border-t border-gray-200 flex justify-end space-x-3">
            <button 
              @click="goList" 
              class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              목록
            </button>
          </div>
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
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLostItemDetailForAdmin } from '@/modules/lostFound/api/lostAdmin'
import AppBreadcrumb from '@/modules/adminpage/dashboard/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'

const route = useRoute()
const router = useRouter()
const item = ref({})
const loading = ref(true)

// 모달 상태 관리
const modalConfig = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  confirmType: 'primary',
  showCancel: false
})

const fetchItem = async () => {
  try {
    loading.value = true
    const { data } = await getLostItemDetailForAdmin(route.params.id)
    item.value = data
  } catch (error) {
    console.error('분실물 상세 정보 조회 실패:', error)
    modalConfig.value = {
      isOpen: true,
      title: '조회 실패',
      message: '분실물 정보를 불러오는 중 오류가 발생했습니다.',
      confirmText: '확인',
      confirmType: 'danger',
      showCancel: false
    }
  } finally {
    loading.value = false
  }
}

const goList = () => {
  router.push('/admin/lost')
}

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toLocaleString('ko-KR') : '-';
}

const closeModal = () => {
  modalConfig.value.isOpen = false
}

const handleModalConfirm = () => {
  closeModal()
}

onMounted(fetchItem)

watchEffect(() => {
  if (item.value && item.value.createdAt) {
    const created = new Date(item.value.createdAt)
    const now = new Date()
    const diff = (now - created) / (1000 * 60 * 60 * 24)
    if (diff > 30) {
      item.value = {}
    }
  }
})
</script>
