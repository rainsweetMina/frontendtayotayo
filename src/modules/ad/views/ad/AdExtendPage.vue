<template>
  <div class="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 mb-8">광고 연장</h2>

    <!-- 광고 ID -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-gray-700 mb-1">광고 ID</label>
      <input
          type="text"
          :value="adId"
          disabled
          class="w-full px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
      />
    </div>

    <!-- 기존 종료일 -->
    <div class="mb-5">
      <label class="block text-sm font-medium text-gray-700 mb-1">기존 종료일</label>
      <input
          type="text"
          :value="ad?.endDateTime ? formatDate(ad.endDateTime) : '-'"
          disabled
          class="w-full px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
      />
    </div>

    <!-- 새 종료일 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">새 종료일</label>
      <input
          type="datetime-local"
          v-model="newEndDateTime"
          :min="minEndDateTime"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <!-- 버튼 -->
    <div class="flex justify-end gap-3">
      <button
          class="px-4 py-2 text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
          @click="goBack"
      >
        취소
      </button>
      <button
          class="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded"
          @click="handleExtension"
      >
        연장 요청
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { extendAd, fetchAd } from '@/modules/ad/api/adApi.js'

const router = useRouter()
const route = useRoute()

const adId = route.params.id
const ad = ref(null)
const newEndDateTime = ref('')

const fetchAdData = async () => {
  try {
    ad.value = await fetchAd(adId)
  } catch (e) {
    alert('광고 정보를 불러오지 못했습니다.')
    router.push('/admin/ad')
  }
}

onMounted(fetchAdData)

const minEndDateTime = computed(() => {
  return new Date().toISOString().slice(0, 16)
})

const handleExtension = async () => {
  if (!newEndDateTime.value) {
    alert('새 종료일을 입력해주세요.')
    return
  }

  try {
    await extendAd(adId, newEndDateTime.value)
    alert(`광고가 성공적으로 연장되었습니다.\n새 종료일: ${newEndDateTime.value.replace('T', ' ')}`)
    router.push('/admin/ad')
  } catch (e) {
    alert('광고 연장에 실패했습니다.')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return dateStr.replace('T', ' ').slice(0, 16)
}

const goBack = () => {
  router.push('/admin/ad')
}

// const minEndDateTime = computed(() => {
//   return ad.value?.endDateTime
//       ? new Date(ad.value.endDateTime).toISOString().slice(0, 16)
//       : new Date().toISOString().slice(0, 16)
// })

</script>

<style scoped>
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
}
</style>
