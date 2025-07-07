<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="광고 관리" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          등록된 광고 목록
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
        
        <!-- 검색/엑셀/등록 버튼 -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2 items-center">
            <SearchBar
              placeholder="제목, 광고회사, 상태 검색"
              @search="handleSearch"
              @reset="resetSearch"
            />
          </div>
          <div class="flex space-x-2 items-center">
            <button
              @click="downloadAds"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              엑셀 다운로드
            </button>
            <router-link
                to="/admin/ad/create"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >광고 등록</router-link>
          </div>
        </div>

        <!-- 필터 버튼들 -->
        <div class="mb-6 flex flex-wrap gap-3">
          <button 
            @click="setFilter('all')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            전체 ({{ adList.length }})
          </button>
          <button 
            @click="setFilter('scheduled')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === 'scheduled' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            예정 ({{ scheduledCount }})
          </button>
          <button 
            @click="setFilter('ongoing')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === 'ongoing' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            진행중 ({{ ongoingCount }})
          </button>
          <button 
            @click="setFilter('ending_soon')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === 'ending_soon' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            종료임박 ({{ endingSoonCount }})
          </button>
          <button 
            @click="setFilter('ended')"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === 'ended' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            종료됨 ({{ endedCount }})
          </button>
        </div>

        <!-- 테이블 -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">광고회사</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">연장횟수</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">시작일</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">종료일</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredAdList.length === 0">
                <td colspan="9" class="px-6 py-4 text-center text-sm text-gray-500">
                  <span v-if="searchKeyword">"{{ searchKeyword }}"에 대한 검색 결과가 없습니다.</span>
                  <span v-else>등록된 광고가 없습니다.</span>
                </td>
              </tr>
              <tr
                  v-for="ad in pagedAdList"
                  :key="ad.id"
                  class="hover:bg-gray-50 cursor-pointer"
                  @click="goToDetail(ad.id)"
              >
                <td class="px-6 py-4 text-center font-mono text-sm">{{ ad.id }}</td>
                <td class="px-6 py-4 flex justify-center items-center">
                  <img
                      v-if="ad.imageUrl"
                      :src="`${IMAGE_BASE_URL}/ad/${ad.imageUrl}`"
                      alt="광고 이미지"
                      class="w-80 h-20 object-cover rounded-lg shadow"
                      style="min-width: 320px; min-height: 80px;"
                  />
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 font-semibold text-sm truncate">{{ ad.title }}</td>
                <td class="px-6 py-4 text-center text-sm">{{ ad.companyName }}</td>
                <td class="px-6 py-4 text-center">
                  <span
                      :class="[
                      'inline-block rounded-full px-3 py-1 text-sm font-bold',
                      ad.status === 'ONGOING'
                        ? 'bg-green-100 text-green-700'
                        : ad.status === 'SCHEDULED'
                        ? 'bg-yellow-100 text-yellow-700'
                        : ad.status === 'ENDING_SOON'
                        ? 'bg-orange-100 text-orange-700'
                        : ad.status === 'ENDED'
                        ? 'bg-gray-200 text-gray-500'
                        : ad.status === 'DELETED'
                        ? 'bg-red-100 text-red-500'
                        : 'bg-gray-100 text-gray-400'
                    ]"
                  >
                    {{ statusText(ad.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center text-sm">{{ ad.extensionCount }}회</td>
                <td class="px-6 py-4 text-center text-sm">{{ formatDate(ad.startDateTime) }}</td>
                <td class="px-6 py-4 text-center text-sm">{{ formatDate(ad.endDateTime) }}</td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center items-center gap-2" @click.stop>
                    <button
                        class="px-4 py-1 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200 hover:bg-blue-100 transition"
                        @click="goEdit(ad.id)"
                    >수정</button>
                    <button
                        class="px-4 py-1 rounded bg-green-50 text-green-700 font-semibold border border-green-200 hover:bg-green-100 transition"
                        @click="goExtend(ad.id)"
                    >연장</button>
                    <button
                        class="px-4 py-1 rounded bg-red-50 text-red-700 font-semibold border border-red-200 hover:bg-red-100 transition"
                        @click="handleDelete(ad.id)"
                    >삭제</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 페이지네이션 -->
        <div v-if="totalPages > 1" class="flex justify-center mt-4">
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click.prevent="() => { if (page > 1) page-- }"
              :disabled="page === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'text-gray-300 cursor-not-allowed': page === 1 }"
            >이전</button>
            <button
              v-for="p in totalPages"
              :key="p"
              @click.prevent="() => { page = p }"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              :class="{ 'z-10 bg-blue-50 border-blue-500 text-blue-600': page === p }"
            >{{ p }}</button>
            <button
              @click.prevent="() => { if (page < totalPages) page++ }"
              :disabled="page === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'text-gray-300 cursor-not-allowed': page === totalPages }"
            >다음</button>
          </nav>
        </div>
      </div>
    </div>
    
    <CommonModal
      :isOpen="modalOpen"
      :title="modalTitle"
      :message="modalMessage"
      :confirmText="modalConfirmText"
      :confirmType="modalConfirmType"
      :showCancel="modalShowCancel"
      @close="closeModal"
      @confirm="modalConfirmAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchAds, deleteAd } from '@/modules/ad/api/adApi.js'
import SearchBar from '@/modules/ad/components/SearchBar.vue'
import AppBreadcrumb from '@/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'
import AlertMessage from '@/modules/adminpage/dashboard/components/AlertMessage.vue'

const IMAGE_BASE_URL = import.meta.env.VITE_BASE_URL+"/uploads"

const router = useRouter()
const adList = ref([])
const searchKeyword = ref('')
const currentFilter = ref('all')
const page = ref(1)
const pageSize = 10

// Alert state
const showAlert = ref(false)
const alertMessage = ref('')

// Modal state
const modalOpen = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const modalConfirmText = ref('확인')
const modalConfirmType = ref('primary')
const modalShowCancel = ref(false)
let modalConfirmAction = () => { modalOpen.value = false }

const openModal = (title, message, confirmText = '확인', confirmType = 'primary', showCancel = false, onConfirm = null) => {
  modalTitle.value = title
  modalMessage.value = message
  modalConfirmText.value = confirmText
  modalConfirmType.value = confirmType
  modalShowCancel.value = showCancel
  modalOpen.value = true
  modalConfirmAction = onConfirm || (() => { modalOpen.value = false })
}

const closeModal = () => { modalOpen.value = false }

const goToDetail = (id) => {
  router.push(`/admin/ad/${id}`)
}

const fetchData = async () => {
  try {
    adList.value = (await fetchAds()).sort((a, b) => b.id - a.id)
  } catch (e) {
    openModal('오류', '광고 목록을 불러올 수 없습니다.', '확인', 'danger')
  }
}

// 검색 기능
const handleSearch = (keyword) => {
  searchKeyword.value = keyword
}

const resetSearch = () => {
  searchKeyword.value = ''
  currentFilter.value = 'all'
}

// 필터링된 광고 목록
const filteredAdList = computed(() => {
  let filtered = adList.value

  // 필터 적용
  switch (currentFilter.value) {
    case 'scheduled':
      filtered = filtered.filter(ad => ad.status === 'SCHEDULED')
      break
    case 'ongoing':
      filtered = filtered.filter(ad => ad.status === 'ONGOING')
      break
    case 'ending_soon':
      filtered = filtered.filter(ad => ad.status === 'ENDING_SOON')
      break
    case 'ended':
      filtered = filtered.filter(ad => ad.status === 'ENDED')
      break
    case 'all':
    default:
      // 전체는 필터링하지 않음
      break
  }

  // 검색어 적용
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(ad => 
      ad.title.toLowerCase().includes(keyword) ||
      ad.companyName.toLowerCase().includes(keyword) ||
      statusText(ad.status).toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 수정 버튼 클릭 이벤트
const goEdit = (id) => {
  router.push({ name: 'AdminAdEdit', params: { id } })
}
const goExtend = (id) => {
  router.push({ name: 'AdminAdExtend', params: { id } })
}

const handleDelete = async (id) => {
  openModal('삭제 확인', '정말 삭제하시겠습니까?', '삭제', 'danger', true, async () => {
    try {
      await deleteAd(id)
      await fetchData()
      alertMessage.value = '삭제되었습니다.'
      showAlert.value = true
    } catch (e) {
      openModal('오류', '삭제에 실패했습니다.', '확인', 'danger')
    } finally {
      modalOpen.value = false
    }
  })
}

const statusText = (status) => {
  switch (status) {
    case 'SCHEDULED': return '예정'
    case 'ONGOING': return '진행중'
    case 'ENDING_SOON': return '종료임박'
    case 'ENDED': return '종료됨'
    case 'DELETED': return '삭제됨'
    default: return status
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.length > 10 ? date.slice(0, 10) : date
}

const totalPages = computed(() => Math.ceil(filteredAdList.value.length / pageSize))
const pagedAdList = computed(() =>
  filteredAdList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

// 필터별 개수 계산
const scheduledCount = computed(() => 
  adList.value.filter(ad => ad.status === 'SCHEDULED').length
)
const ongoingCount = computed(() => 
  adList.value.filter(ad => ad.status === 'ONGOING').length
)
const endingSoonCount = computed(() => 
  adList.value.filter(ad => ad.status === 'ENDING_SOON').length
)
const endedCount = computed(() => 
  adList.value.filter(ad => ad.status === 'ENDED').length
)

const setFilter = (filter) => {
  currentFilter.value = filter
  page.value = 1 // 필터 변경 시 첫 페이지로 이동
}

const downloadAds = async () => {
  try {
    // 현재 필터링된 데이터를 기반으로 다운로드할지, 전체 데이터를 다운로드할지 선택
    const downloadData = currentFilter.value === 'all' ? adList.value : filteredAdList.value;
    
    if (downloadData.length === 0) {
      openModal('알림', '다운로드할 광고 데이터가 없습니다.', '확인', 'warning')
      return;
    }

    // 파일 다운로드 요청
    const response = await fetch('/api/ad/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      body: JSON.stringify({
        ads: downloadData,
        filter: currentFilter.value,
        searchKeyword: searchKeyword.value
      })
    })
    
    // HTTP 상태 코드 확인
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`다운로드 오류 응답 (${response.status}):`, errorText);
      throw new Error(`서버 응답 오류 ${response.status}: ${errorText}`);
    }
    
    // 응답 헤더에서 콘텐츠 타입과 파일명 확인
    const contentType = response.headers.get('Content-Type');
    const contentDisposition = response.headers.get('Content-Disposition');
    console.log('응답 콘텐츠 타입:', contentType);
    console.log('응답 Content-Disposition:', contentDisposition);
    
    const blob = await response.blob()
    
    // Blob의 타입을 Excel MIME 타입으로 설정
    const excelBlob = new Blob([blob], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(excelBlob)
    const a = document.createElement('a')
    a.href = url
    
    // 파일명 생성 (현재 필터와 날짜 포함)
    let filename = 'ads-list.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    } else {
      // 기본 파일명에 필터 정보 추가
      const now = new Date().toISOString().slice(0, 10);
      const filterText = currentFilter.value === 'all' ? '전체' : 
                        currentFilter.value === 'scheduled' ? '예정' :
                        currentFilter.value === 'ongoing' ? '진행중' :
                        currentFilter.value === 'ending_soon' ? '종료임박' :
                        currentFilter.value === 'ended' ? '종료됨' : '전체';
      filename = `광고목록_${filterText}_${now}.xlsx`;
    }
    
    a.download = filename;
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    openModal('완료', `${downloadData.length}개의 광고 데이터가 엑셀 파일로 다운로드되었습니다.`, '확인', 'success')
  } catch (error) {
    console.error('광고 다운로드 실패:', error)
    openModal('오류', '광고 데이터 다운로드 중 오류가 발생했습니다: ' + error.message, '확인', 'danger')
  }
}

watch(showAlert, (val) => {
  if (val) {
    setTimeout(() => { showAlert.value = false }, 2000)
  }
})

onMounted(fetchData)
</script>

