<template>
  <div>
    <!-- Breadcrumb -->
    <AppBreadcrumb breadcrumb="광고 회사 관리" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700 capitalize mb-4">
          광고 회사 관리
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
        
        <!-- 검색/엑셀/등록 버튼 flex row -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2 items-center">
            <SearchBar
              placeholder="회사명, 담당자명, 연락처, 이메일 검색"
              @search="handleSearch"
              @reset="resetSearch"
            />
          </div>
          <div class="flex space-x-2 items-center">
            <router-link
              to="/admin/adcompany/create"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >회사 등록</router-link>
            <button
              @click="downloadCompanies"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              엑셀 다운로드
            </button>
          </div>
        </div>
        <!-- 테이블 -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">회사명</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">담당자명</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredCompanyList.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  <span v-if="searchKeyword">"{{ searchKeyword }}"에 대한 검색 결과가 없습니다.</span>
                  <span v-else>등록된 광고 회사가 없습니다.</span>
                </td>
              </tr>
              <tr
                v-for="company in pagedCompanyList"
                :key="company.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="goToDetail(company.id)"
              >
                <td class="px-6 py-4 text-center font-mono text-sm">{{ company.id }}</td>
                <td class="px-6 py-4 font-semibold text-sm">{{ company.name }}</td>
                <td class="px-6 py-4 text-sm">{{ company.managerName }}</td>
                <td class="px-6 py-4 text-center text-sm">{{ company.contactNumber }}</td>
                <td class="px-6 py-4 text-center text-sm">{{ company.email }}</td>
                <td class="px-6 py-4 text-center text-sm">
                  <div class="flex justify-center items-center gap-2">
                    <router-link
                      :to="`/admin/adcompany/edit/${company.id}`"
                      class="text-blue-600 hover:text-blue-900 mr-2"
                      @click.stop
                    >수정</router-link>
                    <button
                      class="text-red-600 hover:text-red-900"
                      @click.stop="handleDelete(company.id)"
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
import { fetchAdCompanies, deleteAdCompany } from '@/modules/ad/api/adCompanyApi.js'
import SearchBar from '@/modules/ad/components/SearchBar.vue'
import AppBreadcrumb from '@/partials/AppBreadcrumb.vue'
import CommonModal from '@/components/CommonModal.vue'
import AlertMessage from '@/modules/adminpage/dashboard/components/AlertMessage.vue'

const router = useRouter()
const companyList = ref([])
const searchKeyword = ref('')
const page = ref(1)
const pageSize = 10
const totalPages = computed(() => Math.ceil(companyList.value.length / pageSize))
const pagedCompanyList = computed(() =>
  companyList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
)

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
  router.push(`/admin/adcompany/${id}`)
}

const fetchData = async () => {
  try {
    companyList.value = (await fetchAdCompanies()).sort((a, b) => b.id - a.id)
    console.log('Fetched companies:', companyList.value)
  } catch (e) {
    openModal('오류', '광고 회사 목록을 불러올 수 없습니다.', '확인', 'danger')
  }
}

// 검색 기능
const handleSearch = (keyword) => {
  console.log('Search keyword:', keyword)
  searchKeyword.value = keyword
}

const resetSearch = () => {
  searchKeyword.value = ''
}

// 필터링된 회사 목록
const filteredCompanyList = computed(() => {
  console.log('Computing filtered list, keyword:', searchKeyword.value)
  console.log('Original list length:', companyList.value.length)
  
  if (!searchKeyword.value) {
    return companyList.value
  }
  
  const keyword = searchKeyword.value.toLowerCase()
  const filtered = companyList.value.filter(company => {
    const matches = 
      (company.name && company.name.toLowerCase().includes(keyword)) ||
      (company.managerName && company.managerName.toLowerCase().includes(keyword)) ||
      (company.contactNumber && company.contactNumber.toLowerCase().includes(keyword)) ||
      (company.email && company.email.toLowerCase().includes(keyword))
    
    console.log(`Company ${company.name}: matches = ${matches}`)
    return matches
  })
  
  console.log('Filtered list length:', filtered.length)
  return filtered
})

const handleDelete = async (id) => {
  openModal('삭제 확인', '정말 삭제하시겠습니까?', '삭제', 'danger', true, async () => {
    modalOpen.value = false // 모달 닫기
    try {
      await deleteAdCompany(id)
      await fetchData()
      alertMessage.value = '삭제되었습니다.'
      showAlert.value = true
    } catch (e) {
      openModal('오류', '삭제에 실패했습니다.', '확인', 'danger')
    }
  })
}

const downloadCompanies = async () => {
  try {
    // 현재 검색된 데이터를 기반으로 다운로드
    const downloadData = filteredCompanyList.value;
    
    if (downloadData.length === 0) {
      openModal('알림', '다운로드할 광고 회사 데이터가 없습니다.', '확인', 'warning')
      return;
    }

    // 파일 다운로드 요청
    const response = await fetch('/api/ad/companies/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      body: JSON.stringify({
        companies: downloadData,
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
    
    // 파일명 생성 (검색어와 날짜 포함)
    let filename = 'ad-companies-list.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    } else {
      // 기본 파일명에 검색어 정보 추가
      const now = new Date().toISOString().slice(0, 10);
      const searchText = searchKeyword.value ? `_${searchKeyword.value}` : '';
      filename = `광고회사목록${searchText}_${now}.xlsx`;
    }
    
    a.download = filename;
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    openModal('완료', `${downloadData.length}개의 광고 회사 데이터가 엑셀 파일로 다운로드되었습니다.`, '확인', 'success')
  } catch (error) {
    console.error('광고 회사 다운로드 실패:', error)
    openModal('오류', '광고 회사 데이터 다운로드 중 오류가 발생했습니다: ' + error.message, '확인', 'danger')
  }
}

watch(showAlert, (val) => {
  if (val) {
    setTimeout(() => { showAlert.value = false }, 2000)
  }
})

onMounted(fetchData)
</script> 