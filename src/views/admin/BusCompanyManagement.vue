<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">버스회사 관리자 계정 관리</h1>
      <div class="flex space-x-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="회사명 또는 이메일로 검색..."
          class="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        />
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="openCreateModal"
        >
          관리자 계정 추가
        </button>
      </div>
    </div>

    <!-- 버스회사 관리자 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              회사 정보
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              관리자 정보
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              등록일
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              관리
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="company in filteredCompanies" :key="company.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    v-if="company.logo"
                    :src="company.logo"
                    :alt="company.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ company.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ company.businessNumber }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ company.adminName }}</div>
              <div class="text-sm text-gray-500">{{ company.adminEmail }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(company.registeredAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(company.status)
                ]"
              >
                {{ getStatusText(company.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900"
                  @click="editCompany(company)"
                >
                  수정
                </button>
                <button
                  v-if="company.status === 'active'"
                  class="text-red-600 hover:text-red-900"
                  @click="deactivateCompany(company)"
                >
                  비활성화
                </button>
                <button
                  v-if="company.status === 'inactive'"
                  class="text-green-600 hover:text-green-900"
                  @click="activateCompany(company)"
                >
                  활성화
                </button>
                <button
                  class="text-red-600 hover:text-red-900"
                  @click="resetPassword(company)"
                >
                  비밀번호 초기화
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="flex justify-center mt-6">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          이전
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          :class="[
            'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium',
            currentPage === page
              ? 'text-blue-600 border-blue-500'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          다음
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 상태 데이터
const companies = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')

// 필터링된 회사 목록
const filteredCompanies = computed(() => {
  return companies.value.filter(company => {
    const searchLower = searchQuery.value.toLowerCase()
    return (
      company.name.toLowerCase().includes(searchLower) ||
      company.adminEmail.toLowerCase().includes(searchLower)
    )
  })
})

// 데이터 가져오기
const fetchCompanies = async (page) => {
  try {
    const response = await fetch(`/api/admin/bus-companies?page=${page}`)
    const data = await response.json()
    companies.value = data.companies
    totalPages.value = data.totalPages
  } catch (error) {
    console.error('버스회사 데이터 로딩 실패:', error)
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchCompanies(page)
}

// 상태에 따른 스타일 클래스
const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// 상태 텍스트
const getStatusText = (status) => {
  const texts = {
    active: '활성',
    inactive: '비활성',
    pending: '승인대기'
  }
  return texts[status] || status
}

// 관리자 계정 추가 모달 열기
const openCreateModal = () => {
  // TODO: 관리자 계정 추가 모달 구현
}

// 회사 정보 수정
const editCompany = (company) => {
  // TODO: 회사 정보 수정 모달 구현
}

// 회사 비활성화
const deactivateCompany = async (company) => {
  if (!confirm(`${company.name}를 비활성화하시겠습니까?`)) return

  try {
    await fetch(`/api/admin/bus-companies/${company.id}/deactivate`, {
      method: 'POST'
    })
    await fetchCompanies(currentPage.value)
  } catch (error) {
    console.error('회사 비활성화 실패:', error)
  }
}

// 회사 활성화
const activateCompany = async (company) => {
  if (!confirm(`${company.name}를 활성화하시겠습니까?`)) return

  try {
    await fetch(`/api/admin/bus-companies/${company.id}/activate`, {
      method: 'POST'
    })
    await fetchCompanies(currentPage.value)
  } catch (error) {
    console.error('회사 활성화 실패:', error)
  }
}

// 비밀번호 초기화
const resetPassword = async (company) => {
  if (!confirm(`${company.name} 관리자의 비밀번호를 초기화하시겠습니까?`)) return

  try {
    await fetch(`/api/admin/bus-companies/${company.id}/reset-password`, {
      method: 'POST'
    })
    alert('비밀번호가 초기화되었습니다. 관리자에게 초기화된 비밀번호가 이메일로 전송됩니다.')
  } catch (error) {
    console.error('비밀번호 초기화 실패:', error)
  }
}

// 날짜 포맷
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchCompanies(1)
})
</script> 