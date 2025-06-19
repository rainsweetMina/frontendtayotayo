<template>
  <div class="p-5">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">저상버스 대체 안내 상세</h2>
      <div class="flex space-x-2">
        <router-link :to="`/admin/lowfloorbus/${id}/edit`" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">수정</router-link>
        <button @click="deleteLowFloorBus" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">삭제</button>
        <router-link to="/admin/lowfloorbus" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">목록</router-link>
      </div>
    </div>

    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
      {{ error }}
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="lowFloorBus" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <h1 class="text-2xl font-bold mb-4">{{ lowFloorBus.title }}</h1>
        <div class="flex justify-between text-sm text-gray-500 mb-6 pb-4 border-b">
          <div>
            <span>작성자: {{ lowFloorBus.author || '관리자' }}</span>
            <span class="mx-2">|</span>
            <span>작성일: {{ formatDate(lowFloorBus.createdDate) }}</span>
          </div>
          <div>
            <span>조회수: {{ lowFloorBus.viewCount || 0 }}</span>
          </div>
        </div>

        <div class="prose max-w-none mb-8" v-html="lowFloorBus.content"></div>

        <div v-if="lowFloorBus.files && lowFloorBus.files.length > 0" class="mt-8 p-4 bg-gray-50 rounded-md">
          <h3 class="text-lg font-medium mb-2">첨부파일</h3>
          <ul class="space-y-2">
            <li v-for="(file, index) in lowFloorBus.files" :key="index" class="flex items-center">
              <a :href="`https://localhost:8081/api/admin/files/${file.id}/download`" target="_blank" class="text-blue-600 hover:text-blue-800 flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {{ file.originalName }}
                <span class="text-sm text-gray-500 ml-2">({{ formatFileSize(file.fileSize) }})</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLowFloorBusApi } from '../../composables/useLowFloorBusApi.js';

export default {
  name: 'LowFloorBusDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;
    const lowFloorBus = ref(null);
    const isLoading = ref(false);
    const error = ref('');

    const { getLowFloorBusDetail, deleteLowFloorBus: apiDeleteLowFloorBus } = useLowFloorBusApi();

    const fetchLowFloorBusDetail = async () => {
      try {
        isLoading.value = true;
        error.value = '';
        const response = await getLowFloorBusDetail(id);
        
        // 백엔드 응답 구조에 맞게 처리
        if (response.data) {
          lowFloorBus.value = response.data;
        } else {
          throw new Error('저상버스 대체 안내 데이터가 없습니다.');
        }
      } catch (err) {
        console.error('저상버스 대체 안내 상세 조회 실패:', err);
        error.value = '저상버스 대체 안내 상세 정보를 불러오는데 실패했습니다.';
        lowFloorBus.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    const deleteLowFloorBus = async () => {
      if (confirm('정말 삭제하시겠습니까?')) {
        try {
          await apiDeleteLowFloorBus(id);
          router.push('/admin/lowfloorbus');
        } catch (err) {
          console.error('저상버스 대체 안내 삭제 실패:', err);
          alert('저상버스 대체 안내 삭제에 실패했습니다.');
        }
      }
    };

    const formatFileSize = (bytes) => {
      if (!bytes) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    onMounted(fetchLowFloorBusDetail);

    return {
      id,
      lowFloorBus,
      isLoading,
      error,
      deleteLowFloorBus,
      formatFileSize,
      formatDate
    };
  }
};
</script>

<style scoped>
.prose img {
  max-width: 100%;
  height: auto;
}
</style> 