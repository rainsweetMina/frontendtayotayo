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
    <div v-if="isLoading && !hasInitialData" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600">로딩 중...</span>
    </div>
    
    <div v-else-if="!isLoading && advertisements.length === 0" class="text-center py-12">
      <div class="text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">광고가 없습니다</h3>
        <p class="mt-1 text-sm text-gray-500">새로운 광고를 등록해보세요.</p>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="ad in advertisements"
        :key="ad.id"
        class="bg-white overflow-hidden shadow rounded-lg"
      >
        <div class="relative">
          <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
            <img
              :src="(ad.imageUrl || ad.image) ? `${IMAGE_BASE_URL}/ad/${ad.imageUrl || ad.image}` : '/placeholder-image.jpg'"
              :alt="ad.title"
              :data-ad-id="ad.id"
              class="w-full h-48 object-cover transition-opacity duration-300"
              :class="{ 'opacity-0': !ad.imageLoaded }"
              @load="ad.imageLoaded = true"
              @error="handleImageError"
            />
            <!-- 이미지 로딩 중 스켈레톤 -->
            <div v-if="!ad.imageLoaded" class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div
            :class="[
              'absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full',
              ad.isActive || ad.active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ (ad.isActive || ad.active) ? '활성' : '비활성' }}
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900">{{ ad.title }}</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ formatDate(ad.startDate || ad.startDateTime) }} - {{ formatDate(ad.endDate || ad.endDateTime) }}
          </p>
          <p v-if="ad.companyName || ad.company?.name" class="mt-1 text-sm text-gray-400">
            {{ ad.companyName || ad.company?.name }}
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
                (ad.isActive || ad.active)
                  ? 'text-red-600 hover:text-red-800'
                  : 'text-green-600 hover:text-green-800'
              ]"
              @click="toggleAdStatus(ad)"
            >
              {{ (ad.isActive || ad.active) ? '비활성화' : '활성화' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="hasInitialData && !isLoading && advertisements.length > 0" class="flex justify-center mt-6">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1 || isLoading"
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
          :disabled="isLoading"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages || isLoading"
          @click="changePage(currentPage + 1)"
        >
          다음
        </button>
      </nav>
    </div>

    <!-- 광고 등록 모달 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">광고 등록</h3>
            <button
              @click="closeCreateModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
            <!-- 제목 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">제목:</label>
              <input 
                v-model="form.title" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
            
            <!-- 이미지 파일 (필수) -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                이미지 파일: <span class="text-red-500">*</span>
              </label>
              <input 
                type="file" 
                accept="image/*" 
                @change="handleImage" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
              <div v-if="preview" class="mt-2">
                <img :src="preview" alt="미리보기" class="max-h-32 rounded border" />
              </div>
            </div>
            
            <!-- 링크 URL -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">링크 URL:</label>
              <input 
                v-model="form.linkUrl" 
                type="url" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
            
            <!-- 시작일/종료일 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">시작일:</label>
                <input 
                  v-model="form.startDate" 
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">종료일:</label>
                <input 
                  v-model="form.endDate" 
                  type="date" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
            </div>
            
            <!-- 광고회사 드롭다운 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">광고회사:</label>
              <select 
                v-model="form.companyId" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required
              >
                <option value="" disabled>선택</option>
                <option v-for="company in companyList" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>
            
            <!-- 팝업 여부 -->
            <div class="mb-6 flex items-center">
              <input 
                v-model="form.isPopup" 
                type="checkbox" 
                id="popup" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="popup" class="ml-2 text-sm text-gray-700">팝업으로 표시</label>
            </div>
            
            <!-- 버튼 -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="closeCreateModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                취소
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? '등록 중...' : '등록' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || '';

// 상태 데이터
const advertisements = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const showCreateModal = ref(false)
const companyList = ref([])
const preview = ref(null)
const isSubmitting = ref(false)
const isLoading = ref(true)
const hasInitialData = ref(false)

// 폼 데이터
const form = ref({
  title: '',
  linkUrl: '',
  startDate: '',
  endDate: '',
  companyId: '',
  isPopup: false,
  imageFile: null
})

// 데이터 가져오기
const fetchAdvertisements = async (page) => {
  // 이미 로딩 중이면 중복 요청 방지
  if (isLoading.value && hasInitialData.value) return
  
  // 초기 로딩이 아닌 경우에만 로딩 상태 표시
  if (hasInitialData.value) {
    isLoading.value = true
  }
  
  try {
    const response = await fetch(`/api/ad?page=${page}`)
    const data = await response.json()
    
    // API 응답 구조에 따라 데이터 처리
    let newAdvertisements = []
    let newTotalPages = 1
    
    if (Array.isArray(data)) {
      // 배열로 직접 반환되는 경우
      newAdvertisements = data
      newTotalPages = Math.ceil(data.length / 10) // 페이지당 10개 가정
    } else if (data.content) {
      // Spring Boot Page 형태로 반환되는 경우
      newAdvertisements = data.content
      newTotalPages = data.totalPages || 1
    } else if (data.advertisements) {
      // advertisements 필드로 반환되는 경우
      newAdvertisements = data.advertisements
      newTotalPages = data.totalPages || 1
    } else {
      // 기타 구조
      newAdvertisements = data
      newTotalPages = 1
    }
    
    // 데이터가 유효한 경우에만 업데이트
    if (newAdvertisements && newAdvertisements.length >= 0) {
      // 각 광고 객체에 이미지 로딩 상태 추가
      newAdvertisements = newAdvertisements.map(ad => ({
        ...ad,
        imageLoaded: false
      }))
      
      advertisements.value = newAdvertisements
      totalPages.value = newTotalPages
      hasInitialData.value = true // 초기 데이터 로드 완료 표시
    }
    
    console.log('광고 목록:', advertisements.value)
  } catch (error) {
    console.error('광고 데이터 로딩 실패:', error)
    // 에러 시에만 빈 배열로 설정
    advertisements.value = []
    totalPages.value = 1
    hasInitialData.value = true // 에러가 발생해도 초기 로딩 완료로 처리
  } finally {
    isLoading.value = false
  }
}

// 광고회사 목록 가져오기
const fetchCompanies = async () => {
  try {
    const response = await fetch('/api/ad-company')
    const data = await response.json()
    companyList.value = data
  } catch (error) {
    console.error('광고회사 목록 로딩 실패:', error)
  }
}

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
  fetchAdvertisements(page)
}

// 광고 등록 모달 열기
const openCreateModal = () => {
  showCreateModal.value = true
  // 폼 초기화
  form.value = {
    title: '',
    linkUrl: '',
    startDate: '',
    endDate: '',
    companyId: '',
    isPopup: false,
    imageFile: null
  }
  preview.value = null
}

// 광고 수정
const editAd = (ad) => {
  // TODO: 광고 수정 모달 구현
}

// 광고 삭제
const deleteAd = async (id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    const response = await fetch(`/api/ad/${id}`, {
      method: 'DELETE'
    })
    
    if (response.ok) {
      await fetchAdvertisements(currentPage.value)
    } else {
      throw new Error('삭제 실패')
    }
  } catch (error) {
    console.error('광고 삭제 실패:', error)
    alert('삭제 실패')
  }
}

// 광고 상태 토글
const toggleAdStatus = async (ad) => {
  try {
    const response = await fetch(`/api/ad/${ad.id}/toggle`, {
      method: 'POST'
    })
    
    if (response.ok) {
      await fetchAdvertisements(currentPage.value)
    } else {
      throw new Error('상태 변경 실패')
    }
  } catch (error) {
    console.error('광고 상태 변경 실패:', error)
    alert('상태 변경 실패')
  }
}

// 광고 등록 핸들러
const handleSubmit = async () => {
  if (!form.value.imageFile) {
    alert('이미지 파일은 필수입니다.')
    return
  }

  isSubmitting.value = true

  try {
    // adDTO 객체 생성
    const adDTO = {
      title: form.value.title,
      linkUrl: form.value.linkUrl,
      startDateTime: form.value.startDate + 'T00:00:00',
      endDateTime: form.value.endDate + 'T23:59:59',
      companyId: form.value.companyId,
      showPopup: form.value.isPopup
    }

    // FormData 생성
    const formData = new FormData()
    formData.append('dto', new Blob([JSON.stringify(adDTO)], { type: 'application/json' }))
    formData.append('image', form.value.imageFile)

    console.log('광고 등록 ---->', form.value.imageFile)

    // API 호출
    const response = await fetch('/api/ad', {
      method: 'POST',
      body: formData
      // Content-Type은 지정하지 않음 (FormData가 자동으로 설정)
    })

    if (response.ok) {
      alert('등록 완료!')
      closeCreateModal()
      await fetchAdvertisements(currentPage.value)
    } else {
      throw new Error('등록 실패')
    }
  } catch (error) {
    console.error('광고 등록 실패:', error)
    alert('등록 실패')
  } finally {
    isSubmitting.value = false
  }
}

// 이미지 핸들러
const handleImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.imageFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 광고 등록 모달 닫기
const closeCreateModal = () => {
  showCreateModal.value = false
  form.value = {
    title: '',
    linkUrl: '',
    startDate: '',
    endDate: '',
    companyId: '',
    isPopup: false,
    imageFile: null
  }
  preview.value = null
}

// 날짜 포맷
const formatDate = (date) => {
  if (!date) return '-'
  
  try {
    // LocalDateTime 형식 (YYYY-MM-DDTHH:mm:ss) 처리
    const dateStr = date.includes('T') ? date.split('T')[0] : date
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('날짜 포맷 오류:', error)
    return date
  }
}

// 이미지 에러 처리
const handleImageError = (event) => {
  event.target.src = `/loading-placeholder.gif`
  // 이미지 로딩 완료로 처리
  const ad = advertisements.value.find(ad => ad.id === event.target.dataset.adId)
  if (ad) {
    ad.imageLoaded = true
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchAdvertisements(1)
  fetchCompanies()
})
</script> 