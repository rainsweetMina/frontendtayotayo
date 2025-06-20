<template>
  <div class="reverse-geocoding-example">
    <h2 class="text-xl font-bold mb-4">역지오코딩 예시</h2>
    
    <div class="mb-4 flex gap-2">
      <div class="w-1/2">
        <label class="block text-sm font-medium mb-1">위도</label>
        <input 
          v-model="latitude" 
          type="text" 
          class="w-full px-3 py-2 border rounded-md"
          placeholder="위도 (예: 37.5665)"
        />
      </div>
      <div class="w-1/2">
        <label class="block text-sm font-medium mb-1">경도</label>
        <input 
          v-model="longitude" 
          type="text" 
          class="w-full px-3 py-2 border rounded-md"
          placeholder="경도 (예: 126.9780)"
        />
      </div>
    </div>
    
    <button 
      @click="getAddress" 
      class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
      :disabled="loading"
    >
      {{ loading ? '주소 가져오는 중...' : '주소 가져오기' }}
    </button>
    
    <div v-if="error" class="p-4 mb-4 bg-red-100 border border-red-300 rounded-md text-red-700">
      {{ error }}
    </div>
    
    <div v-if="address" class="p-4 bg-gray-100 border rounded-md">
      <h3 class="font-bold mb-2">주소 정보:</h3>
      <pre class="whitespace-pre-wrap">{{ JSON.stringify(address, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { reverseGeocode } from '@/api/axiosInstance'

export default {
  name: 'ReverseGeocodingExample',
  setup() {
    const latitude = ref('37.5665')  // 서울 시청 기본값
    const longitude = ref('126.9780')
    const address = ref(null)
    const loading = ref(false)
    const error = ref(null)
    
    const getAddress = async () => {
      if (!latitude.value || !longitude.value) {
        error.value = '위도와 경도를 모두 입력해주세요.'
        return
      }
      
      loading.value = true
      error.value = null
      
      try {
        const result = await reverseGeocode(latitude.value, longitude.value)
        address.value = result
      } catch (err) {
        console.error('주소 가져오기 실패:', err)
        error.value = '주소를 가져오는 데 실패했습니다. 다시 시도해주세요.'
      } finally {
        loading.value = false
      }
    }
    
    return {
      latitude,
      longitude,
      address,
      loading,
      error,
      getAddress
    }
  }
}
</script> 