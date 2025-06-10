<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">일반회원 계정 관리</h1>
      <div class="flex space-x-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="이름 또는 이메일로 검색..."
          class="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        />
        <select
          v-model="statusFilter"
          class="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">전체</option>
          <option value="active">활성</option>
          <option value="blocked">차단</option>
          <option value="inactive">비활성</option>
        </select>
      </div>
    </div>

    <!-- 사용자 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              회원정보
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              가입일
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              최근 접속일
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
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    v-if="user.avatar"
                    :src="user.avatar"
                    :alt="user.name"
                    class="h-10 w-10 rounded-full"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                  >
                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ user.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.lastLoginAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(user.status)
                ]"
              >
                {{ getStatusText(user.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex space-x-2">
                <button
                  class="text-blue-600 hover:text-blue-900"
                  @click="viewUserDetails(user)"
                >
                  상세보기
                </button>
                <button
                  v-if="user.status === 'active'"
                  class="text-red-600 hover:text-red-900"
                  @click="blockUser(user)"
                >
                  차단
                </button>
                <button
                  v-if="user.status === 'blocked'"
                  class="text-green-600 hover:text-green-900"
                  @click="unblockUser(user)"
                >
                  차단해제
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
import { ref, computed, onMounted, watch } from 'vue'

// 상태 데이터
const users = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
const statusFilter = ref('all')

// 필터링된 사용자 목록
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = 
      statusFilter.value === 'all' || user.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})

// 데이터 가져오기
const fetchUsers = async (page) => {
  try {
    const response = await fetch(`/api/admin/users?page=${page}`)
    const data = await response.json()
    users.value = data.users
    totalPages.value = data.totalPages
  } catch (error) {
    console.error('사용자 데이터 로딩 실패:', error)
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchUsers(page)
}

// 상태에 따른 스타일 클래스
const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// 상태 텍스트
const getStatusText = (status) => {
  const texts = {
    active: '활성',
    blocked: '차단',
    inactive: '비활성'
  }
  return texts[status] || status
}

// 사용자 상세보기
const viewUserDetails = (user) => {
  // TODO: 사용자 상세정보 모달 구현
}

// 사용자 차단
const blockUser = async (user) => {
  if (!confirm(`${user.name} 사용자를 차단하시겠습니까?`)) return

  try {
    await fetch(`/api/admin/users/${user.id}/block`, {
      method: 'POST'
    })
    await fetchUsers(currentPage.value)
  } catch (error) {
    console.error('사용자 차단 실패:', error)
  }
}

// 사용자 차단 해제
const unblockUser = async (user) => {
  if (!confirm(`${user.name} 사용자의 차단을 해제하시겠습니까?`)) return

  try {
    await fetch(`/api/admin/users/${user.id}/unblock`, {
      method: 'POST'
    })
    await fetchUsers(currentPage.value)
  } catch (error) {
    console.error('사용자 차단 해제 실패:', error)
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

// 검색어나 상태 필터 변경 시 데이터 다시 로드
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
  fetchUsers(1)
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchUsers(1)
})
</script> 