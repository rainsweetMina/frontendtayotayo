<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="공지사항 상세" />

    <div class="mt-4">
      <div class="p-6 bg-white rounded-md shadow-md">
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm">{{ error }}</p>
            </div>
          </div>
        </div>

        <div v-else-if="notice">
          <div class="border-b border-gray-200 pb-4 mb-4">
            <h2 class="text-xl font-semibold text-gray-800">{{ notice.title }}</h2>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                {{ notice.author }}
              </span>
              <span>{{ formatDate(notice.createdDate) }}</span>
            </div>
          </div>

          <div class="py-4">
            <div v-if="notice.showPopup" class="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    <span class="font-medium">팝업 표시:</span> 
                    {{ formatDate(notice.popupStart) }} ~ {{ formatDate(notice.popupEnd) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="prose max-w-none">
              <!-- HTML 콘텐츠 렌더링 -->
              <div v-html="notice.content"></div>
            </div>

            <div v-if="notice.files && notice.files.length > 0" class="mt-8 border-t border-gray-200 pt-6">
              <h5 class="text-lg font-medium text-gray-900 mb-4">첨부파일</h5>
              <div v-for="(file, index) in notice.files" :key="index" class="mb-4">
                <!-- 이미지 파일인 경우 직접 표시 -->
                <div v-if="isImageFile(file)" class="mb-3">
                  <div class="bg-gray-100 p-2 rounded-lg mb-2">
                    <img 
                      :src="getImageUrl(file, index)" 
                      :alt="file.originalName"
                      class="max-h-64 mx-auto rounded-md"
                    />
                  </div>
                  <div class="flex items-center">
                    <span class="text-sm text-gray-700 mr-2">{{ file.originalName }}</span>
                    <span class="text-xs text-gray-500 mr-3">({{ formatFileSize(file.fileSize) }})</span>
                    <button 
                      @click="downloadFile(file, index)" 
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
                    >
                      <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      다운로드
                    </button>
                  </div>
                </div>
                
                <!-- 이미지 파일이 아닌 경우 다운로드 버튼만 표시 -->
                <div v-else class="flex items-center">
                  <button 
                    @click="downloadFile(file, index)" 
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
                  >
                    <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {{ file.originalName }}
                    <span class="text-xs text-gray-500 ml-1">({{ formatFileSize(file.fileSize) }})</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div v-else-if="notice.fileUrl || notice.fileDownloadUrl || notice.filePath" class="mt-8 border-t border-gray-200 pt-6">
              <h5 class="text-lg font-medium text-gray-900 mb-4">첨부파일</h5>
              <button 
                @click="downloadSingleFile()" 
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
              >
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {{ notice.fileName || '파일 다운로드' }}
              </button>
            </div>
            
            <div v-else-if="notice.fileName" class="mt-8 border-t border-gray-200 pt-6">
              <h5 class="text-lg font-medium text-gray-900 mb-4">첨부파일</h5>
              <button 
                @click="downloadByFileName()" 
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50"
              >
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {{ notice.fileName }}
              </button>
            </div>
          </div>

          <div class="pt-4 mt-6 border-t border-gray-200 flex justify-end space-x-3">
            <router-link to="/admin/notices" class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              목록
            </router-link>
            <router-link :to="`/admin/notices/${notice.id}/edit`" class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
              수정
            </router-link>
            <button @click="handleDelete" class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNoticeApi } from '../../composables/useNoticeApi.js'
import axios from '@/api/axiosInstance'
import Breadcrumb from '../../partials/AppBreadcrumb.vue'

const route = useRoute()
const router = useRouter()

// BASE_URL을 computed로 선언
const BASE_URL = computed(() => import.meta.env.VITE_BASE_URL)

const notice = ref(null)
const isLoading = ref(false)
const error = ref('')

const { getNoticeDetail, deleteNotice } = useNoticeApi()

// 이미지 파일인지 확인하는 함수
const isImageFile = (file) => {
  if (!file || !file.fileType) return false
  return file.fileType.startsWith('image/')
}

// 이미지 URL 생성
const getImageUrl = (file, index) => {
  return `${BASE_URL.value}/api/admin/notices/${notice.value.id}/images/${index}`
}

const fetchNotice = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    console.log('Fetching notice detail for id:', route.params.id)
    const response = await getNoticeDetail(route.params.id)
    notice.value = response.data
    
    console.log('Notice data:', notice.value)
    
    // 파일 정보 디버깅
    const fileFields = {
      fileUrl: notice.value.fileUrl,
      files: notice.value.files,
      fileName: notice.value.fileName,
      fileUrls: notice.value.fileUrls,
      attachments: notice.value.attachments,
      filePath: notice.value.filePath,
      fileId: notice.value.fileId
    }
    console.log('File related fields:', fileFields)
    
    if (notice.value.files) {
      console.log('Files array detail:', notice.value.files)
      if (notice.value.files.length > 0) {
        console.log('First file:', notice.value.files[0])
      }
    }
    
    // 모든 키 출력
    console.log('All notice keys:', Object.keys(notice.value))
    
  } catch (err) {
    console.error('공지사항 조회 실패:', err)
    error.value = '공지사항을 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await deleteNotice(route.params.id)
      alert('삭제되었습니다.')
      router.push('/admin/notices')
    } catch (err) {
      console.error('삭제 실패:', err)
      alert('삭제에 실패했습니다.')
    }
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 파일 다운로드 URL 생성
const getFileDownloadUrl = (file, index) => {
  // NoticeFile 엔티티 구조에 맞게 처리
  if (file && typeof file === 'object') {
    // originalName이 있는 경우 (NoticeFile 엔티티)
    if (file.originalName) {
      return `${BASE_URL.value}/api/admin/notices/${notice.value.id}/files/${index}`
    }
    
    // file 객체에 직접 URL이 있는 경우
    if (file.url || file.fileUrl || file.downloadUrl) {
      const url = file.url || file.fileUrl || file.downloadUrl
      return url.startsWith('http') ? url : `${BASE_URL.value}${url}`
    }
  }
  
  // file이 문자열인 경우 (파일명만 있는 경우)
  if (typeof file === 'string') {
    return `${BASE_URL.value}/api/admin/notices/${notice.value.id}/download?filename=${encodeURIComponent(file)}`
  }
  
  // 기본 다운로드 경로
  return `${BASE_URL.value}/api/admin/notices/${notice.value.id}/download`
}

// 파일명 추출
const getFileName = (file) => {
  if (typeof file === 'string') return file
  // NoticeFile 엔티티 구조
  return file.originalName || file.fileName || file.name || `파일 ${file.id || ''}`
}

// 단일 파일 URL 가져오기
const getSingleFileUrl = () => {
  const n = notice.value
  
  // 다양한 가능한 필드명 확인
  const url = n.fileUrl || n.fileDownloadUrl || n.filePath || n.downloadUrl
  
  if (url) {
    // 절대 경로인지 확인
    return url.startsWith('http') ? url : `${BASE_URL.value}${url}`
  }
  
  // 기본 다운로드 경로 (첫 번째 파일)
  return `${BASE_URL.value}/api/admin/notices/${n.id}/download`
}

// 파일 다운로드 처리
const downloadFile = async (file, index) => {
  try {
    console.log('Downloading file:', file, 'index:', index)
    
    const url = `${BASE_URL.value}/api/admin/notices/${notice.value.id}/files/${index}`
    console.log('Download URL:', url)
    
    const response = await api.get(url, {
      responseType: 'blob'
    })
    
    // 파일 다운로드 처리
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = file.originalName || '첨부파일'
    
    // 링크 클릭
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 리소스 해제
    window.URL.revokeObjectURL(downloadUrl)
    
    console.log('File download successful')
  } catch (error) {
    console.error('파일 다운로드 실패:', error)
    alert('파일 다운로드에 실패했습니다.')
  }
}

// 단일 파일 다운로드
const downloadSingleFile = async () => {
  try {
    const url = getSingleFileUrl()
    
    const response = await api.get(url, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = notice.value.fileName || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('파일 다운로드 실패:', error)
    alert('파일 다운로드에 실패했습니다.')
  }
}

// 파일명으로 다운로드
const downloadByFileName = async () => {
  try {
    const url = `${BASE_URL.value}/api/admin/notices/${notice.value.id}/download?filename=${encodeURIComponent(notice.value.fileName)}`
    
    const response = await api.get(url, {
      responseType: 'blob'
    })
    
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = notice.value.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('파일 다운로드 실패:', error)
    alert('파일 다운로드에 실패했습니다.')
  }
}

onMounted(fetchNotice)
</script>