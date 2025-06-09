<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">광고 관리</h1>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="openCreateModal"
      >
        광고 등록
      </button>
    </div>

    <!-- 광고 목록 -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="ad in advertisements"
        :key="ad.id"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="relative">
          <img
            :src="ad.imageUrl"
            :alt="ad.title"
            class="w-full h-48 object-cover"
          />
          <div
            :class="[
              'absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full',
              ad.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ ad.isActive ? '활성' : '비활성' }}
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900">{{ ad.title }}</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ formatDate(ad.startDate) }} - {{ formatDate(ad.endDate) }}
          </p>
          <div class="mt-4 flex justify-between items-center">
            <div class="flex space-x-2">
              <button
                class="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                @click="editAd(ad)"
              >
                수정
              </button>
              <button
                class="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                @click="deleteAd(ad.id)"
              >
                삭제
              </button>
            </div>
            <button
              :class="[
                'px-3 py-1 text-sm rounded-md',
                ad.isActive
                  ? 'text-red-600 hover:text-red-800'
                  : 'text-green-600 hover:text-green-800'
              ]"
              @click="toggleAdStatus(ad)"
            >
              {{ ad.isActive ? '비활성화' : '활성화' }}
            </button>
          </div>
        </div>
      </div>
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
import { ref, onMounted } from 'vue'

// 상태 데이터
const advertisements = ref([])
const currentPage = ref(1)
const totalPages = ref(1)

// 데이터 가져오기
const fetchAdvertisements = async (page) => {
  try {
    const response = await fetch(`/api/admin/advertisements?page=${page}`)
    const data = await response.json()
    advertisements.value = data.advertisements
    totalPages.value = data.totalPages
  } catch (error) {
    console.error('광고 데이터 로딩 실패:', error)
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchAdvertisements(page)
}

// 광고 등록 모달 열기
const openCreateModal = () => {
  // TODO: 광고 등록 모달 구현
}

// 광고 수정
const editAd = (ad) => {
  // TODO: 광고 수정 모달 구현
}

// 광고 삭제
const deleteAd = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    await fetch(`/api/admin/advertisements/${id}`, {
      method: 'DELETE'
    })
    await fetchAdvertisements(currentPage.value)
  } catch (error) {
    console.error('광고 삭제 실패:', error)
  }
}

// 광고 상태 토글
const toggleAdStatus = async (ad) => {
  try {
    await fetch(`/api/admin/advertisements/${ad.id}/toggle`, {
      method: 'POST'
    })
    await fetchAdvertisements(currentPage.value)
  } catch (error) {
    console.error('광고 상태 변경 실패:', error)
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
  fetchAdvertisements(1)
})
</script> 