<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">공지사항 작성</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- 제목 입력 -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">제목</label>
          <input
            type="text"
            id="title"
            v-model="title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <!-- 내용 입력 -->
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700">내용</label>
          <textarea
            id="content"
            v-model="content"
            rows="10"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <!-- 파일 첨부 -->
        <div>
          <label class="block text-sm font-medium text-gray-700">첨부파일</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label
                  for="file-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>파일 선택</span>
                  <input
                    id="file-upload"
                    type="file"
                    class="sr-only"
                    multiple
                    @change="handleFileChange"
                  />
                </label>
                <p class="pl-1">또는 드래그 앤 드롭</p>
              </div>
              <p class="text-xs text-gray-500">
                PNG, JPG, PDF, DOCX 최대 10MB
              </p>
            </div>
          </div>
          <!-- 선택된 파일 목록 -->
          <ul v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
            <li
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md"
            >
              <span class="text-sm text-gray-600">{{ file.name }}</span>
              <button
                type="button"
                @click="removeFile(index)"
                class="text-red-500 hover:text-red-700"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <!-- 버튼 -->
        <div class="flex justify-end space-x-3">
          <router-link
            to="/notice"
            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            취소
          </router-link>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const title = ref('')
const content = ref('')
const selectedFiles = ref([])

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('content', content.value)
    
    selectedFiles.value.forEach((file) => {
      formData.append('files', file)
    })

    await axios.post('/api/notices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    router.push('/notice')
  } catch (error) {
    console.error('공지사항 등록 실패:', error)
    alert('공지사항 등록에 실패했습니다.')
  }
}
</script> 