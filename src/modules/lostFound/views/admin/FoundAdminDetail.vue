<template>
  <Modal @close="$emit('close')">
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-4">습득물 상세보기</h2>
      <div class="space-y-2 text-sm">
        <p><strong>물품명:</strong> {{ item.itemName }}</p>
        <p><strong>버스 회사:</strong> {{ item.busCompany }}</p>
        <p><strong>버스 번호:</strong> {{ item.busNumber }}</p>
        <p><strong>내용:</strong> {{ item.content }}</p>
        <p><strong>습득일:</strong> {{ formatDate(item.foundTime) }}</p>
        <p><strong>습득 장소:</strong> {{ item.foundPlace }}</p>
        <p><strong>보관 위치:</strong> {{ item.storageLocation }}</p>
        <p><strong>상태:</strong> {{ statusLabel(item.status) }}</p>
        <p><strong>연락처:</strong> {{ item.handlerContact }}</p>
        <p><strong>이메일:</strong> {{ item.handlerEmail }}</p>
        <div>
          <p><strong>등록된 이미지:</strong></p>
          <img v-if="item.photoUrl" :src="item.photoUrl" alt="습득물 이미지" class="w-32 h-32 object-cover border rounded" />
          <p v-else class="text-gray-500">이미지 없음</p>
        </div>
      </div>
      <div class="mt-6 text-right">
        <button @click="$emit('edit')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          수정
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from '@/modules/lostFound/components/Modal.vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  item: Object
})

const emit = defineEmits(['close', 'edit'])

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}

const statusLabel = (status) => {
  const map = {
    IN_STORAGE: '보관중',
    RETURNED: '수령완료'
  }
  return map[status] || status
}
</script>
